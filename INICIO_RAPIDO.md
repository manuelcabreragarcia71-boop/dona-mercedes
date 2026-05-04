# 🚀 Inicio Rápido - DOÑA MERCEDES

Guía express para poner en marcha la aplicación en 5 minutos.

---

## ⚡ Pasos Rápidos

### 1️⃣ Configurar Supabase (5 minutos)

```bash
# 1. Ve a https://supabase.com/
# 2. Crea un nuevo proyecto llamado "dona-mercedes"
# 3. Habilita Supabase Postgres (modo prueba)
# 4. Habilita Storage (modo prueba)
# 5. Copia las credenciales de configuración
```

**Edita `supabase.config.js`:**

```javascript
const firebaseConfig = {
  apiKey: "PEGA_AQUI_TU_API_KEY",
  authDomain: "PEGA_AQUI_TU_AUTH_DOMAIN",
  projectId: "PEGA_AQUI_TU_PROJECT_ID",
  storageBucket: "PEGA_AQUI_TU_STORAGE_BUCKET",
  messagingSenderId: "PEGA_AQUI_TU_MESSAGING_SENDER_ID",
  appId: "PEGA_AQUI_TU_APP_ID"
};
```

### 2️⃣ Instalar y Ejecutar (2 minutos)

```bash
# Navegar al proyecto
cd dona-mercedes

# Instalar dependencias (si no lo hiciste)
npm install

# Iniciar la app
npm start
```

### 3️⃣ Probar en tu Móvil (1 minuto)

**Opción A: Con Expo Go (Más fácil)**

1. Descarga "Expo Go" desde Play Store
2. Escanea el QR que aparece en la terminal
3. ¡La app se abrirá en tu móvil!

**Opción B: En Emulador Android**

```bash
npm run android
```

---

## 📝 Checklist de Verificación

Antes de usar la app, verifica:

- [ ] Supabase configurado en `supabase.config.js`
- [ ] Dependencias instaladas (`npm install`)
- [ ] App corriendo sin errores (`npm start`)
- [ ] Puedes ver la pantalla principal
- [ ] Supabase Supabase Postgres habilitado
- [ ] Supabase Storage habilitado

---

## 🎯 Primeros Pasos en la App

### Como Cliente:

1. ✅ Abre la app
2. ✅ Verás el catálogo (vacío al inicio)
3. ✅ Ve al panel Admin para añadir productos

### Como Admin:

1. ✅ Toca "Admin" en la barra inferior
2. ✅ Usuario: `admin` / Contraseña: `(ver panel de admin)`
3. ✅ Ve a la pestaña "Productos"
4. ✅ Toca "+ Añadir" para crear productos
5. ✅ Añade al menos 5 productos de prueba

---

## 🛒 Crear Productos de Ejemplo Rápido

En el panel Admin → Productos, añade estos productos:

| Nombre | Precio | Descripción |
|--------|--------|-------------|
| Tomate | 2.50 | Tomate fresco de la huerta |
| Manzana | 1.90 | Manzanas Golden dulces |
| Plátano | 1.50 | Plátanos de Canarias |
| Lechuga | 1.20 | Lechuga fresca |
| Naranja | 2.00 | Naranjas para zumo |

**Tip:** Usa el archivo `productos-ejemplo.json` como referencia.

---

## 🤖 Probar la IA de Precios

1. Ve al panel Admin → Pestaña "IA"
2. Escribe: `"El tomate está a 3€"`
3. Toca "Procesar comando"
4. ¡El precio se actualiza automáticamente!

**Más ejemplos:**
```
"Sube las manzanas a 2€"
"Baja el plátano a 1,30€"
"Las naranjas a 2,20€"
```

---

## 📱 Generar APK (Cuando estés listo)

```bash
# Instalar EAS CLI
npm install -g eas-cli

# Login en Expo
eas login

# Generar APK
eas build --platform android --profile preview
```

Espera 10-20 minutos y descarga el APK.

**Guía completa:** Ver `GENERAR_APK.md`

---

## 🐛 Problemas Comunes

### "No se cargan los productos"
✅ Verifica que Supabase esté configurado correctamente
✅ Revisa `supabase.config.js`
✅ Comprueba que Supabase Postgres esté habilitado

### "Error de red"
✅ Verifica tu conexión a Internet
✅ Comprueba que Supabase esté accesible

### "No puedo iniciar sesión como admin"
✅ Credenciales por defecto: `admin` / `(ver panel de admin)`
✅ Si las cambiaste, usa las nuevas

### "La app no se abre en el móvil"
✅ Asegúrate de tener Expo Go instalado
✅ Verifica que móvil y PC estén en la misma red WiFi

---

## 📚 Documentación Completa

- **README.md**: Información general del proyecto
- **CONFIGURACION_SUPABASE.md**: Guía detallada de Supabase
- **GENERAR_APK.md**: Cómo crear el APK instalable
- **MANUAL_USUARIO.md**: Manual completo para usuarios y admins

---

## ✅ ¡Listo para Producción!

Cuando todo funcione correctamente:

1. ✅ Añade productos reales con fotos
2. ✅ Cambia las credenciales de admin
3. ✅ Genera el APK final
4. ✅ Distribuye a tus clientes
5. ✅ ¡Empieza a recibir pedidos!

---

## 🎉 ¡Felicidades!

Ahora tienes una app profesional de frutas y verduras funcionando.

**Próximos pasos recomendados:**
- Personaliza los colores desde el panel admin
- Añade fotos reales a los productos
- Prueba hacer pedidos de prueba
- Configura las reglas de seguridad de Supabase

---

**¿Necesitas ayuda?** Consulta la documentación completa o contacta con soporte.

**DOÑA MERCEDES** - Tu tienda de frutas y verduras online 🍎🥕🍊
