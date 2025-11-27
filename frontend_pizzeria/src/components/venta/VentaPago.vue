<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  show: boolean
  ventaData: {
    clienteNombre: string
    clienteTelefono: string
    totalItems: number
    subtotal: number
    descuento: number
    total: number
  }
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
  confirm: [metodoPago: string, montoPagado: number]
}>()

const metodoPago = ref('efectivo')
const montoPagado = ref(0)

const cambio = computed(() => {
  if (metodoPago.value === 'efectivo' && montoPagado.value > props.ventaData.total) {
    return montoPagado.value - props.ventaData.total
  }
  return 0
})

const confirmarPago = () => {
  if (metodoPago.value === 'efectivo' && montoPagado.value < props.ventaData.total) {
    alert('El monto pagado debe ser mayor o igual al total')
    return
  }
  emit('confirm', metodoPago.value, montoPagado.value)
}

const handleClose = () => {
  emit('close')
}
</script>

<template>
  <div 
    v-if="show" 
    class="modal fade show pago-modal" 
    style="display: block; background: rgba(0,0,0,0.7);"
    @click.self="handleClose"
  >
    <div class="modal-dialog modal-lg modal-dialog-centered">
      <div class="modal-content pago-wrapper">
        <!-- Header -->
        <div class="pago-header">
          <div>
            <h4 class="modal-title mb-1">
              <i class="fas fa-credit-card mr-2"></i>
              Procesar Pago
            </h4>
            <small class="text-muted">Seleccione el método de pago y confirme la transacción</small>
          </div>
          <button type="button" class="close" @click="handleClose">
            <span>&times;</span>
          </button>
        </div>

        <!-- Body -->
        <div class="pago-body">
          <!-- Resumen de la Venta -->
          <div class="resumen-section">
            <h5 class="resumen-title">
              <i class="fas fa-file-invoice mr-2"></i>
              Resumen de la Venta
            </h5>
            <div class="resumen-content">
              <div class="resumen-row">
                <span class="resumen-label">Cliente:</span>
                <span class="resumen-value">{{ ventaData.clienteNombre }}</span>
              </div>
              <div class="resumen-row" v-if="ventaData.clienteTelefono">
                <span class="resumen-label">Teléfono:</span>
                <span class="resumen-value">{{ ventaData.clienteTelefono }}</span>
              </div>
              <div class="resumen-row">
                <span class="resumen-label">Total de Items:</span>
                <span class="resumen-value">{{ ventaData.totalItems }} productos</span>
              </div>
              <div class="resumen-divider"></div>
              <div class="resumen-row">
                <span class="resumen-label">Subtotal:</span>
                <span class="resumen-value">Bs. {{ ventaData.subtotal.toFixed(2) }}</span>
              </div>
              <div class="resumen-row" v-if="ventaData.descuento > 0">
                <span class="resumen-label">Descuento:</span>
                <span class="resumen-value text-danger">- Bs. {{ ventaData.descuento.toFixed(2) }}</span>
              </div>
              <div class="resumen-divider"></div>
              <div class="resumen-row total-row">
                <span class="resumen-label">TOTAL A PAGAR:</span>
                <span class="resumen-value total-amount">Bs. {{ ventaData.total.toFixed(2) }}</span>
              </div>
            </div>
          </div>

          <!-- Métodos de Pago -->
          <div class="metodos-section">
            <h5 class="metodos-title">
              <i class="fas fa-wallet mr-2"></i>
              Método de Pago
            </h5>
            <div class="metodos-grid">
              <!-- Efectivo -->
              <label class="metodo-card" :class="{ active: metodoPago === 'efectivo' }">
                <input type="radio" v-model="metodoPago" value="efectivo" />
                <div class="metodo-content">
                  <i class="fas fa-money-bill-wave"></i>
                  <span>Efectivo</span>
                </div>
              </label>

              <!-- QR -->
              <label class="metodo-card" :class="{ active: metodoPago === 'qr' }">
                <input type="radio" v-model="metodoPago" value="qr" />
                <div class="metodo-content">
                  <i class="fas fa-qrcode"></i>
                  <span>Código QR</span>
                </div>
              </label>

              <!-- Tarjeta de Débito -->
              <label class="metodo-card" :class="{ active: metodoPago === 'debito' }">
                <input type="radio" v-model="metodoPago" value="debito" />
                <div class="metodo-content">
                  <i class="fas fa-credit-card"></i>
                  <span>Tarjeta Débito</span>
                </div>
              </label>

              <!-- Tarjeta de Crédito -->
              <label class="metodo-card" :class="{ active: metodoPago === 'tarjeta' }">
                <input type="radio" v-model="metodoPago" value="tarjeta" />
                <div class="metodo-content">
                  <i class="fas fa-credit-card"></i>
                  <span>Tarjeta Crédito</span>
                </div>
              </label>
            </div>
          </div>

          <!-- Simulación de Pago -->
          <div class="simulacion-section">
            <!-- Efectivo -->
            <div v-if="metodoPago === 'efectivo'" class="pago-efectivo">
              <h6 class="simulacion-subtitle">
                <i class="fas fa-hand-holding-usd mr-2"></i>
                Pago en Efectivo
              </h6>
              <div class="efectivo-field">
                <label class="efectivo-label">Monto Recibido</label>
                <input 
                  type="number" 
                  v-model.number="montoPagado" 
                  class="efectivo-input"
                  :placeholder="`Mínimo: Bs. ${ventaData.total.toFixed(2)}`"
                  step="0.01"
                  min="0"
                />
              </div>
              <div v-if="cambio > 0" class="cambio-display">
                <span class="cambio-label">Cambio:</span>
                <span class="cambio-value">Bs. {{ cambio.toFixed(2) }}</span>
              </div>
            </div>

            <!-- QR -->
            <div v-else-if="metodoPago === 'qr'" class="pago-qr">
              <h6 class="simulacion-subtitle">
                <i class="fas fa-qrcode mr-2"></i>
                Pago con Código QR
              </h6>
              <div class="qr-container">
                <div class="qr-code">
                  <i class="fas fa-qrcode"></i>
                </div>
                <p class="qr-instructions">
                  Escanea este código QR con tu aplicación bancaria
                </p>
                <div class="qr-info">
                  <p><strong>Monto:</strong> Bs. {{ ventaData.total.toFixed(2) }}</p>
                  <p><strong>Concepto:</strong> Venta - {{ ventaData.clienteNombre }}</p>
                </div>
              </div>
            </div>

            <!-- Tarjeta -->
            <div v-else-if="metodoPago === 'debito' || metodoPago === 'tarjeta'" class="pago-tarjeta">
              <h6 class="simulacion-subtitle">
                <i class="fas fa-credit-card mr-2"></i>
                Pago con {{ metodoPago === 'debito' ? 'Tarjeta de Débito' : 'Tarjeta de Crédito' }}
              </h6>
              <div class="tarjeta-simulator">
                <div class="terminal-icon">
                  <i class="fas fa-cash-register"></i>
                </div>
                <p class="terminal-instructions">
                  Inserte o acerque la tarjeta al terminal
                </p>
                <div class="terminal-display">
                  <div class="terminal-line">
                    <span>Monto:</span>
                    <strong>Bs. {{ ventaData.total.toFixed(2) }}</strong>
                  </div>
                  <div class="terminal-line">
                    <span>Tipo:</span>
                    <strong>{{ metodoPago === 'debito' ? 'DÉBITO' : 'CRÉDITO' }}</strong>
                  </div>
                  <div class="terminal-status">
                    <i class="fas fa-check-circle text-success mr-2"></i>
                    Esperando tarjeta...
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="pago-footer">
          <button type="button" class="btn-cancelar" @click="handleClose">
            <i class="fas fa-times mr-2"></i>
            Cancelar
          </button>
          <button 
            type="button" 
            class="btn-confirmar" 
            @click="confirmarPago"
            :disabled="metodoPago === 'efectivo' && montoPagado < ventaData.total"
          >
            <i class="fas fa-check-circle mr-2"></i>
            Confirmar Pago
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ===== MODAL PRINCIPAL ===== */
.pago-modal {
  z-index: 1060;
}

.pago-modal .modal-dialog {
  max-width: 800px;
}

.pago-wrapper {
  border: none;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  animation: fadeIn 0.3s ease;
  overflow: hidden;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* ===== HEADER ===== */
.pago-header {
  background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
  color: #ffffff;
  padding: 1.5rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.pago-header .modal-title {
  color: #ffffff;
  font-weight: 700;
  font-size: 1.5rem;
  margin: 0;
}

.pago-header .modal-title i {
  color: #ffc107;
}

.pago-header .text-muted {
  color: rgba(255, 255, 255, 0.8) !important;
  font-size: 0.9rem;
}

.pago-header .close {
  color: #ffffff;
  opacity: 0.8;
  font-size: 2rem;
  padding: 0;
  margin: 0;
  background: transparent;
  border: none;
  cursor: pointer;
}

.pago-header .close:hover {
  opacity: 1;
}

/* ===== BODY ===== */
.pago-body {
  padding: 2rem;
  background: #f8f9fa;
  max-height: 70vh;
  overflow-y: auto;
}

/* ===== RESUMEN ===== */
.resumen-section {
  background: #ffffff;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.resumen-title {
  font-size: 1rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.resumen-title i {
  color: #6c757d;
}

.resumen-content {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1rem;
}

.resumen-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.resumen-row:last-child {
  margin-bottom: 0;
}

.resumen-label {
  font-size: 0.95rem;
  color: #6c757d;
  font-weight: 500;
}

.resumen-value {
  font-size: 0.95rem;
  color: #2c3e50;
  font-weight: 600;
}

.resumen-divider {
  height: 1px;
  background: #dee2e6;
  margin: 1rem 0;
}

.resumen-row.total-row {
  margin-top: 0.5rem;
  padding-top: 0.75rem;
  border-top: 2px solid #2c3e50;
}

.resumen-row.total-row .resumen-label {
  font-size: 1.1rem;
  color: #2c3e50;
  font-weight: 700;
}

.resumen-row.total-row .total-amount {
  font-size: 1.5rem;
  color: #28a745;
  font-weight: 700;
}

/* ===== MÉTODOS DE PAGO ===== */
.metodos-section {
  background: #ffffff;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.metodos-title {
  font-size: 1rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.metodos-title i {
  color: #6c757d;
}

.metodos-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}

.metodo-card {
  cursor: pointer;
  margin: 0;
  display: block;
}

.metodo-card input {
  display: none;
}

.metodo-content {
  background: #f8f9fa;
  border: 2px solid #e9ecef;
  border-radius: 10px;
  padding: 1.5rem 1rem;
  text-align: center;
  transition: all 0.3s ease;
}

.metodo-content i {
  font-size: 2rem;
  color: #6c757d;
  display: block;
  margin-bottom: 0.5rem;
}

.metodo-content span {
  font-size: 0.85rem;
  font-weight: 600;
  color: #495057;
  display: block;
}

.metodo-card.active .metodo-content {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  border-color: #28a745;
  transform: translateY(-4px);
  box-shadow: 0 6px 16px rgba(40, 167, 69, 0.3);
}

.metodo-card.active .metodo-content i,
.metodo-card.active .metodo-content span {
  color: #ffffff;
}

.metodo-card:hover .metodo-content {
  border-color: #6c757d;
  transform: translateY(-2px);
}

/* ===== SIMULACIÓN ===== */
.simulacion-section {
  background: #ffffff;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  min-height: 250px;
}

.simulacion-subtitle {
  font-size: 1rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid #e9ecef;
}

/* Efectivo */
.pago-efectivo {
  text-align: center;
}

.efectivo-field {
  margin-bottom: 1.5rem;
}

.efectivo-label {
  display: block;
  font-size: 0.9rem;
  font-weight: 600;
  color: #6c757d;
  margin-bottom: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.efectivo-input {
  width: 100%;
  max-width: 300px;
  padding: 1rem 1.5rem;
  border: 2px solid #e9ecef;
  border-radius: 10px;
  font-size: 1.5rem;
  font-weight: 700;
  color: #2c3e50;
  text-align: center;
  transition: all 0.3s ease;
}

.efectivo-input:focus {
  outline: none;
  border-color: #28a745;
  box-shadow: 0 0 0 4px rgba(40, 167, 69, 0.1);
}

.cambio-display {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  color: #ffffff;
  padding: 1rem 1.5rem;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);
}

.cambio-label {
  font-size: 1rem;
  font-weight: 600;
}

.cambio-value {
  font-size: 1.5rem;
  font-weight: 700;
}

/* QR */
.pago-qr {
  text-align: center;
}

.qr-container {
  padding: 1rem;
}

.qr-code {
  width: 200px;
  height: 200px;
  margin: 0 auto 1rem;
  background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

.qr-code i {
  font-size: 8rem;
  color: #ffffff;
}

.qr-instructions {
  font-size: 1rem;
  color: #6c757d;
  margin-bottom: 1rem;
}

.qr-info {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1rem;
  display: inline-block;
  text-align: left;
}

.qr-info p {
  margin: 0.5rem 0;
  font-size: 0.95rem;
  color: #495057;
}

/* Tarjeta */
.pago-tarjeta {
  text-align: center;
}

.tarjeta-simulator {
  padding: 1rem;
}

.terminal-icon {
  width: 120px;
  height: 120px;
  margin: 0 auto 1rem;
  background: linear-gradient(135deg, #6c757d 0%, #495057 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

.terminal-icon i {
  font-size: 4rem;
  color: #ffffff;
}

.terminal-instructions {
  font-size: 1rem;
  color: #6c757d;
  margin-bottom: 1.5rem;
}

.terminal-display {
  background: #2c3e50;
  color: #ffffff;
  border-radius: 10px;
  padding: 1.5rem;
  max-width: 400px;
  margin: 0 auto;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.terminal-line {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.terminal-line span {
  color: rgba(255, 255, 255, 0.8);
}

.terminal-line strong {
  color: #ffffff;
  font-weight: 700;
}

.terminal-status {
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.9);
}

/* ===== FOOTER ===== */
.pago-footer {
  background: #f8f9fa;
  border-top: 1px solid #e9ecef;
  padding: 1.25rem 2rem;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.btn-cancelar,
.btn-confirmar {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
}

.btn-cancelar {
  background: #ffffff;
  color: #6c757d;
  border: 1px solid #dee2e6;
}

.btn-cancelar:hover {
  background: #f8f9fa;
  border-color: #adb5bd;
}

.btn-confirmar {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);
}

.btn-confirmar:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(40, 167, 69, 0.4);
}

.btn-confirmar:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* ===== RESPONSIVE ===== */
@media (max-width: 768px) {
  .metodos-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .pago-body {
    padding: 1rem;
  }
  
  .pago-footer {
    flex-direction: column;
  }
  
  .btn-cancelar,
  .btn-confirmar {
    width: 100%;
  }
}
</style>
