/**
 * Kangen — Backend de reservas (Google Apps Script)
 * -------------------------------------------------
 * Conecta el chat de la web con el Google Calendar real de Raquel:
 *  - GET  ?action=slots  → devuelve los huecos libres (consulta el calendario).
 *  - POST                → crea el evento con Google Meet, guarda la fila en
 *                          la hoja y avisa a Raquel por email. El propio Google
 *                          Calendar manda la invitación (con el Meet) al visitante.
 *
 * No necesita Google Cloud, ni servidor, ni tarjeta. Solo tu cuenta de Google.
 * Pasos de instalación en el archivo INSTRUCCIONES.md de esta misma carpeta.
 */

// ===== CONFIGURA ESTO =====
var EMAIL_AVISO = 'rachel.essens.barcelona@gmail.com';
var NOMBRE_HOJA = 'Reservas';
// ID de la hoja de cálculo (lo saca de la URL de tu hoja de Google, entre
// /d/ y /edit). Déjalo vacío '' solo si el script está pegado DENTRO de la
// hoja (Extensiones → Apps Script). Si dudas, rellénalo: funciona siempre.
var SHEET_ID = '';
var NOMBRE_CALENDARIO = 'Agenda de aguakangen';
var ZONA_HORARIA = 'Europe/Madrid';
var HORA_INICIO = 16;      // 16:00
var HORA_FIN = 20;         // 20:00 (última cita empieza antes de esta hora)
var DURACION_MIN = 15;     // minutos por cita
var DIAS_LABORABLES = [1, 2, 3, 4, 5]; // lunes(1)…viernes(5), sin sábado(6) ni domingo(0)
var HORAS_ANTELACION = 48; // antelación mínima para poder reservar
var DIAS_A_MOSTRAR = 14;   // cuántos días hacia adelante se ofrecen
// ==========================

function doGet(e) {
  var accion = e && e.parameter && e.parameter.action;
  if (accion === 'slots') {
    try {
      var slots = getHuecosDisponibles_();
      return ContentService
        .createTextOutput(JSON.stringify({ ok: true, slots: slots }))
        .setMimeType(ContentService.MimeType.JSON);
    } catch (err) {
      return ContentService
        .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
        .setMimeType(ContentService.MimeType.JSON);
    }
  }
  return ContentService
    .createTextOutput(JSON.stringify({ ok: false, error: 'acción desconocida' }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    var datos = JSON.parse(e.postData.contents);
    var fecha = new Date();

    // 1) Intentamos crear el evento con Meet, pero SIN que un fallo aquí
    //    (nombre del calendario, permisos…) impida guardar el contacto.
    var evento = null;
    var errorEvento = '';
    if (datos.slot) {
      try {
        evento = crearEventoConMeet_(datos);
      } catch (errEv) {
        errorEvento = String(errEv);
      }
    }

    // 2) Guardamos SIEMPRE la fila en la hoja (es el respaldo del lead).
    var hoja = obtenerHoja_();
    hoja.appendRow([
      fecha,
      datos.name || '',
      datos.whatsapp || '',
      datos.email || '',
      datos.goal || '',
      datos.slot ? formatearFecha_(new Date(datos.slot)) : '',
      evento ? (evento.hangoutLink || '') : (errorEvento ? 'ERROR CALENDAR: ' + errorEvento : '')
    ]);

    // 3) Avisamos a Raquel siempre.
    enviarAvisoRaquel_(datos, fecha, evento, errorEvento);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true, meet: evento ? evento.hangoutLink : null, calendarError: errorEvento || null }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ===== Calendario =====

function getCalendario_() {
  var cals = CalendarApp.getCalendarsByName(NOMBRE_CALENDARIO);
  if (cals.length === 0) {
    throw new Error('No se encontró un calendario llamado "' + NOMBRE_CALENDARIO + '"');
  }
  return cals[0];
}

/**
 * Calcula los huecos libres de los próximos DIAS_A_MOSTRAR días,
 * de lunes a viernes, entre HORA_INICIO y HORA_FIN, en bloques de
 * DURACION_MIN minutos, respetando la antelación mínima y descartando
 * los que choquen con eventos ya existentes en el calendario real.
 */
function getHuecosDisponibles_() {
  var calendario = getCalendario_();
  var ahora = new Date();
  var minimoInicio = new Date(ahora.getTime() + HORAS_ANTELACION * 60 * 60 * 1000);

  var rangoInicio = new Date();
  rangoInicio.setHours(0, 0, 0, 0);
  var rangoFin = new Date(rangoInicio.getTime());
  rangoFin.setDate(rangoFin.getDate() + DIAS_A_MOSTRAR + 1);

  var eventos = calendario.getEvents(rangoInicio, rangoFin);

  var huecos = [];
  for (var d = 0; d <= DIAS_A_MOSTRAR; d++) {
    var dia = new Date(rangoInicio.getTime());
    dia.setDate(dia.getDate() + d);
    if (DIAS_LABORABLES.indexOf(dia.getDay()) === -1) continue;

    var totalMinutos = (HORA_FIN - HORA_INICIO) * 60;
    for (var m = 0; m < totalMinutos; m += DURACION_MIN) {
      var inicio = new Date(dia.getFullYear(), dia.getMonth(), dia.getDate(), HORA_INICIO, 0, 0);
      inicio.setMinutes(inicio.getMinutes() + m);
      var fin = new Date(inicio.getTime() + DURACION_MIN * 60 * 1000);

      if (inicio < minimoInicio) continue;

      var libre = true;
      for (var i = 0; i < eventos.length; i++) {
        var ev = eventos[i];
        if (inicio < ev.getEndTime() && fin > ev.getStartTime()) { libre = false; break; }
      }
      if (!libre) continue;

      huecos.push({
        start: inicio.toISOString(),
        label: formatearFecha_(inicio)
      });
    }
  }
  return huecos;
}

function crearEventoConMeet_(datos) {
  var calendario = getCalendario_();
  var inicio = new Date(datos.slot);
  var fin = new Date(inicio.getTime() + DURACION_MIN * 60 * 1000);

  var evento = {
    summary: 'Demo Kangen — ' + (datos.name || 'sin nombre'),
    description:
      'Presentación de 15 min sobre agua Kangen.\n\n' +
      'Objetivo: ' + (datos.goal || '-') + '\n' +
      'WhatsApp: ' + (datos.whatsapp || '-'),
    start: { dateTime: inicio.toISOString(), timeZone: ZONA_HORARIA },
    end: { dateTime: fin.toISOString(), timeZone: ZONA_HORARIA },
    attendees: datos.email ? [{ email: datos.email }] : [],
    conferenceData: {
      createRequest: {
        requestId: Utilities.getUuid(),
        conferenceSolutionKey: { type: 'hangoutsMeet' }
      }
    }
  };

  return Calendar.Events.insert(evento, calendario.getId(), {
    conferenceDataVersion: 1,
    sendUpdates: 'all'
  });
}

// ===== Hoja de cálculo =====

function obtenerHoja_() {
  var libro = SHEET_ID
    ? SpreadsheetApp.openById(SHEET_ID)
    : SpreadsheetApp.getActiveSpreadsheet();
  if (!libro) {
    throw new Error('No encuentro la hoja. Rellena SHEET_ID arriba con el ID de tu hoja de Google.');
  }
  var hoja = libro.getSheetByName(NOMBRE_HOJA);
  if (!hoja) {
    hoja = libro.insertSheet(NOMBRE_HOJA);
    hoja.appendRow(['Recibida', 'Nombre', 'WhatsApp', 'Email', 'Objetivo', 'Cita', 'Meet']);
  }
  return hoja;
}

// ===== Emails / utilidades =====

function formatearFecha_(fecha) {
  return Utilities.formatDate(fecha, ZONA_HORARIA, "EEEE d 'de' MMMM 'a las' HH:mm");
}

function enviarAvisoRaquel_(datos, fecha, evento, errorEvento) {
  var asunto = '💧 Nueva reserva de demo — ' + (datos.name || 'sin nombre');
  var estadoCita = evento
    ? 'La cita ya está creada en tu calendario "' + NOMBRE_CALENDARIO + '" y el visitante ' +
      'ha recibido la invitación de Google Calendar con el enlace de Meet.'
    : '⚠️ NO se pudo crear el evento en el calendario automáticamente' +
      (errorEvento ? ' (' + errorEvento + ')' : '') +
      '. Añade la cita a mano y escribe al contacto.';
  var cuerpo =
    'Has recibido una nueva solicitud de demostración desde la web:\n\n' +
    'Nombre:   ' + (datos.name || '-') + '\n' +
    'WhatsApp: ' + (datos.whatsapp || '-') + '\n' +
    'Email:    ' + (datos.email || '-') + '\n' +
    'Objetivo: ' + (datos.goal || '-') + '\n' +
    'Cita:     ' + (datos.slot ? formatearFecha_(new Date(datos.slot)) : '-') + '\n' +
    (evento ? 'Meet:     ' + evento.hangoutLink + '\n' : '') +
    'Recibida: ' + fecha.toLocaleString('es-ES') + '\n\n' +
    estadoCita + '\n' +
    'Los datos también quedan guardados en tu hoja de Google.';
  MailApp.sendEmail(EMAIL_AVISO, asunto, cuerpo);
}

/**
 * Función opcional para probar sin usar la web:
 * pulsa "Ejecutar" sobre esta función y comprueba que
 * se añade una fila de prueba y te llega el email.
 * (No crea evento de calendario, para no ensuciar tu agenda de pruebas.)
 */
function prueba_() {
  var datos = {
    name: 'Prueba Laura',
    whatsapp: '+34 600 000 000',
    email: 'laura@example.com',
    goal: 'Más energía'
  };
  var hoja = obtenerHoja_();
  hoja.appendRow([new Date(), datos.name, datos.whatsapp, datos.email, datos.goal, '', '']);
  enviarAvisoRaquel_(datos, new Date(), null, '');
}

/**
 * Prueba rápida de la lectura del calendario: pulsa "Ejecutar" y mira el
 * registro (Ver → Registro) para comprobar que encuentra huecos libres.
 */
function pruebaHuecos_() {
  Logger.log(JSON.stringify(getHuecosDisponibles_(), null, 2));
}
