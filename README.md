# Registro de Equipos — Torneo de Fútbol · Freedom en Español

## Qué incluye
- **Formulario público** (`/`): registro de equipo en 4 pasos — capitán, datos del equipo, jugadores (mínimo 7), confirmación.
- **Panel admin** (`/admin`): lista de equipos y jugadores, buscador, detalle por equipo, exportar CSV. Protegido con PIN (`1234` por defecto, en `src/supabaseClient.js`).

## Pasos para ponerlo en línea

### 1. Crear la tabla en Supabase
Entra a tu proyecto de Supabase (`yjhessebmbiorkkbdeag`, el mismo de Panel LOF) → **SQL Editor** → pega y corre el contenido de `supabase_setup.sql`.

### 2. Poner tu API key
Abre `src/supabaseClient.js` y reemplaza:
```
const SUPABASE_ANON_KEY = 'PEGA_AQUI_TU_ANON_KEY'
```
La sacas de Supabase → **Project Settings → API → Project API keys → anon public**.

### 3. Subir a GitHub
Crea un repo nuevo (ej. `registro-futbol-freedom`) y sube todos estos archivos manteniendo la estructura de carpetas (`src/` es la única subcarpeta, todo lo demás va suelto en la raíz).

### 4. Desplegar en Vercel
Importa el repo en Vercel. Framework: **Vite**. No necesitas variables de entorno extra (la key ya va en el código). Deploy.

### 5. Cambiar el PIN del admin (opcional)
En `src/supabaseClient.js`, cambia `ADMIN_PIN`.

## Ajustar el mínimo de jugadores
En `src/supabaseClient.js`, cambia `MIN_JUGADORES` (actualmente 7).

## Estructura de archivos
```
index.html
package.json
vite.config.js
vercel.json
supabase_setup.sql
src/
  main.jsx
  App.jsx
  RegistrationForm.jsx
  AdminPanel.jsx
  supabaseClient.js
  styles.css
```
