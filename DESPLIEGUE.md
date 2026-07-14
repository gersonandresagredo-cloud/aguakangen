# Cómo poner la web online (Vercel) y conectar el dominio de Arsys

Guía sencilla. La web está hecha con Vite + React; Vercel la detecta sola.

---

## Parte A — Subir la web a Vercel

### 1. Poner el código en GitHub (una vez)
Vercel lee el código desde GitHub.
- Crea una cuenta gratis en https://github.com (usa `rachel.essens.barcelona@gmail.com`).
- Crea un repositorio nuevo (por ejemplo `kangen-web`), vacío y **privado**.
- Sube ahí el contenido de la carpeta `site/`. (Claude puede prepararte esto si le
  das el repositorio: hace el "commit" y el "push".)

### 2. Importar en Vercel
- Entra en https://vercel.com y regístrate **con GitHub** (botón "Continue with GitHub").
- Pulsa **Add New… → Project** y elige el repositorio `kangen-web`.
- Configura:
  - **Framework Preset:** Vite (lo detecta solo)
  - **Root Directory:** `site`  ← importante si subes todo el repo, no solo la carpeta
  - **Environment Variables:** añade una llamada
    `VITE_BOOKING_ENDPOINT` con la URL de tu Google Apps Script (la del `/exec`).
- Pulsa **Deploy**. En ~1 minuto tendrás un link tipo `kangen-web.vercel.app`. ✅
  Ese ya es un link que se abre en cualquier móvil.

---

## Parte B — Conectar tu dominio de Arsys

### 3. Añadir el dominio en Vercel
- En tu proyecto de Vercel: **Settings → Domains → Add**.
- Escribe tu dominio (por ejemplo `tudominio.com`).
- Vercel te mostrará los valores DNS que tienes que poner en Arsys. **Usa siempre los
  que te muestre Vercel** (pueden cambiar). Normalmente son:
  - Registro **A** para el dominio a secas (`@`) → `76.76.21.21`
  - Registro **CNAME** para `www` → `cname.vercel-dns.com`

### 4. Ponerlos en Arsys
- Entra en tu panel de Arsys → zona de **DNS** de tu dominio.
- Añade/edita el registro **A** y el **CNAME** con los valores de Vercel.
- Guarda. Puede tardar de unos minutos a unas horas en activarse.
- Cuando en Vercel el dominio aparezca en verde, ¡listo! Tu web ya se ve en tu dominio.

> No hace falta mover el dominio de Arsys ni pagar nada extra. Solo se "apunta" hacia Vercel.

---

## Recordatorio
- Guardar reservas + email: ver `google-apps-script/INSTRUCCIONES.md`.
- Cada vez que se cambie el código, Vercel vuelve a publicar solo al subir a GitHub.
