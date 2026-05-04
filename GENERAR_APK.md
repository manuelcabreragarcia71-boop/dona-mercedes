# 📦 Guía para Generar APK de Android

Esta guía te mostrará cómo generar un archivo APK instalable para Android de la aplicación DOÑA MERCEDES.

## 🎯 Métodos Disponibles

Hay tres métodos principales para generar el APK:

1. **EAS Build** (Recomendado) - Más fácil y rápido
2. **Expo Build** (Clásico) - Requiere cuenta Expo
3. **Build Local** - Requiere Android Studio

---

## 🚀 Método 1: EAS Build (RECOMENDADO)

Este es el método más moderno y recomendado por Expo.

### Paso 1: Instalar EAS CLI

```bash
npm install -g eas-cli
```

### Paso 2: Iniciar Sesión en Expo

```bash
eas login
```

Si no tienes cuenta, créala en [expo.dev](https://expo.dev)

### Paso 3: Configurar EAS

```bash
cd dona-mercedes
eas build:configure
```

Esto creará un archivo `eas.json` con la configuración.

### Paso 4: Generar APK

```bash
eas build --platform android --profile preview
```

**Opciones:**
- `--profile preview`: Genera un APK (no AAB)
- `--profile production`: Genera un AAB para Google Play Store

### Paso 5: Descargar el APK

Una vez completado el build (tarda 10-20 minutos):

1. Se mostrará un enlace de descarga en la terminal
2. También puedes ver el build en [expo.dev/accounts/[tu-usuario]/projects/dona-mercedes/builds](https://expo.dev)
3. Descarga el archivo `.apk`

### Paso 6: Instalar en Android

1. Transfiere el APK a tu dispositivo Android
2. Abre el archivo APK
3. Permite la instalación de fuentes desconocidas si es necesario
4. ¡Listo!

---

## 📱 Método 2: Expo Build (Clásico)

### Paso 1: Instalar Expo CLI

```bash
npm install -g expo-cli
```

### Paso 2: Iniciar Sesión

```bash
expo login
```

### Paso 3: Generar APK

```bash
cd dona-mercedes
expo build:android -t apk
```

**Nota:** Este método está siendo deprecado en favor de EAS Build.

### Paso 4: Esperar y Descargar

1. El proceso tarda 15-30 minutos
2. Recibirás un enlace de descarga cuando esté listo
3. Descarga el APK

---

## 🛠️ Método 3: Build Local (Avanzado)

Requiere Android Studio y configuración más compleja.

### Requisitos Previos

1. Instalar [Android Studio](https://developer.android.com/studio)
2. Configurar Android SDK
3. Configurar variables de entorno

### Paso 1: Eject de Expo

```bash
cd dona-mercedes
npx expo prebuild
```

Esto generará las carpetas `android/` e `ios/`.

### Paso 2: Abrir en Android Studio

1. Abre Android Studio
2. File → Open → Selecciona la carpeta `android/`
3. Espera a que Gradle sincronice

### Paso 3: Generar APK

**Opción A: Desde Android Studio**
1. Build → Build Bundle(s) / APK(s) → Build APK(s)
2. Espera a que termine
3. El APK estará en `android/app/build/outputs/apk/release/`

**Opción B: Desde Terminal**

```bash
cd android
./gradlew assembleRelease
```

El APK estará en `android/app/build/outputs/apk/release/app-release.apk`

---

## 🔐 Firmar el APK (Para Producción)

Para publicar en Google Play Store, necesitas firmar el APK.

### Paso 1: Generar Keystore

```bash
keytool -genkeypair -v -storetype PKCS12 -keystore dona-mercedes.keystore -alias dona-mercedes -keyalg RSA -keysize 2048 -validity 10000
```

Guarda la contraseña en un lugar seguro.

### Paso 2: Configurar Gradle

Edita `android/app/build.gradle`:

```gradle
android {
    ...
    signingConfigs {
        release {
            storeFile file('dona-mercedes.keystore')
            storePassword 'TU_PASSWORD'
            keyAlias 'dona-mercedes'
            keyPassword 'TU_PASSWORD'
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            ...
        }
    }
}
```

### Paso 3: Build Firmado

```bash
cd android
./gradlew assembleRelease
```

---

## 📋 Configuración Adicional

### Optimizar Tamaño del APK

Edita `app.json`:

```json
{
  "expo": {
    "android": {
      "enableProguardInReleaseBuilds": true,
      "enableShrinkResourcesInReleaseBuilds": true
    }
  }
}
```

### Configurar Versión

Edita `app.json`:

```json
{
  "expo": {
    "version": "1.0.0",
    "android": {
      "versionCode": 1
    }
  }
}
```

Incrementa `versionCode` con cada nueva versión.

---

## 🐛 Solución de Problemas

### Error: "SDK location not found"

**Solución:**
Crea el archivo `android/local.properties`:

```properties
sdk.dir=C:\\Users\\TU_USUARIO\\AppData\\Local\\Android\\Sdk
```

### Error: "Gradle build failed"

**Solución:**
```bash
cd android
./gradlew clean
./gradlew assembleRelease
```

### Error: "Unable to load script"

**Solución:**
Asegúrate de que el bundle esté incluido:

```bash
npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle
```

### APK muy grande (>50MB)

**Solución:**
1. Habilita ProGuard (ver arriba)
2. Usa App Bundles (AAB) en lugar de APK
3. Elimina assets no utilizados

---

## 📊 Comparación de Métodos

| Método | Dificultad | Tiempo | Tamaño APK | Recomendado |
|--------|-----------|--------|------------|-------------|
| EAS Build | Fácil | 10-20 min | ~30-40 MB | ✅ Sí |
| Expo Build | Fácil | 15-30 min | ~30-40 MB | ⚠️ Deprecado |
| Build Local | Difícil | 5-10 min | ~25-35 MB | Solo avanzados |

---

## 🎯 Recomendación Final

**Para la mayoría de usuarios: Usa EAS Build**

```bash
# Instalación única
npm install -g eas-cli
eas login

# Cada vez que quieras generar APK
cd dona-mercedes
eas build --platform android --profile preview
```

Es el método más simple, rápido y mantenido por Expo.

---

## 📱 Distribución del APK

### Opción 1: Instalación Manual

1. Comparte el archivo APK por WhatsApp, email, etc.
2. El usuario descarga el APK
3. Habilita "Fuentes desconocidas" en Configuración
4. Instala el APK

### Opción 2: Google Play Store

1. Genera un AAB (App Bundle):
   ```bash
   eas build --platform android --profile production
   ```
2. Crea una cuenta de desarrollador en [Google Play Console](https://play.google.com/console)
3. Sube el AAB
4. Completa la información de la app
5. Publica

### Opción 3: Distribución Interna

Usa Supabase App Distribution:

```bash
npm install -g firebase-tools
firebase login
firebase appdistribution:distribute app-release.apk --app TU_APP_ID
```

---

## ✅ Checklist Pre-Build

Antes de generar el APK, verifica:

- [ ] Supabase está configurado correctamente
- [ ] Las credenciales de Supabase están en `supabase.config.js`
- [ ] La versión en `app.json` es correcta
- [ ] Los permisos en `app.json` son los necesarios
- [ ] Has probado la app en desarrollo
- [ ] No hay errores en la consola

---

## 🎉 ¡Listo!

Ahora tienes un APK instalable de DOÑA MERCEDES listo para distribuir.

**Próximos pasos:**
1. Instala el APK en varios dispositivos de prueba
2. Verifica que todas las funciones trabajen correctamente
3. Distribuye a tus usuarios

---

**¿Necesitas ayuda?** Consulta la [documentación oficial de Expo](https://docs.expo.dev/build/setup/)
