# Guardar las reservas en Google + aviso por email

Esto hace que, cada vez que alguien reserve una demo en el chat de la web:

1. **se apunte una fila** en una hoja de cálculo de Google (en tu Drive), y
2. **te llegue un email** avisándote.

No hace falta Google Cloud, ni servidor, ni tarjeta. Solo tu cuenta de Google
(`rachel.essens.barcelona@gmail.com`).

---

## Pasos (una sola vez, ~10 minutos)

### 1. Crea la hoja
- Entra en https://sheets.google.com con la cuenta `rachel.essens.barcelona@gmail.com`.
- Crea una hoja nueva y ponle nombre, p. ej. **"Reservas Kangen"**.

### 2. Abre el editor de scripts
- En esa hoja, menú **Extensiones → Apps Script**.
- Borra lo que haya y **pega todo el contenido del archivo `Codigo.gs`** de esta carpeta.
- Si quieres, cambia arriba el `EMAIL_AVISO` por el correo donde prefieras recibir el aviso.
- Guarda (icono del disquete).

### 3. Publica el script como "aplicación web"
- Arriba a la derecha: **Implementar → Nueva implementación**.
- En el engranaje ⚙ elige **"Aplicación web"**.
- Configura así:
  - **Ejecutar como:** Yo (tu cuenta)
  - **Quién tiene acceso:** **Cualquier usuario**
- Pulsa **Implementar**. Google te pedirá permisos → acéptalos (es normal, es tu propio script).
- Copia la **URL** que te da, la que **termina en `/exec`**.

### 4. Conecta la web con el script
- En la carpeta `site/`, copia el archivo `.env.example` y renómbralo a `.env`.
- Pega la URL dentro, así:
  ```
  VITE_BOOKING_ENDPOINT=https://script.google.com/macros/s/XXXXXXXX/exec
  ```
- Vuelve a publicar la web (el hosting hará una nueva "build" con ese dato).

### 5. Prueba
- Entra en la web, abre el chat y reserva una demo de prueba.
- Deberías ver una fila nueva en la hoja y recibir el email. ✅

> Consejo: dentro de Apps Script también puedes pulsar **Ejecutar** sobre la
> función `prueba_` para comprobar la hoja y el email sin usar la web.

---

## ¿Y si más adelante quiero que además cree el evento en Google Calendar?
Se puede añadir en el mismo script con unas pocas líneas. Dímelo y te lo preparo.
