# Reservas conectadas a tu Google Calendar real

Esto hace que, cada vez que alguien reserve una demo en el chat de la web:

1. **el chat solo ofrezca huecos que están libres de verdad** en tu calendario
   **"Agenda de aguakangen"**,
2. **se cree la cita en ese calendario**, con un enlace de **Google Meet** generado automáticamente,
3. **el visitante reciba un email de Google Calendar** con la invitación y el enlace de Meet (lo manda Google, no hace falta configurarlo aparte),
4. **te llegue a ti un aviso por email** con todos los datos (nombre, WhatsApp, email, objetivo, hora y el enlace de Meet), y
5. **se apunte una fila** en una hoja de cálculo de Google (en tu Drive), como respaldo.

No hace falta Google Cloud, ni servidor, ni tarjeta. Solo tu cuenta de Google
(`rachel.essens.barcelona@gmail.com`), que ya tiene creado el calendario
**"Agenda de aguakangen"**.

Horario configurado: **lunes a viernes, de 16:00 a 20:00, citas de 15 minutos,
con un mínimo de 48h de antelación**. Si quieres cambiar esto más adelante, son
solo unas constantes al principio del archivo `Codigo.gs` (`HORA_INICIO`,
`HORA_FIN`, `DURACION_MIN`, `DIAS_LABORABLES`, `HORAS_ANTELACION`).

---

## Pasos (una sola vez, ~15 minutos)

### 1. Crea la hoja
- Entra en https://sheets.google.com con la cuenta `rachel.essens.barcelona@gmail.com`.
- Crea una hoja nueva y ponle nombre, p. ej. **"Reservas Kangen"**.

### 2. Comprueba el nombre del calendario
- Entra en https://calendar.google.com con la misma cuenta.
- En la lista de "Mis calendarios" (a la izquierda) confirma que existe uno
  llamado **exactamente** `Agenda de aguakangen` (mayúsculas/minúsculas y
  espacios tal cual). Si lo llamaste distinto, cambia la constante
  `NOMBRE_CALENDARIO` en `Codigo.gs` para que coincida.

### 3. Abre el editor de scripts
- En la hoja del paso 1, menú **Extensiones → Apps Script**.
- Borra lo que haya y **pega todo el contenido del archivo `Codigo.gs`** de esta carpeta.
- Guarda (icono del disquete).

### 4. Activa el servicio avanzado de Calendar
- En el editor, a la izquierda, pulsa el icono **+** junto a "Servicios".
- Busca **"Google Calendar API"** y pulsa **Añadir**. Esto es necesario para
  que el script pueda crear el evento con el enlace de Meet automático.

### 5. Ajusta el huso horario del proyecto
- Menú **⚙ Configuración del proyecto** (o "Project Settings") en el editor.
- Comprueba que el **huso horario** sea `(GMT+01:00) Europe/Madrid`. Si no,
  cámbialo ahí.

### 6. Publica el script como "aplicación web"
- Arriba a la derecha: **Implementar → Nueva implementación**.
- En el engranaje ⚙ elige **"Aplicación web"**.
- Configura así:
  - **Ejecutar como:** Yo (tu cuenta)
  - **Quién tiene acceso:** **Cualquier usuario**
- Pulsa **Implementar**. Google te pedirá permisos → acéptalos. Esta vez
  pedirá también permiso sobre **Calendar** (además de Sheets y Gmail): es
  normal, es tu propio script accediendo a tu propia agenda.
- Copia la **URL** que te da, la que **termina en `/exec`**.

> Si ya tenías una implementación anterior (de la versión sin Calendar), usa
> **Gestionar implementaciones → editar (lápiz) → Nueva versión** en vez de
> crear una implementación nueva, así conservas la misma URL.

### 7. Conecta la web con el script
- En la carpeta `site/`, copia el archivo `.env.example` y renómbralo a `.env`.
- Pega la URL dentro, así:
  ```
  VITE_BOOKING_ENDPOINT=https://script.google.com/macros/s/XXXXXXXX/exec
  ```
- Vuelve a publicar la web (el hosting hará una nueva "build" con ese dato).

### 8. Prueba
- Dentro de Apps Script, pulsa **Ejecutar** sobre la función `pruebaHuecos_` y
  mira el registro (**Ver → Registro**) para comprobar que encuentra huecos
  libres de tu calendario real.
- Entra en la web, abre el chat y reserva una demo de prueba de principio a fin.
  Deberías ver: el evento creado en tu calendario con el Meet, el email de
  invitación al visitante, tu email de aviso, y la fila nueva en la hoja. ✅

> Consejo: la función `prueba_` añade una fila y te manda el aviso sin crear
> evento de calendario (para no ensuciar tu agenda con pruebas).
