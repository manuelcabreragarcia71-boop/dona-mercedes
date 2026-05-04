# 🍎 DOÑA MERCEDES - App de Frutas y Verduras

Aplicación móvil profesional para venta de frutas y verduras online con sistema de pedidos optimizado, panel de administración avanzado con IA y lista para distribución como APK en Android.

## 🚀 Características Principales

### Para Clientes
- ✅ Catálogo dinámico de productos con imágenes
- ✅ Carrito de compras intuitivo
- ✅ Control de horarios automático (10:00-14:00 y 17:00-21:00)
- ✅ Opciones de entrega: recogida en tienda o domicilio
- ✅ Interfaz moderna inspirada en Glovo/Uber Eats
- ✅ Búsqueda de productos en tiempo real

### Para Administradores
- ✅ Panel de administración completo
- ✅ Gestión de productos (crear, editar, eliminar)
- ✅ Gestión de pedidos en tiempo real
- ✅ **IA para actualización de precios con lenguaje natural**
- ✅ Notificaciones de nuevos pedidos
- ✅ Cambio de credenciales de acceso
- ✅ Sistema de estados de pedidos

## 📱 Tecnologías Utilizadas

- **Frontend**: React Native + Expo
- **Backend**: Supabase (Postgres, Realtime, Storage)
- **Navegación**: React Navigation
- **Estado**: Context API
- **IA**: Sistema de procesamiento de lenguaje natural personalizado
- **Notificaciones**: Expo Notifications

## 🛠️ Instalación y Configuración

### Requisitos Previos
- Node.js (v14 o superior)
- npm o yarn
- Cuenta de Supabase
- Expo CLI (opcional)

### Paso 1: Instalar Dependencias
```bash
cd dona-mercedes
npm install
```

### Paso 2: Configurar Supabase

1. Crea un proyecto en [Supabase Console](https://supabase.com/)
2. Habilita Supabase Postgres
3. Habilita Storage
4. Copia las credenciales de tu proyecto
5. Edita el archivo `supabase.config.js`:

```javascript
const supabaseUrl = 'TU_SUPABASE_URL';
const supabaseAnonKey = 'TU_SUPABASE_ANON_KEY';
```

### Paso 3: Ejecutar en Desarrollo

```bash
# Iniciar el servidor de desarrollo
npm start

# Para Android
npm run android

# Para iOS (solo en macOS)
npm run ios

# Para Web
npm run web
```

## 📦 Generar APK para Android

### Opción 1: Build Local (Requiere Android Studio)

```bash
# Instalar EAS CLI
npm install -g eas-cli

# Configurar EAS
eas build:configure

# Generar APK
eas build --platform android --profile preview
```

### Opción 2: Build con Expo (Más Simple)

```bash
# Generar APK
expo build:android -t apk
```

El APK se descargará automáticamente cuando esté listo.

## 🔐 Credenciales de Administrador

**Por defecto:**
- Usuario: `admin`
- Contraseña: `(ver panel de admin)`

⚠️ **IMPORTANTE**: Cambia estas credenciales desde el panel de administración después del primer inicio de sesión.

## 🤖 Sistema de IA para Precios

El panel de administración incluye un asistente de IA que permite actualizar precios usando lenguaje natural.

### Ejemplos de Comandos:

```
"El tomate está hoy a 2€"
"Sube las manzanas a 1,90€"
"Baja el plátano a 1,50€"
"Pon las naranjas a 2,50€"
```

La IA detecta automáticamente:
- El producto mencionado
- El precio indicado
- La acción a realizar (establecer, subir, bajar)

## ⏰ Control de Horarios

La aplicación bloquea automáticamente los pedidos fuera del horario comercial:

**Horarios configurados:**
- Mañana: 10:00 - 14:00
- Tarde: 17:00 - 21:00

Para modificar los horarios, edita `src/utils/constants.js`:

```javascript
export const BUSINESS_HOURS = [
  { start: 10, end: 14 },
  { start: 17, end: 21 }
];
```

## 📊 Estructura del Proyecto

```
dona-mercedes/
├── src/
│   ├── components/          # Componentes reutilizables
│   │   ├── ProductCard.js
│   │   └── CartItem.js
│   ├── screens/            # Pantallas de la app
│   │   ├── HomeScreen.js
│   │   ├── CartScreen.js
│   │   ├── AdminLoginScreen.js
│   │   └── AdminPanelScreen.js
│   ├── navigation/         # Configuración de navegación
│   │   └── AppNavigator.js
│   ├── context/           # Estado global
│   │   └── AppContext.js
│   ├── services/          # Servicios de Supabase
│   │   └── supabaseService.js
│   └── utils/             # Utilidades
│       ├── constants.js
│       ├── businessHours.js
│       └── aiPriceParser.js
├── supabase.config.js     # Configuración de Supabase
├── App.js                # Punto de entrada
└── app.json              # Configuración de Expo
```

## 🎨 Personalización

### Cambiar Colores
Los colores se pueden modificar desde el panel de administración o editando `src/utils/constants.js`:

```javascript
export const COLORS = {
  primary: '#4CAF50',      // Verde principal
  secondary: '#8BC34A',    // Verde secundario
  accent: '#FF9800',       // Naranja acento
  // ... más colores
};
```

### Añadir Productos Iniciales
Usa el panel de administración para añadir productos con:
- Nombre
- Precio
- Descripción
- Imagen
- Estado (disponible/agotado)

## 📱 Instalación del APK

1. Descarga el archivo APK generado
2. Transfiere el APK a tu dispositivo Android
3. Habilita "Instalar aplicaciones de fuentes desconocidas" en Configuración
4. Abre el archivo APK y sigue las instrucciones

## 🔔 Notificaciones

Las notificaciones se activan automáticamente cuando:
- Se recibe un nuevo pedido (solo para administradores)
- Un pedido cambia de estado

## 🐛 Solución de Problemas

### Error de Supabase
- Verifica que las credenciales en `supabase.config.js` sean correctas
- Asegúrate de haber habilitado Supabase Postgres y Storage en Supabase Console

### Error al generar APK
- Verifica que tengas instalado EAS CLI: `npm install -g eas-cli`
- Asegúrate de tener una cuenta de Expo

### La app no carga productos
- Verifica la conexión a Internet
- Comprueba que Supabase esté configurado correctamente
- Revisa la consola de Supabase para ver si hay errores

## 📄 Licencia

Este proyecto es privado y está desarrollado para uso exclusivo de DOÑA MERCEDES.

## 👨‍💻 Soporte

Para soporte técnico o consultas, contacta con el equipo de desarrollo.

---

**Versión**: 1.0.0  
**Última actualización**: 2026  
**Desarrollado con** ❤️ **para DOÑA MERCEDES**
