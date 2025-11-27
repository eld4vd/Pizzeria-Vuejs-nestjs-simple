<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import axios from '@/plugins/axios'
import { useToast } from 'vue-toastification'
import type { Producto } from '@/models/producto'
import VentaPago from './VentaPago.vue'

const toast = useToast()

interface Props {
  show: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
  saved: []
}>()

interface ProductoCarrito {
  idProducto: number
  producto: Producto
  cantidad: number
  precioUnitario: number
  subtotal: number
  notas: string
}

// Datos del formulario
const clienteNombre = ref('')
const clienteTelefono = ref('')
const clienteEmail = ref('')
const clienteNotas = ref('')
const metodoPago = ref<'efectivo' | 'qr' | 'debito' | 'tarjeta'>('efectivo')
const descuento = ref(0)
const notasInternas = ref('')

// Productos
const productos = ref<Producto[]>([])
const carrito = ref<ProductoCarrito[]>([])
const productoSeleccionado = ref<number | null>(null)
const cantidadProducto = ref(1)
const notasProducto = ref('')

// Loading
const loading = ref(false)
const guardando = ref(false)

// Modal de Pago
const showPagoModal = ref(false)

// Computed
const subtotal = computed(() => {
  return carrito.value.reduce((sum, item) => sum + item.subtotal, 0)
})

const total = computed(() => {
  return subtotal.value - descuento.value
})

const carritoVacio = computed(() => carrito.value.length === 0)

// Métodos
const cargarProductos = async () => {
  try {
    loading.value = true
    const response = await axios.get('/productos')
    productos.value = response.data.filter((p: Producto) => p.disponible)
  } catch (error) {
    console.error('Error al cargar productos:', error)
    toast.error('Error al cargar los productos')
  } finally {
    loading.value = false
  }
}

const agregarAlCarrito = () => {
  if (!productoSeleccionado.value || cantidadProducto.value < 1) {
    toast.warning('Seleccione un producto y cantidad válida')
    return
  }

  const producto = productos.value.find(p => p.id === productoSeleccionado.value)
  if (!producto) return

  const precioUnitario = Number(producto.precio)
  const cantidad = Number(cantidadProducto.value)

  const itemExistente = carrito.value.find(item => item.idProducto === producto.id)

  if (itemExistente) {
    itemExistente.cantidad += cantidad
    itemExistente.subtotal = itemExistente.cantidad * itemExistente.precioUnitario
    if (notasProducto.value.trim()) {
      itemExistente.notas += '; ' + notasProducto.value.trim()
    }
    toast.success('Cantidad actualizada en el carrito')
  } else {
    carrito.value.push({
      idProducto: producto.id,
      producto: producto,
      cantidad: cantidad,
      precioUnitario: precioUnitario,
      subtotal: precioUnitario * cantidad,
      notas: notasProducto.value.trim()
    })
    toast.success('Producto agregado al carrito')
  }

  // Reset
  productoSeleccionado.value = null
  cantidadProducto.value = 1
  notasProducto.value = ''
}

const actualizarCantidad = (index: number, nuevaCantidad: number) => {
  if (nuevaCantidad < 1) return
  const item = carrito.value[index]
  if (!item) return
  item.cantidad = nuevaCantidad
  item.subtotal = item.cantidad * item.precioUnitario
}

const eliminarDelCarrito = (index: number) => {
  const item = carrito.value[index]
  if (!item) return
  const nombreProducto = item.producto.nombre
  carrito.value.splice(index, 1)
  toast.info(`${nombreProducto} eliminado del carrito`)
}

const limpiarCarrito = () => {
  if (!confirm('¿Está seguro de limpiar todo el carrito?')) return
  carrito.value = []
  toast.info('Carrito limpiado')
}

const validarFormulario = (): boolean => {
  if (!clienteNombre.value.trim()) {
    toast.error('El nombre del cliente es obligatorio')
    return false
  }

  if (!clienteTelefono.value.trim()) {
    toast.error('El teléfono del cliente es obligatorio')
    return false
  }

  if (carritoVacio.value) {
    toast.error('Debe agregar al menos un producto al carrito')
    return false
  }

  if (total.value < 0) {
    toast.error('El total no puede ser negativo')
    return false
  }

  return true
}

const procederAlPago = () => {
  if (!validarFormulario()) return
  showPagoModal.value = true
}

const handlePagoConfirmado = async (metodo: string, montoPagado: number) => {
  try {
    guardando.value = true
    metodoPago.value = metodo as 'efectivo' | 'qr' | 'debito' | 'tarjeta'

    const ventaData = {
      numeroVenta: '', // El backend lo generará automáticamente
      tipoVenta: 'presencial',
      metodoPago: metodo,
      clienteNombre: clienteNombre.value.trim(),
      clienteTelefono: clienteTelefono.value.trim(),
      clienteEmail: clienteEmail.value.trim() || null,
      clienteNotas: clienteNotas.value.trim() || null,
      subtotal: Number(subtotal.value),
      descuento: Number(descuento.value),
      total: Number(total.value),
      estado: 'entregada', // Ventas presenciales se entregan inmediatamente
      notasInternas: notasInternas.value.trim() || null,
      // idCliente NO se envía - ventas presenciales no requieren cuenta de cliente
      detalles: carrito.value.map(item => ({
        idProducto: item.idProducto,
        nombreProducto: item.producto.nombre,
        precioUnitario: Number(item.precioUnitario),
        cantidad: Number(item.cantidad),
        subtotal: Number(item.subtotal),
        notas: item.notas || null
      }))
    }

    await axios.post('/ventas', ventaData)
    
    showPagoModal.value = false
    toast.success('¡Venta registrada exitosamente!')
    
    if (metodo === 'efectivo' && montoPagado > total.value) {
      const cambio = montoPagado - total.value
      toast.info(`Cambio: Bs. ${cambio.toFixed(2)}`, { timeout: 5000 })
    }
    
    limpiarFormulario()
    emit('saved')
    emit('close')
  } catch (error: any) {
    console.error('Error al guardar venta:', error)
    const message = error.response?.data?.message || 'Error al guardar la venta'
    toast.error(message)
  } finally {
    guardando.value = false
  }
}

const limpiarFormulario = () => {
  clienteNombre.value = ''
  clienteTelefono.value = ''
  clienteEmail.value = ''
  clienteNotas.value = ''
  metodoPago.value = 'efectivo'
  descuento.value = 0
  notasInternas.value = ''
  carrito.value = []
  productoSeleccionado.value = null
  cantidadProducto.value = 1
  notasProducto.value = ''
}

const handleClose = () => {
  if (carrito.value.length > 0) {
    if (!confirm('¿Está seguro de cerrar? Se perderá la venta en progreso.')) return
  }
  limpiarFormulario()
  emit('close')
}

// Watch para cargar productos cuando se abre el modal
watch(() => props.show, (newVal) => {
  if (newVal) {
    cargarProductos()
  }
})

onMounted(() => {
  if (props.show) {
    cargarProductos()
  }
})
</script>

<template>
  <div 
    v-if="show" 
    class="modal fade show venta-modal" 
    style="display: block; background: rgba(0,0,0,0.5);"
    @click.self="handleClose"
  >
    <div class="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
      <div class="modal-content venta-form-wrapper">
        <div class="modal-header venta-header">
          <div>
            <h4 class="modal-title mb-1">
              <i class="fas fa-receipt mr-2"></i>
              Nueva Venta - Punto de Venta
            </h4>
            <small class="text-muted">Complete los datos para registrar la venta</small>
          </div>
          <button type="button" class="close" @click="handleClose">
            <span>&times;</span>
          </button>
        </div>

        <div class="modal-body venta-body">
          <div class="venta-form-content">
            <div class="row">
              <!-- Columna Izquierda: Productos y Carrito -->
              <div class="col-lg-8">
                <!-- Agregar Producto -->
                <div class="venta-section mb-3">
                  <div class="section-header">
                    <i class="fas fa-shopping-basket"></i>
                    <span>Seleccionar Productos</span>
                  </div>
                  <div class="section-body">
                    <div class="row align-items-end">
                      <div class="col-md-5">
                        <label class="venta-label">Producto</label>
                        <select 
                          v-model="productoSeleccionado" 
                          class="venta-input"
                          :disabled="loading"
                        >
                          <option :value="null">Seleccione un producto...</option>
                          <option 
                            v-for="producto in productos" 
                            :key="producto.id"
                            :value="producto.id"
                          >
                            {{ producto.nombre }} - Bs. {{ Number(producto.precio).toFixed(2) }}
                          </option>
                        </select>
                      </div>
                      <div class="col-md-2">
                        <label class="venta-label">Cantidad</label>
                        <input 
                          type="number" 
                          v-model.number="cantidadProducto"
                          class="venta-input"
                          min="1"
                          step="1"
                        />
                      </div>
                      <div class="col-md-3">
                        <label class="venta-label">Notas opcionales</label>
                        <input 
                          type="text" 
                          v-model="notasProducto"
                          class="venta-input"
                          placeholder="Ej: sin cebolla"
                        />
                      </div>
                      <div class="col-md-2">
                        <button 
                          type="button"
                          @click="agregarAlCarrito"
                          class="venta-btn-add"
                          :disabled="!productoSeleccionado"
                        >
                          <i class="fas fa-plus"></i> Agregar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Carrito -->
                <div class="venta-section">
                  <div class="section-header">
                    <div class="d-flex align-items-center">
                      <i class="fas fa-shopping-cart"></i>
                      <span>Carrito de Compra</span>
                      <span class="cart-count">{{ carrito.length }}</span>
                    </div>
                    <button 
                      v-if="carrito.length > 0"
                      type="button"
                      @click="limpiarCarrito"
                      class="btn-clear-cart"
                    >
                      <i class="fas fa-trash-alt"></i> Limpiar
                    </button>
                  </div>
                  <div class="section-body p-0">
                    <div v-if="carritoVacio" class="empty-cart">
                      <i class="fas fa-shopping-basket"></i>
                      <p>No hay productos agregados</p>
                      <small>Seleccione productos para comenzar</small>
                    </div>

                    <div v-else class="cart-items">
                      <div 
                        v-for="(item, index) in carrito" 
                        :key="index"
                        class="cart-item"
                      >
                        <div class="cart-item-image">
                          <img 
                            :src="item.producto.imagenUrl || '/images/pizza-1.jpg'" 
                            :alt="item.producto.nombre"
                          />
                        </div>
                        <div class="cart-item-info">
                          <h6>{{ item.producto.nombre }}</h6>
                          <p v-if="item.notas" class="item-notes">
                            <i class="fas fa-sticky-note"></i> {{ item.notas }}
                          </p>
                          <p class="item-price">Bs. {{ item.precioUnitario.toFixed(2) }} c/u</p>
                        </div>
                        <div class="cart-item-quantity">
                          <button 
                            type="button"
                            @click="actualizarCantidad(index, item.cantidad - 1)"
                            class="qty-btn"
                            :disabled="item.cantidad <= 1"
                          >
                            <i class="fas fa-minus"></i>
                          </button>
                          <input 
                            type="number"
                            :value="item.cantidad"
                            @input="actualizarCantidad(index, Number(($event.target as HTMLInputElement).value))"
                            class="qty-input"
                            min="1"
                          />
                          <button 
                            type="button"
                            @click="actualizarCantidad(index, item.cantidad + 1)"
                            class="qty-btn"
                          >
                            <i class="fas fa-plus"></i>
                          </button>
                        </div>
                        <div class="cart-item-total">
                          <strong>Bs. {{ item.subtotal.toFixed(2) }}</strong>
                        </div>
                        <button 
                          type="button"
                          @click="eliminarDelCarrito(index)"
                          class="cart-item-remove"
                          title="Eliminar"
                        >
                          <i class="fas fa-times"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Columna Derecha: Datos del Cliente y Totales -->
              <div class="col-lg-4">
                <!-- Datos del Cliente -->
                <div class="venta-section mb-3">
                  <div class="section-header">
                    <i class="fas fa-user"></i>
                    <span>Información del Cliente</span>
                  </div>
                  <div class="section-body">
                    <div class="venta-field">
                      <label class="venta-label">Nombre completo <span class="required">*</span></label>
                      <input 
                        type="text" 
                        v-model="clienteNombre"
                        class="venta-input"
                        placeholder="Nombre del cliente"
                        required
                      />
                    </div>

                    <div class="venta-field">
                      <label class="venta-label">Teléfono <span class="required">*</span></label>
                      <input 
                        type="text" 
                        v-model="clienteTelefono"
                        class="venta-input"
                        placeholder="Ej: 70123456"
                        required
                      />
                    </div>

                    <div class="venta-field">
                      <label class="venta-label">Email (opcional)</label>
                      <input 
                        type="email" 
                        v-model="clienteEmail"
                        class="venta-input"
                        placeholder="correo@ejemplo.com"
                      />
                    </div>

                    <div class="venta-field mb-0">
                      <label class="venta-label">Notas adicionales</label>
                      <textarea 
                        v-model="clienteNotas"
                        class="venta-textarea"
                        rows="2"
                        placeholder="Dirección, referencias, etc..."
                      ></textarea>
                    </div>
                  </div>
                </div>

                <!-- Resumen Rápido -->
                <div class="venta-section mb-3">
                  <div class="section-header">
                    <i class="fas fa-calculator"></i>
                    <span>Resumen</span>
                  </div>
                  <div class="section-body">
                    <div class="total-row">
                      <span class="total-label">Subtotal</span>
                      <span class="total-value">Bs. {{ subtotal.toFixed(2) }}</span>
                    </div>
                    
                    <div class="venta-field">
                      <label class="venta-label">Descuento (Bs.)</label>
                      <input 
                        type="number" 
                        v-model.number="descuento"
                        class="venta-input"
                        min="0"
                        step="0.01"
                        :max="subtotal"
                        placeholder="0.00"
                      />
                    </div>

                    <div class="total-divider"></div>
                    
                    <div class="total-row total-final">
                      <span class="total-label">Total a Pagar</span>
                      <span class="total-value">Bs. {{ total.toFixed(2) }}</span>
                    </div>

                    <div class="resumen-note">
                      <i class="fas fa-info-circle"></i>
                      El método de pago se seleccionará en el siguiente paso
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer venta-footer">
          <div class="footer-info">
            <span class="items-count">
              <i class="fas fa-shopping-bag"></i>
              {{ carrito.length }} {{ carrito.length === 1 ? 'producto' : 'productos' }}
            </span>
            <span class="total-amount">
              Total: <strong>Bs. {{ total.toFixed(2) }}</strong>
            </span>
          </div>
          <div class="footer-actions">
            <button 
              type="button" 
              class="venta-btn-cancel" 
              @click="handleClose"
              :disabled="guardando"
            >
              <i class="fas fa-times"></i> Cancelar
            </button>
            <button 
              type="button"
              class="venta-btn-save"
              @click="procederAlPago"
              :disabled="guardando || carritoVacio"
            >
              <i class="fas fa-credit-card mr-2"></i>
              Proceder al Pago
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal de Pago -->
  <VentaPago
    :show="showPagoModal"
    :venta-data="{
      clienteNombre,
      clienteTelefono,
      totalItems: carrito.length,
      subtotal,
      descuento,
      total
    }"
    @close="showPagoModal = false"
    @confirm="handlePagoConfirmado"
  />
</template>

<style scoped>
/* ===== MODAL PRINCIPAL ===== */
.venta-modal {
  z-index: 1050;
}

.venta-modal .modal-dialog {
  max-width: 98vw !important;
  width: 98vw !important;
  margin: 0.5rem auto;
  height: calc(100vh - 1rem);
}

.venta-modal .modal-content {
  border: none;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  animation: slideUp 0.3s ease;
  min-height: calc(100vh - 1rem);
  max-height: calc(100vh - 1rem);
  display: flex;
  flex-direction: column;
}

@keyframes slideUp {
  from {
    transform: translateY(30px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.venta-form-wrapper {
  background: #ffffff;
  display: flex;
  flex-direction: column;
  height: 100%;
}

/* ===== HEADER ===== */
.venta-header {
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  border-bottom: 1px solid #e9ecef;
  padding: 1.5rem 2rem;
}

.venta-header .modal-title {
  color: #2c3e50;
  font-weight: 600;
  font-size: 1.5rem;
}

.venta-header .modal-title i {
  color: #6c757d;
}

.venta-header .close {
  opacity: 0.5;
  font-size: 2rem;
  padding: 0;
  margin: 0;
  color: #2c3e50;
}

.venta-header .close:hover {
  opacity: 1;
}

/* ===== BODY ===== */
.venta-body {
  background: #f8f9fa;
  padding: 2rem;
  flex: 1;
  overflow-y: auto;
}

/* ===== SECCIONES ===== */
.venta-section {
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #e9ecef;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.section-header {
  background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
  border-bottom: 2px solid #1a252f;
  padding: 1.25rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: 700;
  color: #ffffff;
  font-size: 1.1rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.section-header i {
  color: #ffc107;
  margin-right: 0.75rem;
  font-size: 1.3rem;
}

.section-body {
  padding: 1.5rem;
  background: #fafbfc;
}

/* ===== CAMPOS DE FORMULARIO ===== */
.venta-field {
  margin-bottom: 1.25rem;
}

.venta-field:last-child {
  margin-bottom: 0;
}

.venta-label {
  display: block;
  font-size: 0.95rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  font-size: 0.85rem;
}

.required {
  color: #dc3545;
  font-weight: 700;
  font-size: 1.1rem;
}

.venta-input,
.venta-textarea {
  width: 100%;
  padding: 1rem 1.25rem;
  border: 2px solid #e9ecef;
  border-radius: 10px;
  font-size: 1rem;
  color: #2c3e50;
  background: #ffffff;
  transition: all 0.3s ease;
  font-weight: 500;
}

.venta-input:focus,
.venta-textarea:focus {
  outline: none;
  border-color: #2c3e50;
  box-shadow: 0 0 0 4px rgba(44, 62, 80, 0.1);
  background: #ffffff;
  transform: translateY(-1px);
}

.venta-input::placeholder,
.venta-textarea::placeholder {
  color: #adb5bd;
  font-weight: 400;
}

.venta-textarea {
  resize: vertical;
  font-family: inherit;
  min-height: 100px;
}

/* ===== BOTÓN AGREGAR ===== */
.venta-btn-add {
  width: 100%;
  padding: 0.75rem;
  background: #2c3e50;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.venta-btn-add:hover:not(:disabled) {
  background: #1a252f;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(44, 62, 80, 0.2);
}

.venta-btn-add:disabled {
  background: #e9ecef;
  color: #adb5bd;
  cursor: not-allowed;
}

/* ===== CARRITO ===== */
.cart-count {
  background: #2c3e50;
  color: #ffffff;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  margin-left: 0.5rem;
}

.btn-clear-cart {
  background: transparent;
  border: 1px solid #dee2e6;
  color: #6c757d;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-clear-cart:hover {
  background: #dc3545;
  border-color: #dc3545;
  color: #ffffff;
}

.empty-cart {
  text-align: center;
  padding: 3rem 1rem;
  color: #adb5bd;
}

.empty-cart i {
  font-size: 3rem;
  margin-bottom: 1rem;
  display: block;
}

.empty-cart p {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.empty-cart small {
  font-size: 0.9rem;
}

/* ===== ITEMS DEL CARRITO ===== */
.cart-items {
  max-height: 400px;
  overflow-y: auto;
}

.cart-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-bottom: 1px solid #f0f0f0;
  transition: background 0.2s ease;
}

.cart-item:last-child {
  border-bottom: none;
}

.cart-item:hover {
  background: #f8f9fa;
}

.cart-item-image {
  flex-shrink: 0;
  width: 60px;
  height: 60px;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #e9ecef;
}

.cart-item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cart-item-info {
  flex: 1;
  min-width: 0;
}

.cart-item-info h6 {
  font-size: 0.95rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 0.25rem 0;
}

.item-notes {
  font-size: 0.8rem;
  color: #6c757d;
  margin: 0.25rem 0;
}

.item-notes i {
  color: #adb5bd;
  margin-right: 0.25rem;
}

.item-price {
  font-size: 0.85rem;
  color: #6c757d;
  margin: 0;
}

.cart-item-quantity {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #f8f9fa;
  border-radius: 8px;
  padding: 0.25rem;
}

.qty-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: #ffffff;
  color: #6c757d;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.qty-btn:hover:not(:disabled) {
  background: #2c3e50;
  color: #ffffff;
}

.qty-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.qty-input {
  width: 50px;
  height: 32px;
  text-align: center;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  background: #ffffff;
  font-weight: 600;
  color: #2c3e50;
}

.cart-item-total {
  font-size: 1rem;
  font-weight: 700;
  color: #2c3e50;
  min-width: 80px;
  text-align: right;
}

.cart-item-remove {
  width: 32px;
  height: 32px;
  border: none;
  background: #fff5f5;
  color: #dc3545;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.cart-item-remove:hover {
  background: #dc3545;
  color: #ffffff;
}

/* ===== RESUMEN NOTE ===== */
.resumen-note {
  margin-top: 1rem;
  padding: 0.75rem 1rem;
  background: #e7f3ff;
  border-left: 3px solid #2c3e50;
  border-radius: 6px;
  font-size: 0.9rem;
  color: #2c3e50;
  font-weight: 500;
}

.resumen-note i {
  color: #6c757d;
}

/* ===== TOTALES ===== */
.venta-totals {
  background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
  color: #ffffff;
}

.venta-totals .section-header {
  background: transparent;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  color: #ffffff;
}

.venta-totals .section-header i {
  color: rgba(255, 255, 255, 0.8);
}

.venta-totals .section-body {
  padding: 1.5rem 1.25rem;
}

.total-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.total-label {
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.9);
}

.total-value {
  font-size: 1.1rem;
  font-weight: 600;
  color: #ffffff;
}

.total-divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.2);
  margin: 1.25rem 0;
}

.total-final .total-label {
  font-size: 1.1rem;
  font-weight: 700;
}

.total-final .total-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #ffc107;
}

.venta-totals .venta-input {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
  color: #ffffff;
}

.venta-totals .venta-input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.venta-totals .venta-input:focus {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.4);
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.1);
}

.venta-totals .venta-label {
  color: rgba(255, 255, 255, 0.9);
}

/* ===== FOOTER ===== */
.venta-footer {
  background: #f8f9fa;
  border-top: 1px solid #e9ecef;
  padding: 1.25rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.footer-info {
  display: flex;
  gap: 2rem;
  align-items: center;
}

.items-count {
  font-size: 0.95rem;
  color: #6c757d;
  font-weight: 500;
}

.items-count i {
  margin-right: 0.5rem;
}

.total-amount {
  font-size: 1rem;
  color: #495057;
}

.total-amount strong {
  font-size: 1.25rem;
  color: #2c3e50;
  font-weight: 700;
}

.footer-actions {
  display: flex;
  gap: 1rem;
}

.venta-btn-cancel,
.venta-btn-save {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
}

.venta-btn-cancel {
  background: #ffffff;
  color: #6c757d;
  border: 1px solid #dee2e6;
}

.venta-btn-cancel:hover:not(:disabled) {
  background: #f8f9fa;
  border-color: #adb5bd;
}

.venta-btn-save {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);
}

.venta-btn-save:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(40, 167, 69, 0.4);
}

.venta-btn-save:disabled,
.venta-btn-cancel:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* ===== SCROLL PERSONALIZADO ===== */
.cart-items::-webkit-scrollbar {
  width: 6px;
}

.cart-items::-webkit-scrollbar-track {
  background: #f8f9fa;
}

.cart-items::-webkit-scrollbar-thumb {
  background: #dee2e6;
  border-radius: 3px;
}

.cart-items::-webkit-scrollbar-thumb:hover {
  background: #adb5bd;
}

/* ===== RESPONSIVE ===== */
@media (min-width: 1400px) {
  .venta-modal .modal-dialog {
    max-width: 98vw !important;
    width: 98vw !important;
  }
}

@media (min-width: 1920px) {
  .venta-modal .modal-dialog {
    max-width: 1800px !important;
    width: 1800px !important;
  }
}

@media (max-width: 991px) {
  .venta-modal .modal-dialog {
    max-width: 98vw !important;
    width: 98vw !important;
    margin: 0.25rem auto;
    height: calc(100vh - 0.5rem);
  }
  
  .venta-modal .modal-content {
    min-height: calc(100vh - 0.5rem);
    max-height: calc(100vh - 0.5rem);
    border-radius: 8px;
  }
  
  .payment-methods {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .venta-modal .modal-dialog {
    max-width: 100vw !important;
    width: 100vw !important;
    margin: 0;
    height: 100vh;
  }
  
  .venta-modal .modal-content {
    min-height: 100vh;
    max-height: 100vh;
    border-radius: 0;
  }
  
  .venta-body {
    padding: 1rem;
  }
  
  .section-body {
    padding: 1rem;
  }
  
  .cart-item {
    flex-wrap: wrap;
  }
  
  .footer-info {
    flex-direction: column;
    gap: 0.5rem;
    align-items: flex-start;
  }
  
  .footer-actions {
    width: 100%;
  }
  
  .venta-btn-cancel,
  .venta-btn-save {
    flex: 1;
  }
  
  .payment-methods {
    grid-template-columns: 1fr;
  }
}
</style>
