# 📱 Manual de Usuario - DOÑA MERCEDES

Guía completa para usar la aplicación de frutas y verduras DOÑA MERCEDES.

---

## 👥 Para Clientes

### 🏠 Pantalla Principal

Al abrir la app verás:

1. **Nombre de la tienda**: DOÑA MERCEDES
2. **Estado de la tienda**: 
   - 🟢 Verde si está abierta
   - 🔴 Rojo si está cerrada
3. **Buscador**: Para encontrar productos rápidamente
4. **Catálogo de productos**: Con fotos, nombres y precios

### 🛒 Cómo Hacer un Pedido

#### Paso 1: Añadir Productos

1. Navega por el catálogo de productos
2. Toca el botón **"+"** en el producto que quieras
3. El producto se añade automáticamente al carrito
4. Verás un contador en el icono del carrito 🛒

**Tip:** También puedes tocar el producto para ver más detalles.

#### Paso 2: Ver el Carrito

1. Toca el icono **"Carrito"** en la barra inferior
2. Verás todos tus productos seleccionados
3. Puedes:
   - **Aumentar cantidad**: Botón **"+"**
   - **Disminuir cantidad**: Botón **"-"**
   - **Eliminar producto**: Botón **"✕"**

#### Paso 3: Elegir Tipo de Entrega

Selecciona una opción:

- **🏪 Recogida en tienda**: Recoges tu pedido en la tienda
- **🚚 Entrega a domicilio**: Te lo llevamos a casa

#### Paso 4: Completar Datos

**Campos obligatorios:**
- ✅ Nombre completo
- ✅ Teléfono

**Si elegiste entrega a domicilio:**
- ✅ Dirección completa (calle, número, piso, ciudad)

#### Paso 5: Confirmar Pedido

1. Revisa el resumen de tu pedido
2. Verifica el total a pagar
3. Toca **"Realizar pedido"**
4. Confirma en el mensaje que aparece
5. ¡Listo! Recibirás una confirmación

### ⏰ Horarios de Pedido

Solo puedes hacer pedidos en estos horarios:

- **Mañana**: 10:00 - 14:00
- **Tarde**: 17:00 - 21:00

**Fuera de horario:**
- La app te avisará que la tienda está cerrada
- No podrás completar el pedido
- Vuelve en horario comercial

### 🔍 Buscar Productos

1. Toca la barra de búsqueda en la pantalla principal
2. Escribe el nombre del producto (ej: "tomate", "manzana")
3. Los resultados se filtran automáticamente

### 💡 Consejos Útiles

- **Productos agotados**: Aparecen con una etiqueta roja "Agotado"
- **Actualizar catálogo**: Desliza hacia abajo en la pantalla principal
- **Ver total**: El carrito siempre muestra el total actualizado
- **Cancelar pedido**: Simplemente cierra la app antes de confirmar

---

## 👨‍💼 Para Administradores

### 🔐 Acceso al Panel

1. Toca el icono **"Admin"** en la barra inferior
2. Introduce las credenciales:
   - **Usuario**: `admin`
   - **Contraseña**: `(ver panel de admin)`
3. Toca **"Iniciar sesión"**

⚠️ **IMPORTANTE**: Cambia estas credenciales después del primer acceso.

### 📊 Panel de Administración

El panel tiene 3 secciones principales:

#### 1️⃣ Pedidos

**Ver pedidos:**
- Lista de todos los pedidos recibidos
- Ordenados del más reciente al más antiguo
- Información completa de cada pedido:
  - Nombre del cliente
  - Teléfono
  - Dirección (si es entrega a domicilio)
  - Productos y cantidades
  - Total a pagar
  - Estado actual

**Cambiar estado de pedido:**

Toca uno de los botones de estado:

- **Pendiente** (Amarillo): Pedido recién recibido
- **Preparando** (Verde): Estás preparando el pedido
- **Entregado** (Verde oscuro): Pedido completado

**Notificaciones:**
- Recibirás una alerta cada vez que llegue un nuevo pedido
- Incluye nombre del cliente y total

#### 2️⃣ Productos

**Ver productos:**
- Lista completa de productos
- Nombre, precio y disponibilidad
- Ordenados alfabéticamente

**Añadir producto:**

1. Toca **"+ Añadir"**
2. Completa los campos:
   - **Nombre** (obligatorio)
   - **Precio** (obligatorio, en euros)
   - **Descripción** (opcional)
   - **Disponible**: Activa/desactiva
   - **Imagen**: Toca para seleccionar de tu galería
3. Toca **"Guardar"**

**Editar producto:**

1. Toca el botón **"✎"** en el producto
2. Modifica los campos que necesites
3. Toca **"Guardar"**

**Eliminar producto:**

1. Toca el botón **"✕"** en el producto
2. Confirma la eliminación
3. El producto desaparece del catálogo

**Marcar como agotado:**

1. Edita el producto
2. Desactiva el switch **"Disponible"**
3. Guarda
4. El producto aparecerá como "Agotado" en la app

#### 3️⃣ IA - Asistente de Precios

**¿Qué es?**

Un asistente inteligente que actualiza precios usando lenguaje natural.

**Cómo usarlo:**

1. Escribe un comando en el campo de texto
2. Toca **"🤖 Procesar comando"**
3. El sistema detecta el producto y precio
4. Actualiza automáticamente en la base de datos

**Ejemplos de comandos:**

```
"El tomate está hoy a 2€"
"Sube las manzanas a 1,90€"
"Baja el plátano a 1,50€"
"Pon las naranjas a 2,50€"
"El pepino a 1,60€"
```

**Productos reconocidos:**

El sistema reconoce automáticamente:
- Tomate, manzana, plátano, naranja, lechuga
- Zanahoria, patata, cebolla, pimiento, pepino
- Calabacín, berenjena, pera, uva, melón
- Sandía, fresa, limón, aguacate, brócoli
- Coliflor, espinaca, kiwi, mango, piña
- Y muchos más...

**Respuestas del sistema:**

- ✅ **Éxito**: "Precio establecido correctamente: tomate a 2.00€"
- ❌ **Error**: "No se detectó ningún producto válido"
- ❌ **Error**: "No se encontró el producto en la base de datos"

### ⚙️ Configuración

**Cambiar credenciales:**

1. En el panel, toca el icono **"⚙️"** (arriba a la derecha)
2. Introduce:
   - Nuevo usuario
   - Nueva contraseña (mínimo 8 caracteres)
3. Toca **"Actualizar"**
4. Las credenciales se guardan automáticamente

⚠️ **IMPORTANTE**: Guarda las nuevas credenciales en un lugar seguro.

**Cerrar sesión:**

1. Toca el icono **"🚪"** (arriba a la derecha)
2. Confirma que quieres salir
3. Volverás a la pantalla de inicio

### 📱 Gestión Diaria Recomendada

**Por la mañana:**
1. Revisa pedidos pendientes
2. Actualiza precios según el mercado (usa la IA)
3. Marca productos agotados si es necesario

**Durante el día:**
1. Cambia estados de pedidos según avances
2. Responde a clientes si es necesario
3. Añade nuevos productos si llegan

**Por la noche:**
1. Marca pedidos como entregados
2. Revisa stock para el día siguiente
3. Actualiza disponibilidad de productos

### 💡 Consejos para Administradores

**Gestión de productos:**
- Usa fotos de buena calidad (mejora las ventas)
- Escribe descripciones atractivas
- Actualiza precios regularmente
- Marca productos agotados inmediatamente

**Gestión de pedidos:**
- Cambia el estado rápidamente (los clientes lo aprecian)
- Contacta al cliente si hay algún problema
- Mantén un registro de pedidos frecuentes

**Uso de la IA:**
- Es más rápido que editar manualmente
- Ideal para cambios de precio diarios
- Funciona mejor con comandos simples y claros

**Seguridad:**
- Cambia las credenciales por defecto
- No compartas el acceso admin
- Cierra sesión si dejas el dispositivo desatendido

---

## ❓ Preguntas Frecuentes

### Para Clientes

**¿Puedo modificar mi pedido después de enviarlo?**
No, una vez confirmado no se puede modificar. Contacta con la tienda directamente.

**¿Cuánto tarda la entrega?**
Depende de la opción elegida. La tienda te contactará para coordinar.

**¿Puedo pagar con tarjeta?**
El pago se coordina directamente con la tienda al recibir el pedido.

**¿Qué pasa si un producto está agotado?**
No podrás añadirlo al carrito. Vuelve a revisar más tarde.

### Para Administradores

**¿Cómo añado imágenes a los productos?**
Desde el panel de productos, al crear o editar, toca "Seleccionar imagen".

**¿Puedo eliminar un pedido?**
No directamente, pero puedes marcarlo como cancelado o ignorarlo.

**¿La IA funciona sin internet?**
No, requiere conexión para actualizar la base de datos.

**¿Puedo tener varios administradores?**
Actualmente solo hay un usuario admin. Todos deben usar las mismas credenciales.

---

## 📞 Soporte

Si tienes problemas con la aplicación:

1. Verifica tu conexión a Internet
2. Cierra y vuelve a abrir la app
3. Contacta con soporte técnico

---

**¡Gracias por usar DOÑA MERCEDES!** 🍎🥕🍊
