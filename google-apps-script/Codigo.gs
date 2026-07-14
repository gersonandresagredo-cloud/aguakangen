/**
 * Kangen — Backend de reservas (Google Apps Script)
 * -------------------------------------------------
 * Guarda cada reserva del chat en una hoja de cálculo de Google (en tu Drive)
 * y envía un aviso por email cada vez que llega una nueva.
 *
 * No necesita Google Cloud, ni servidor, ni tarjeta. Solo tu cuenta de Google.
 * Pasos de instalación en el archivo INSTRUCCIONES.md de esta misma carpeta.
 */

// ===== CONFIGURA ESTO =====
// A qué correo quieres que llegue el aviso de cada reserva:
var EMAIL_AVISO = 'rachel.essens.barcelona@gmail.com';
// Nombre de la pestaña dentro de la hoja (se crea sola si no existe):
var NOMBRE_HOJA = 'Reservas';
// ==========================

function doPost(e) {
  try {
    var datos = JSON.parse(e.postData.contents);
    var hoja = obtenerHoja_();
    var fecha = new Date();

    hoja.appendRow([
      fecha,
      datos.name || '',
      datos.contact || '',
      datos.goal || '',
      datos.day || '',
      datos.franja || ''
    ]);

    enviarAviso_(datos, fecha);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function obtenerHoja_() {
  var libro = SpreadsheetApp.getActiveSpreadsheet();
  var hoja = libro.getSheetByName(NOMBRE_HOJA);
  if (!hoja) {
    hoja = libro.insertSheet(NOMBRE_HOJA);
    hoja.appendRow(['Recibida', 'Nombre', 'Contacto', 'Objetivo', 'Día', 'Franja']);
  }
  return hoja;
}

function enviarAviso_(datos, fecha) {
  var asunto = '💧 Nueva reserva de demo — ' + (datos.name || 'sin nombre');
  var cuerpo =
    'Has recibido una nueva solicitud de demostración desde la web:\n\n' +
    'Nombre:   ' + (datos.name || '-') + '\n' +
    'Contacto: ' + (datos.contact || '-') + '\n' +
    'Objetivo: ' + (datos.goal || '-') + '\n' +
    'Cuándo:   ' + (datos.day || '-') + ' · ' + (datos.franja || '-') + '\n' +
    'Recibida: ' + fecha.toLocaleString('es-ES') + '\n\n' +
    'Los datos también quedan guardados en tu hoja de Google.';
  MailApp.sendEmail(EMAIL_AVISO, asunto, cuerpo);
}

/**
 * Función opcional para probar sin usar la web:
 * pulsa "Ejecutar" sobre esta función y comprueba que
 * se añade una fila de prueba y te llega el email.
 */
function prueba_() {
  var datos = {
    name: 'Prueba Laura',
    contact: 'laura@example.com',
    goal: 'Más energía',
    day: 'Entre semana',
    franja: 'Tarde'
  };
  var hoja = obtenerHoja_();
  hoja.appendRow([new Date(), datos.name, datos.contact, datos.goal, datos.day, datos.franja]);
  enviarAviso_(datos, new Date());
}
