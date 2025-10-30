# 🗄️ Mapeado de Base de Datos - Hamburguesería

---

## 📦 Entidad: **empleados**

| Campo | Tipo | Restricciones |
|-------|------|---------------|
| id | INT | PK, AUTO_INCREMENT |
| nombre | VARCHAR(100) | NOT NULL |
| email | VARCHAR(100) | UNIQUE, NOT NULL |
| password | VARCHAR(255) | NOT NULL |
| telefono | VARCHAR(20) | |
| activo | BOOLEAN | DEFAULT TRUE |
| fecha_creacion | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |
| ultima_actualizacion | TIMESTAMP | ON UPDATE CURRENT_TIMESTAMP |

---

## 📦 Entidad: **categorias**

| Campo | Tipo | Restricciones |
|-------|------|---------------|
| id | INT | PK, AUTO_INCREMENT |
| nombre | VARCHAR(100) | UNIQUE, NOT NULL |
| descripcion | TEXT | |
| imagen_url | VARCHAR(255) | |
| activo | BOOLEAN | DEFAULT TRUE |
| orden | INT | DEFAULT 0 |
| fecha_creacion | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |
| ultima_actualizacion | TIMESTAMP | ON UPDATE CURRENT_TIMESTAMP |

---

## 📦 Entidad: **productos**

| Campo | Tipo | Restricciones |
|-------|------|---------------|
| id | INT | PK, AUTO_INCREMENT |
| categoria_id | INT | FK → categorias.id, NOT NULL |
| nombre | VARCHAR(150) | NOT NULL |
| descripcion | TEXT | |
| precio | DECIMAL(10,2) | NOT NULL, CHECK >= 0 |
| imagen_url | VARCHAR(255) | |
| disponible | BOOLEAN | DEFAULT TRUE |
| destacado | BOOLEAN | DEFAULT FALSE |
| fecha_creacion | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |
| ultima_actualizacion | TIMESTAMP | ON UPDATE CURRENT_TIMESTAMP |

---

## 📦 Entidad: **ventas**

| Campo | Tipo | Restricciones |
|-------|------|---------------|
| id | INT | PK, AUTO_INCREMENT |
| numero_venta | VARCHAR(50) | UNIQUE, NOT NULL |
| empleado_id | INT | FK → empleados.id, NULL |
| tipo_venta | ENUM | 'online', 'presencial', NOT NULL |
| metodo_pago | ENUM | 'qr', 'debito', 'efectivo', 'tarjeta', NOT NULL |
| cliente_nombre | VARCHAR(100) | NOT NULL |
| cliente_telefono | VARCHAR(20) | NOT NULL |
| cliente_email | VARCHAR(100) | NULL |
| cliente_notas | TEXT | |
| subtotal | DECIMAL(10,2) | NOT NULL, CHECK >= 0 |
| descuento | DECIMAL(10,2) | DEFAULT 0.00, CHECK >= 0 |
| total | DECIMAL(10,2) | NOT NULL, CHECK >= 0 |
| estado | ENUM | 'pendiente', 'confirmada', 'preparando', 'lista', 'entregada', 'cancelada' |
| notas_internas | TEXT | |
| fecha_venta | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |
| ultima_actualizacion | TIMESTAMP | ON UPDATE CURRENT_TIMESTAMP |

**Constraints especiales:**
- `total = subtotal - descuento`
- Si `tipo_venta='presencial'` → `empleado_id` NOT NULL
- Si `tipo_venta='online'` → `empleado_id` NULL

---

## 📦 Entidad: **detalle_ventas**

| Campo | Tipo | Restricciones |
|-------|------|---------------|
| id | INT | PK, AUTO_INCREMENT |
| venta_id | INT | FK → ventas.id, NOT NULL, ON DELETE CASCADE |
| producto_id | INT | FK → productos.id, NOT NULL, ON DELETE RESTRICT |
| nombre_producto | VARCHAR(150) | NOT NULL (snapshot) |
| precio_unitario | DECIMAL(10,2) | NOT NULL, CHECK >= 0 (snapshot) |
| cantidad | INT | NOT NULL, CHECK > 0 |
| subtotal | DECIMAL(10,2) | NOT NULL, CHECK >= 0 |
| notas | TEXT | |
| fecha_creacion | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |

**Constraints especiales:**
- `subtotal = cantidad * precio_unitario`

---

## 🔗 Relaciones

```
categorias (1) ────< (N) productos

empleados (1) ────< (N) ventas [solo presenciales]

ventas (1) ────< (N) detalle_ventas

productos (1) ────< (N) detalle_ventas
```

---

## 📝 Notas Clave

**NO hay tabla `carrito`**: El carrito es temporal en el frontend (localStorage)

**NO hay tabla `clientes`**: Datos del cliente se guardan directamente en `ventas`

**Snapshots**: `nombre_producto` y `precio_unitario` en `detalle_ventas` preservan histórico

**Lógica de ventas:**
- **Online**: `tipo_venta='online'` + `empleado_id=NULL`
- **Presencial**: `tipo_venta='presencial'` + `empleado_id` obligatorio