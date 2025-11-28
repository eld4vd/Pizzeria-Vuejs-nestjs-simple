<script setup lang="ts">
import { ref, computed, nextTick, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { useAuthStore } from '@/stores'
import { useToast } from 'vue-toastification'
import axios from '@/plugins/axios'

interface Props {
  show: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
}>()

const router = useRouter()
const cartStore = useCartStore()
const authStore = useAuthStore()
const toast = useToast()

// Ref al contenedor del body
const checkoutBodyRef = ref<HTMLDivElement | null>(null)

// Verificar si hay un cliente autenticado (NO admin ni empleado)
const isClienteAutenticado = computed(() => authStore.isAuthenticated && authStore.isCliente)

// Verificar si es admin o empleado (no pueden comprar)
const isAdminOEmpleado = computed(() => authStore.isAuthenticated && (authStore.isAdmin || authStore.userRole === 'empleado'))

// Datos del formulario (solo dirección y notas, lo demás viene del usuario)
const formData = ref({
  direccion: '',
  ciudad: 'Cochabamba',
  metodoPago: 'qr' as 'qr' | 'tarjeta' | 'efectivo' | 'debito',
  notasAdicionales: ''
})

// Validación
const errors = ref({
  direccion: ''
})

// Estados
const loading = ref(false)
const step = ref(1) // 1: Dirección, 2: Método de pago, 3: Confirmación

// Watch para manejar cuando se abre el modal
watch(() => props.show, (newVal) => {
  if (newVal) {
    // Si es ADMIN o EMPLEADO, no puede comprar
    if (isAdminOEmpleado.value) {
      emit('close')
      toast.warning('Los administradores y empleados no pueden realizar pedidos. Crea una cuenta de cliente para comprar.', {
        timeout: 5000
      })
      return
    }
    
    // Si NO está autenticado como cliente, redirigir a login
    if (!isClienteAutenticado.value) {
      emit('close')
      toast.info('Debes iniciar sesión como cliente para realizar un pedido')
      router.push('/login')
      return
    }
    // Reiniciar formulario
    step.value = 1
    formData.value.direccion = ''
    formData.value.notasAdicionales = ''
    errors.value.direccion = ''
  }
})

// Scroll al inicio
const scrollToTop = () => {
  nextTick(() => {
    if (checkoutBodyRef.value) {
      checkoutBodyRef.value.scrollTo({ top: 0, behavior: 'smooth' })
    }
  })
}

const total = computed(() => cartStore.total)
const costoDelivery = computed(() => 10)
const totalConDelivery = computed(() => total.value + costoDelivery.value)

const formatPrice = (price: number) => `Bs. ${price.toFixed(2)}`

// Validar dirección
const validateStep1 = () => {
  errors.value.direccion = ''
  if (!formData.value.direccion.trim()) {
    errors.value.direccion = 'La dirección de entrega es requerida'
    return false
  }
  return true
}

const nextStep = () => {
  if (step.value === 1 && validateStep1()) {
    step.value = 2
    scrollToTop()
  } else if (step.value === 2) {
    step.value = 3
    scrollToTop()
  }
}

const prevStep = () => {
  if (step.value > 1) {
    step.value--
    scrollToTop()
  }
}

const handleConfirmOrder = async () => {
  if (!isClienteAutenticado.value || !authStore.usuario) {
    toast.error('Debes estar autenticado como cliente para realizar un pedido')
    return
  }

  try {
    loading.value = true

    const ventaData = {
      idCliente: authStore.userId,
      clienteNombre: authStore.usuario.nombre,
      clienteTelefono: authStore.usuario.telefono || '',
      clienteEmail: authStore.usuario.email || '',
      clienteNotas: `Delivery - ${formData.value.direccion}, ${formData.value.ciudad}`,
      tipoVenta: 'online',
      estado: 'confirmada',
      metodoPago: formData.value.metodoPago,
      subtotal: total.value,
      descuento: 0,
      total: totalConDelivery.value,
      notasInternas: formData.value.notasAdicionales || null,
      detalles: cartStore.items.map(item => ({
        idProducto: item.producto.id,
        nombreProducto: item.tamaño 
          ? `${item.producto.nombre} (${item.tamaño})` 
          : item.producto.nombre,
        cantidad: item.cantidad,
        precioUnitario: item.precioFinal,
        subtotal: item.precioFinal * item.cantidad,
        tamaño: item.tamaño || null,
        notas: item.notas || null
      }))
    }

    console.log('📤 Enviando venta:', ventaData)
    const response = await axios.post('/ventas', ventaData)
    console.log('✅ Venta creada:', response.data)

    toast.success(
      `🎉 ¡Pedido #${response.data.numeroVenta} registrado!\n\n📍 ${formData.value.direccion}\n⏱️ Entrega: 30-45 min`,
      { position: 'top-center', timeout: 6000, icon: '🍕' }
    )

    cartStore.clearCart()
    handleClose()
    
    // Redirigir a mis pedidos
    setTimeout(() => router.push('/mis-pedidos'), 1500)

  } catch (error: any) {
    console.error('❌ Error:', error)
    const message = error.response?.data?.message || 'Error al procesar el pedido'
    toast.error(Array.isArray(message) ? message.join('\n') : message)
  } finally {
    loading.value = false
  }
}

const handleClose = () => {
  step.value = 1
  formData.value = {
    direccion: '',
    ciudad: 'Cochabamba',
    metodoPago: 'qr',
    notasAdicionales: ''
  }
  errors.value.direccion = ''
  emit('close')
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="show" class="modal-overlay" @click.self="handleClose">
        <div class="checkout-modal">
          <!-- Header -->
          <div class="checkout-header">
            <h3 class="checkout-title">
              <i class="fas fa-shopping-bag mr-2"></i>
              Finalizar Pedido
            </h3>
            <button class="close-btn" @click="handleClose">
              <i class="fas fa-times"></i>
            </button>
          </div>

          <!-- Usuario Info -->
          <div class="user-info-bar" v-if="authStore.usuario">
            <i class="fas fa-user-check"></i>
            <span>Pedido para: <strong>{{ authStore.usuario.nombre }}</strong></span>
            <span class="user-phone" v-if="authStore.usuario.telefono">
              <i class="fas fa-phone"></i> {{ authStore.usuario.telefono }}
            </span>
          </div>

          <!-- Progress Steps -->
          <div class="progress-steps">
            <div class="step" :class="{ active: step >= 1, completed: step > 1 }">
              <div class="step-icon">
                <i v-if="step > 1" class="fas fa-check"></i>
                <span v-else>1</span>
              </div>
              <div class="step-label">Dirección</div>
            </div>
            <div class="step-line" :class="{ active: step > 1 }"></div>
            <div class="step" :class="{ active: step >= 2, completed: step > 2 }">
              <div class="step-icon">
                <i v-if="step > 2" class="fas fa-check"></i>
                <span v-else>2</span>
              </div>
              <div class="step-label">Pago</div>
            </div>
            <div class="step-line" :class="{ active: step > 2 }"></div>
            <div class="step" :class="{ active: step >= 3 }">
              <div class="step-icon">3</div>
              <div class="step-label">Confirmar</div>
            </div>
          </div>

          <!-- Body -->
          <div ref="checkoutBodyRef" class="checkout-body">
            <!-- Step 1: Dirección de Entrega -->
            <div v-if="step === 1" class="step-content">
              <h4 class="section-title">
                <i class="fas fa-map-marker-alt mr-2"></i>
                Dirección de Entrega
              </h4>

              <div class="delivery-info-banner">
                <i class="fas fa-motorcycle"></i>
                <div>
                  <strong>Pedido con Delivery</strong>
                  <p>Costo de envío: Bs. 10.00</p>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Dirección completa</label>
                <textarea 
                  class="form-control"
                  v-model="formData.direccion"
                  rows="3"
                  placeholder="Ej: Av. América #123, entre calles Potosí y Sucre, edificio azul"
                  :class="{ 'is-invalid': errors.direccion }"
                ></textarea>
                <div v-if="errors.direccion" class="invalid-feedback">
                  {{ errors.direccion }}
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Ciudad</label>
                <select class="form-control" v-model="formData.ciudad">
                  <option value="Cochabamba">Cochabamba</option>
                  <option value="La Paz">La Paz</option>
                  <option value="Santa Cruz">Santa Cruz</option>
                  <option value="Sucre">Sucre</option>
                  <option value="Tarija">Tarija</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">Notas para el repartidor (opcional)</label>
                <textarea 
                  class="form-control"
                  v-model="formData.notasAdicionales"
                  rows="2"
                  placeholder="Ej: Tocar timbre, llamar al llegar..."
                  maxlength="200"
                ></textarea>
              </div>
            </div>

            <!-- Step 2: Método de Pago -->
            <div v-if="step === 2" class="step-content">
              <h4 class="section-title">
                <i class="fas fa-credit-card mr-2"></i>
                Método de Pago
              </h4>

              <div class="payment-methods">
                <label class="payment-card">
                  <input type="radio" value="qr" v-model="formData.metodoPago">
                  <div class="payment-content">
                    <div class="payment-icon"><i class="fas fa-qrcode"></i></div>
                    <div class="payment-info">
                      <h5>Código QR</h5>
                      <p>Pago mediante QR bancario</p>
                    </div>
                  </div>
                </label>

                <label class="payment-card">
                  <input type="radio" value="tarjeta" v-model="formData.metodoPago">
                  <div class="payment-content">
                    <div class="payment-icon"><i class="fas fa-credit-card"></i></div>
                    <div class="payment-info">
                      <h5>Tarjeta de Crédito</h5>
                      <p>Visa, Mastercard</p>
                    </div>
                  </div>
                </label>

                <label class="payment-card">
                  <input type="radio" value="efectivo" v-model="formData.metodoPago">
                  <div class="payment-content">
                    <div class="payment-icon"><i class="fas fa-money-bill-wave"></i></div>
                    <div class="payment-info">
                      <h5>Efectivo</h5>
                      <p>Pago contra entrega</p>
                    </div>
                  </div>
                </label>
              </div>

              <!-- Simulación QR -->
              <div v-if="formData.metodoPago === 'qr'" class="payment-simulation">
                <div class="qr-placeholder">
                  <i class="fas fa-qrcode"></i>
                  <p>Código QR (Simulado)</p>
                  <small>Escanea con tu app bancaria</small>
                </div>
              </div>
            </div>

            <!-- Step 3: Confirmación -->
            <div v-if="step === 3" class="step-content">
              <h4 class="section-title">
                <i class="fas fa-clipboard-check mr-2"></i>
                Confirmar Pedido
              </h4>

              <div class="confirmation-details">
                <!-- Datos de entrega -->
                <div class="detail-section">
                  <h5><i class="fas fa-truck mr-2"></i>Entrega</h5>
                  <div class="detail-row">
                    <span class="label">Cliente:</span>
                    <span class="value">{{ authStore.usuario?.nombre }}</span>
                  </div>
                  <div class="detail-row">
                    <span class="label">Teléfono:</span>
                    <span class="value">{{ authStore.usuario?.telefono || 'No registrado' }}</span>
                  </div>
                  <div class="detail-row">
                    <span class="label">Dirección:</span>
                    <span class="value">{{ formData.direccion }}, {{ formData.ciudad }}</span>
                  </div>
                </div>

                <!-- Método de pago -->
                <div class="detail-section">
                  <h5><i class="fas fa-wallet mr-2"></i>Pago</h5>
                  <div class="detail-row">
                    <span class="label">Método:</span>
                    <span class="value badge-payment">
                      {{ formData.metodoPago === 'qr' ? 'Código QR' : 
                         formData.metodoPago === 'tarjeta' ? 'Tarjeta' : 'Efectivo' }}
                    </span>
                  </div>
                </div>

                <!-- Productos -->
                <div class="detail-section">
                  <h5><i class="fas fa-pizza-slice mr-2"></i>Tu Pedido</h5>
                  <div v-for="item in cartStore.items" :key="item.producto.id" class="cart-item-row">
                    <span class="qty">{{ item.cantidad }}x</span>
                    <span class="name">{{ item.producto.nombre }}</span>
                    <span class="price">{{ formatPrice(item.precioFinal * item.cantidad) }}</span>
                  </div>
                  
                  <div class="totals">
                    <div class="total-row">
                      <span>Subtotal:</span>
                      <span>{{ formatPrice(total) }}</span>
                    </div>
                    <div class="total-row">
                      <span>Delivery:</span>
                      <span>{{ formatPrice(costoDelivery) }}</span>
                    </div>
                    <div class="total-row final">
                      <span>Total:</span>
                      <span>{{ formatPrice(totalConDelivery) }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="checkout-footer">
            <div class="footer-total">
              <span>Total:</span>
              <strong>{{ formatPrice(totalConDelivery) }}</strong>
            </div>
            <div class="footer-actions">
              <button v-if="step > 1" class="btn btn-secondary" @click="prevStep" :disabled="loading">
                <i class="fas fa-arrow-left"></i> Atrás
              </button>
              <button v-if="step < 3" class="btn btn-primary" @click="nextStep">
                Siguiente <i class="fas fa-arrow-right"></i>
              </button>
              <button v-if="step === 3" class="btn btn-success" @click="handleConfirmOrder" :disabled="loading">
                <span v-if="loading"><i class="fas fa-spinner fa-spin"></i> Procesando...</span>
                <span v-else><i class="fas fa-check-circle"></i> Confirmar Pedido</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 20px;
}

.checkout-modal {
  background: white;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(50px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Header */
.checkout-header {
  padding: 18px 25px;
  background: linear-gradient(135deg, #fca100, #e85a19);
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 16px 16px 0 0;
}

.checkout-title {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
}

.close-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  width: 35px;
  height: 35px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: rotate(90deg);
}

/* User Info Bar */
.user-info-bar {
  background: #e8f5e9;
  padding: 12px 25px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  color: #1b5e20 !important;
  border-bottom: 1px solid #c8e6c9;
}

.user-info-bar span {
  color: #1b5e20 !important;
}

.user-info-bar strong {
  color: #2e7d32 !important;
}

.user-info-bar i:first-child {
  font-size: 18px;
}

.user-phone {
  margin-left: auto;
  color: #558b2f;
}

/* Progress Steps */
.progress-steps {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 15px 20px;
  background: #f8f9fa;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.step-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: white;
  border: 2px solid #dee2e6;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 14px;
  color: #6c757d;
  transition: all 0.3s ease;
}

.step.active .step-icon {
  background: #fca100;
  border-color: #fca100;
  color: white;
}

.step.completed .step-icon {
  background: #28a745;
  border-color: #28a745;
  color: white;
}

.step-label {
  font-size: 11px;
  font-weight: 600;
  color: #6c757d;
}

.step.active .step-label { color: #fca100; }

.step-line {
  width: 50px;
  height: 2px;
  background: #dee2e6;
  transition: all 0.3s ease;
}

.step-line.active { background: #28a745; }

/* Body */
.checkout-body {
  flex: 1;
  overflow-y: auto;
  padding: 20px 25px;
}

.section-title {
  color: #1a1a2e;
  font-weight: 700;
  font-size: 18px;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #fca100;
}

.section-title i { color: #fca100; }

/* Delivery Banner */
.delivery-info-banner {
  background: linear-gradient(135deg, #e3f2fd, #bbdefb);
  border-left: 4px solid #2196f3;
  padding: 15px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
}

.delivery-info-banner i {
  font-size: 28px;
  color: #1976d2;
}

.delivery-info-banner strong { color: #1565c0; }
.delivery-info-banner p { margin: 0; color: #1976d2; font-size: 14px; }

/* Form */
.form-group {
  margin-bottom: 15px;
}

.form-label {
  display: block;
  margin-bottom: 6px;
  font-weight: 600;
  color: #1a1a2e !important;
  font-size: 14px;
}

.form-control {
  width: 100%;
  padding: 12px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 14px;
  color: #1a1a2e !important;
  background-color: #ffffff !important;
  transition: all 0.3s ease;
}

.form-control:focus {
  outline: none;
  border-color: #fca100;
  box-shadow: 0 0 0 3px rgba(252, 161, 0, 0.15);
}

.form-control.is-invalid { border-color: #dc3545; }
.invalid-feedback { color: #dc3545; font-size: 12px; margin-top: 5px; }

/* Payment Methods */
.payment-methods {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.payment-card {
  cursor: pointer;
}

.payment-card input { display: none; }

.payment-content {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  border: 2px solid #e9ecef;
  border-radius: 10px;
  transition: all 0.3s ease;
}

.payment-icon {
  width: 50px;
  height: 50px;
  border-radius: 10px;
  background: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  color: #6c757d;
}

.payment-info h5 { margin: 0 0 4px 0; font-size: 15px; color: #1a1a2e; }
.payment-info p { margin: 0; font-size: 12px; color: #6c757d; }

.payment-card input:checked + .payment-content {
  border-color: #fca100;
  background: rgba(252, 161, 0, 0.05);
}

.payment-card input:checked + .payment-content .payment-icon {
  background: #fca100;
  color: white;
}

/* QR Simulation */
.payment-simulation {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

.qr-placeholder {
  width: 180px;
  height: 180px;
  background: #f8f9fa;
  border: 2px dashed #dee2e6;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #6c757d;
}

.qr-placeholder i { font-size: 50px; margin-bottom: 10px; }
.qr-placeholder p { margin: 0; font-weight: 600; }

/* Confirmation */
.confirmation-details {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.detail-section {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 10px;
}

.detail-section h5 {
  margin: 0 0 12px 0;
  font-size: 14px;
  font-weight: 700;
  color: #1a1a2e;
  padding-bottom: 8px;
  border-bottom: 1px solid #dee2e6;
}

.detail-section h5 i { color: #fca100; }

.detail-row {
  display: flex;
  justify-content: space-between;
  padding: 6px 0;
  font-size: 13px;
}

.detail-row .label { color: #6c757d; }
.detail-row .value { color: #1a1a2e; font-weight: 500; }

.badge-payment {
  background: #28a745;
  color: white;
  padding: 3px 10px;
  border-radius: 12px;
  font-size: 12px;
}

.cart-item-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 0;
  border-bottom: 1px solid #e9ecef;
}

.cart-item-row .qty { font-weight: 700; color: #fca100; min-width: 30px; }
.cart-item-row .name { flex: 1; color: #1a1a2e; }
.cart-item-row .price { font-weight: 600; color: #1a1a2e; }

.totals {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 2px solid #dee2e6;
}

.total-row {
  display: flex;
  justify-content: space-between;
  padding: 6px 0;
  font-size: 14px;
  color: #1a1a2e !important;
}

.total-row span {
  color: #1a1a2e !important;
}

.total-row.final {
  font-size: 18px;
  font-weight: 700;
  padding-top: 10px;
  border-top: 2px solid #fca100;
  margin-top: 8px;
}

/* Footer */
.checkout-footer {
  padding: 15px 25px;
  background: #f8f9fa;
  border-top: 2px solid #dee2e6;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 0 0 16px 16px;
}

.footer-total {
  font-size: 14px;
  color: #6c757d;
}

.footer-total strong {
  font-size: 20px;
  color: #1a1a2e;
  margin-left: 8px;
}

.footer-actions {
  display: flex;
  gap: 10px;
}

.btn {
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.btn:disabled { opacity: 0.6; cursor: not-allowed; }

.btn-primary {
  background: #fca100;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #e89000;
  transform: translateY(-2px);
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-success {
  background: #28a745;
  color: white;
}

.btn-success:hover:not(:disabled) {
  background: #218838;
  transform: translateY(-2px);
}

/* Transitions */
.modal-enter-active, .modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from, .modal-leave-to {
  opacity: 0;
}

/* Responsive */
@media (max-width: 576px) {
  .modal-overlay {
    padding: 0;
    align-items: flex-end;
  }

  .checkout-modal {
    max-height: 100vh;
    border-radius: 20px 20px 0 0;
    animation: slideUpMobile 0.3s ease;
  }

  @keyframes slideUpMobile {
    from { transform: translateY(100%); }
    to { transform: translateY(0); }
  }
  
  .checkout-header { 
    border-radius: 20px 20px 0 0;
    padding: 15px 20px;
  }

  .checkout-title {
    font-size: 18px;
  }

  .close-btn {
    width: 32px;
    height: 32px;
  }

  /* User info bar */
  .user-info-bar {
    padding: 10px 15px;
    flex-wrap: wrap;
    font-size: 13px;
  }

  .user-phone {
    width: 100%;
    margin-left: 28px;
    margin-top: 5px;
  }

  /* Progress steps en móvil */
  .progress-steps {
    padding: 12px 15px;
  }

  .step-icon {
    width: 28px;
    height: 28px;
    font-size: 12px;
  }

  .step-label {
    font-size: 10px;
  }

  .step-line {
    width: 30px;
  }

  /* Body */
  .checkout-body {
    padding: 15px;
  }

  .section-title {
    font-size: 16px;
    margin-bottom: 15px;
  }

  /* Delivery banner */
  .delivery-info-banner {
    padding: 12px;
    flex-direction: column;
    text-align: center;
    gap: 10px;
  }

  .delivery-info-banner i {
    font-size: 24px;
  }

  /* Form controls */
  .form-control {
    padding: 10px;
    font-size: 16px; /* Evita zoom en iOS */
  }

  .form-label {
    font-size: 13px;
  }

  /* Payment methods */
  .payment-content {
    padding: 12px;
    gap: 12px;
  }

  .payment-icon {
    width: 40px;
    height: 40px;
    font-size: 18px;
  }

  .payment-info h5 {
    font-size: 14px;
  }

  .payment-info p {
    font-size: 11px;
  }

  /* QR */
  .qr-placeholder {
    width: 150px;
    height: 150px;
  }

  .qr-placeholder i {
    font-size: 40px;
  }

  /* Confirmation details */
  .detail-section {
    padding: 12px;
  }

  .detail-section h5 {
    font-size: 13px;
  }

  .detail-row {
    font-size: 12px;
    flex-wrap: wrap;
  }

  .detail-row .label {
    width: 100%;
    margin-bottom: 2px;
  }

  .cart-item-row {
    font-size: 13px;
    gap: 8px;
  }

  .totals .total-row {
    font-size: 13px;
  }

  .totals .total-row.final {
    font-size: 16px;
  }

  /* Footer */
  .checkout-footer { 
    border-radius: 0; 
    flex-direction: column; 
    gap: 12px;
    padding: 12px 15px;
    padding-bottom: 20px; /* Extra padding para dispositivos con notch */
  }

  .footer-total {
    text-align: center;
    width: 100%;
  }

  .footer-total strong {
    font-size: 18px;
  }

  .footer-actions { 
    width: 100%;
    flex-direction: column;
    gap: 10px;
  }

  .footer-actions .btn { 
    flex: 1; 
    justify-content: center;
    padding: 12px 20px;
    font-size: 15px;
  }
}

/* Extra small devices */
@media (max-width: 375px) {
  .step-line {
    width: 20px;
  }

  .step-label {
    font-size: 9px;
  }

  .checkout-title {
    font-size: 16px;
  }

  .payment-content {
    flex-direction: column;
    text-align: center;
  }
}
</style>
