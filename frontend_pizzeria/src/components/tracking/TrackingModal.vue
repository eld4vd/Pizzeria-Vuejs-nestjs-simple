<script setup lang="ts">
import { ref, computed } from 'vue'
import { useToast } from 'vue-toastification'
import axios from '@/plugins/axios'

interface Pedido {
  id: number
  numeroVenta: string
  estado: string
  total: number
  fechaVenta: string
  clienteNombre: string
  clienteNotas: string
  detalles: Array<{
    nombreProducto: string
    cantidad: number
    precioUnitario: number
    subtotal: number
  }>
}

interface Props {
  show: boolean
  pedidos: Pedido[]
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
  'pedido-cancelado': []
}>()

const toast = useToast()
const cancelando = ref<number | null>(null)
const pedidoSeleccionado = ref<Pedido | null>(null)

// Pedido activo (el más reciente no cancelado/entregado)
const pedidoActivo = computed(() => {
  return props.pedidos.find(p => 
    p.estado !== 'cancelada' && p.estado !== 'entregada'
  ) || props.pedidos[0]
})

// Formato de precio
const formatPrice = (price: number) => {
  return `Bs. ${Number(price).toFixed(2)}`
}

// Formato de fecha
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleString('es-BO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Estado del timeline (visual)
const getEstadoStep = (estado: string) => {
  switch (estado) {
    case 'pendiente': return 0
    case 'confirmada': return 1
    case 'preparando': return 2
    case 'lista': return 3
    case 'entregada': return 4
    case 'cancelada': return -1
    default: return 0
  }
}

// Color del estado
const getEstadoColor = (estado: string) => {
  switch (estado) {
    case 'pendiente': return '#ffc107'
    case 'confirmada': return '#28a745'
    case 'preparando': return '#17a2b8'
    case 'lista': return '#6f42c1'
    case 'entregada': return '#28a745'
    case 'cancelada': return '#dc3545'
    default: return '#6c757d'
  }
}

// Texto del estado
const getEstadoTexto = (estado: string) => {
  switch (estado) {
    case 'pendiente': return 'Pendiente'
    case 'confirmada': return 'Confirmado'
    case 'preparando': return 'En Preparación'
    case 'lista': return 'Listo para Entrega'
    case 'entregada': return 'Entregado'
    case 'cancelada': return 'Cancelado'
    default: return estado
  }
}

// Progreso en porcentaje para barra animada
const getProgressWidth = (estado: string) => {
  switch (estado) {
    case 'pendiente': return '0%'
    case 'confirmada': return '25%'
    case 'preparando': return '50%'
    case 'lista': return '75%'
    case 'entregada': return '100%'
    default: return '0%'
  }
}

// Puede cancelar (solo pendiente o confirmada)
const puedeCancelar = (pedido: Pedido) => {
  return ['pendiente', 'confirmada'].includes(pedido.estado)
}

// Cancelar pedido
const cancelarPedido = async (pedido: Pedido) => {
  if (!confirm(`¿Estás seguro de cancelar el pedido #${pedido.numeroVenta}?\n\nEsta acción no se puede deshacer.`)) {
    return
  }

  try {
    cancelando.value = pedido.id
    await axios.patch(`/ventas/${pedido.id}/cancelar`)
    
    toast.success('Pedido cancelado exitosamente')
    emit('pedido-cancelado')
  } catch (error: any) {
    const message = error.response?.data?.message || 'Error al cancelar el pedido'
    toast.error(message)
  } finally {
    cancelando.value = null
  }
}

// Ver detalle de pedido
const verDetalle = (pedido: Pedido) => {
  pedidoSeleccionado.value = pedidoSeleccionado.value?.id === pedido.id ? null : pedido
}

const handleClose = () => {
  pedidoSeleccionado.value = null
  emit('close')
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div 
        v-if="show" 
        class="modal-overlay"
        @click.self="handleClose"
      >
        <div class="tracking-modal">
          <!-- Header -->
          <div class="modal-header">
            <h3>
              <i class="fas fa-map-marker-alt mr-2"></i>
              Seguimiento de Pedido
            </h3>
            <button class="close-btn" @click="handleClose">
              <i class="fas fa-times"></i>
            </button>
          </div>

          <!-- Body -->
          <div class="modal-body">
            <!-- Sin pedidos -->
            <div v-if="pedidos.length === 0" class="empty-state">
              <i class="fas fa-box-open"></i>
              <h4>No tienes pedidos</h4>
              <p>Cuando hagas un pedido, podrás ver su estado aquí</p>
            </div>

            <!-- Lista de pedidos -->
            <div v-else class="pedidos-list">
              <div 
                v-for="pedido in pedidos" 
                :key="pedido.id"
                class="pedido-card"
                :class="{ 
                  'cancelado': pedido.estado === 'cancelada',
                  'entregado': pedido.estado === 'entregada',
                  'activo': pedido.estado !== 'cancelada' && pedido.estado !== 'entregada'
                }"
              >
                <!-- Header del pedido -->
                <div class="pedido-header" @click="verDetalle(pedido)">
                  <div class="pedido-info">
                    <span class="pedido-numero">#{{ pedido.numeroVenta }}</span>
                    <span 
                      class="pedido-estado"
                      :style="{ backgroundColor: getEstadoColor(pedido.estado) }"
                    >
                      {{ getEstadoTexto(pedido.estado) }}
                    </span>
                  </div>
                  <div class="pedido-meta">
                    <span class="pedido-fecha">
                      <i class="fas fa-clock mr-1"></i>
                      {{ formatDate(pedido.fechaVenta) }}
                    </span>
                    <span class="pedido-total">{{ formatPrice(pedido.total) }}</span>
                  </div>
                  <i 
                    class="fas chevron-icon"
                    :class="pedidoSeleccionado?.id === pedido.id ? 'fa-chevron-up' : 'fa-chevron-down'"
                  ></i>
                </div>

                <!-- Timeline visual (solo para pedidos activos) -->
                <div 
                  v-if="pedido.estado !== 'cancelada' && pedido.estado !== 'entregada'"
                  class="timeline-container"
                >
                  <!-- Indicador de simulación -->
                  <div class="simulacion-badge">
                    <i class="fas fa-magic mr-1"></i>
                    Demo: Avance automático cada 10s
                  </div>

                  <div class="timeline">
                    <div 
                      class="timeline-step"
                      :class="{ 'completed': getEstadoStep(pedido.estado) >= 1, 'active': getEstadoStep(pedido.estado) === 1 }"
                    >
                      <div class="step-icon">
                        <i class="fas fa-check-circle"></i>
                      </div>
                      <span class="step-label">Confirmado</span>
                    </div>
                    <div class="timeline-line" :class="{ 'completed': getEstadoStep(pedido.estado) >= 2 }"></div>
                    <div 
                      class="timeline-step"
                      :class="{ 'completed': getEstadoStep(pedido.estado) >= 2, 'active': getEstadoStep(pedido.estado) === 2 }"
                    >
                      <div class="step-icon">
                        <i class="fas fa-fire"></i>
                      </div>
                      <span class="step-label">Preparando</span>
                    </div>
                    <div class="timeline-line" :class="{ 'completed': getEstadoStep(pedido.estado) >= 3 }"></div>
                    <div 
                      class="timeline-step"
                      :class="{ 'completed': getEstadoStep(pedido.estado) >= 3, 'active': getEstadoStep(pedido.estado) === 3 }"
                    >
                      <div class="step-icon">
                        <i class="fas fa-motorcycle"></i>
                      </div>
                      <span class="step-label">En Camino</span>
                    </div>
                    <div class="timeline-line" :class="{ 'completed': getEstadoStep(pedido.estado) >= 4 }"></div>
                    <div 
                      class="timeline-step"
                      :class="{ 'completed': getEstadoStep(pedido.estado) >= 4 }"
                    >
                      <div class="step-icon">
                        <i class="fas fa-home"></i>
                      </div>
                      <span class="step-label">Entregado</span>
                    </div>
                  </div>

                  <!-- Barra de progreso animada -->
                  <div class="progress-bar-container">
                    <div class="progress-bar-fill" :style="{ width: getProgressWidth(pedido.estado) }"></div>
                  </div>

                  <!-- Tiempo estimado -->
                  <div class="tiempo-estimado">
                    <i class="fas fa-clock mr-2"></i>
                    <span>Estado actual: <strong>{{ getEstadoTexto(pedido.estado) }}</strong></span>
                  </div>
                </div>

                <!-- Detalle expandido -->
                <Transition name="expand">
                  <div v-if="pedidoSeleccionado?.id === pedido.id" class="pedido-detalle">
                    <!-- Dirección -->
                    <div v-if="pedido.clienteNotas" class="detalle-direccion">
                      <i class="fas fa-map-marker-alt mr-2"></i>
                      <span>{{ pedido.clienteNotas }}</span>
                    </div>

                    <!-- Productos -->
                    <div class="detalle-productos">
                      <h5>Productos:</h5>
                      <div 
                        v-for="(detalle, idx) in pedido.detalles" 
                        :key="idx"
                        class="producto-item"
                      >
                        <span class="producto-cantidad">{{ detalle.cantidad }}x</span>
                        <span class="producto-nombre">{{ detalle.nombreProducto }}</span>
                        <span class="producto-precio">{{ formatPrice(detalle.subtotal) }}</span>
                      </div>
                    </div>

                    <!-- Botón cancelar -->
                    <div v-if="puedeCancelar(pedido)" class="detalle-acciones">
                      <button 
                        class="btn-cancelar"
                        @click.stop="cancelarPedido(pedido)"
                        :disabled="cancelando === pedido.id"
                      >
                        <span v-if="cancelando === pedido.id">
                          <i class="fas fa-spinner fa-spin mr-1"></i>
                          Cancelando...
                        </span>
                        <span v-else>
                          <i class="fas fa-times-circle mr-1"></i>
                          Cancelar Pedido
                        </span>
                      </button>
                      <small class="cancel-warning">
                        Solo puedes cancelar mientras el pedido no esté en preparación
                      </small>
                    </div>

                    <!-- Mensaje si ya no puede cancelar -->
                    <div v-else-if="pedido.estado === 'cancelada'" class="estado-mensaje cancelado">
                      <i class="fas fa-ban mr-2"></i>
                      Este pedido fue cancelado
                    </div>
                    <div v-else-if="pedido.estado === 'entregada'" class="estado-mensaje entregado">
                      <i class="fas fa-check-circle mr-2"></i>
                      ¡Pedido entregado! Gracias por tu preferencia
                    </div>
                    <div v-else class="estado-mensaje preparando">
                      <i class="fas fa-info-circle mr-2"></i>
                      Tu pedido ya está en preparación y no puede ser cancelado
                    </div>
                  </div>
                </Transition>
              </div>
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

.tracking-modal {
  background: white;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  border-radius: 16px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Header */
.modal-header {
  padding: 20px 25px;
  background: linear-gradient(135deg, #28a745, #20c997);
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
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
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: rotate(90deg);
}

/* Body */
.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #6c757d;
}

.empty-state i {
  font-size: 60px;
  margin-bottom: 20px;
  color: #dee2e6;
}

.empty-state h4 {
  margin: 0 0 10px 0;
  color: #495057;
}

.empty-state p {
  margin: 0;
  font-size: 14px;
}

/* Pedidos List */
.pedidos-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.pedido-card {
  background: #f8f9fa;
  border-radius: 12px;
  overflow: hidden;
  border: 2px solid #e9ecef;
  transition: all 0.3s ease;
}

.pedido-card.activo {
  border-color: #28a745;
  background: linear-gradient(135deg, #f0fff4, #e8f5e9);
}

.pedido-card.cancelado {
  border-color: #dc3545;
  background: linear-gradient(135deg, #fff5f5, #ffe6e6);
  opacity: 0.8;
}

.pedido-card.entregado {
  border-color: #6c757d;
  opacity: 0.7;
}

/* Pedido Header */
.pedido-header {
  padding: 15px;
  cursor: pointer;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  position: relative;
}

.pedido-info {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
}

.pedido-numero {
  font-weight: 700;
  font-size: 16px;
  color: #2c3e50;
}

.pedido-estado {
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  color: white;
  text-transform: uppercase;
}

.pedido-meta {
  display: flex;
  align-items: center;
  gap: 15px;
}

.pedido-fecha {
  font-size: 12px;
  color: #6c757d;
}

.pedido-total {
  font-weight: 700;
  color: #2c3e50;
  font-size: 16px;
}

.chevron-icon {
  color: #6c757d;
  font-size: 14px;
  margin-left: 10px;
}

/* Timeline */
.timeline-container {
  padding: 15px;
  background: white;
  border-top: 1px solid #e9ecef;
}

.timeline {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 10px 0;
}

.timeline-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  flex: 0 0 auto;
}

.step-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #e9ecef;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  color: #adb5bd;
  transition: all 0.3s ease;
}

.timeline-step.completed .step-icon {
  background: #28a745;
  color: white;
}

.timeline-step.active .step-icon {
  background: #ffc107;
  color: white;
  animation: pulse-step 1.5s infinite;
}

@keyframes pulse-step {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(255, 193, 7, 0.4);
  }
  50% {
    box-shadow: 0 0 0 10px rgba(255, 193, 7, 0);
  }
}

.step-label {
  font-size: 10px;
  font-weight: 600;
  color: #6c757d;
  text-align: center;
  max-width: 60px;
}

.timeline-step.completed .step-label,
.timeline-step.active .step-label {
  color: #2c3e50;
}

.timeline-line {
  flex: 1;
  height: 3px;
  background: #e9ecef;
  margin-top: 18px;
  min-width: 20px;
}

.timeline-line.completed {
  background: #28a745;
}

.tiempo-estimado {
  text-align: center;
  padding: 12px;
  background: #fff3cd;
  border-radius: 8px;
  font-size: 13px;
  color: #856404;
  margin-top: 10px;
}

/* Simulación badge */
.simulacion-badge {
  text-align: center;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
  margin-bottom: 15px;
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

/* Barra de progreso */
.progress-bar-container {
  height: 6px;
  background: #e9ecef;
  border-radius: 3px;
  margin: 15px 0;
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #28a745, #20c997);
  border-radius: 3px;
  transition: width 0.5s ease;
  animation: progress-glow 1.5s infinite;
}

@keyframes progress-glow {
  0%, 100% { box-shadow: 0 0 5px rgba(40, 167, 69, 0.5); }
  50% { box-shadow: 0 0 15px rgba(40, 167, 69, 0.8); }
}

/* Detalle */
.pedido-detalle {
  padding: 15px;
  background: white;
  border-top: 1px solid #e9ecef;
}

.detalle-direccion {
  padding: 10px 15px;
  background: #e7f3ff;
  border-radius: 8px;
  font-size: 13px;
  color: #004085;
  margin-bottom: 15px;
}

.detalle-productos h5 {
  margin: 0 0 10px 0;
  font-size: 14px;
  color: #495057;
}

.producto-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 0;
  border-bottom: 1px solid #e9ecef;
}

.producto-item:last-child {
  border-bottom: none;
}

.producto-cantidad {
  font-weight: 700;
  color: #fca100;
  min-width: 30px;
}

.producto-nombre {
  flex: 1;
  color: #2c3e50;
  font-size: 14px;
}

.producto-precio {
  font-weight: 600;
  color: #495057;
}

/* Acciones */
.detalle-acciones {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #e9ecef;
  text-align: center;
}

.btn-cancelar {
  background: #dc3545;
  color: white;
  border: none;
  padding: 10px 25px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-cancelar:hover:not(:disabled) {
  background: #c82333;
  transform: translateY(-2px);
}

.btn-cancelar:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.cancel-warning {
  display: block;
  margin-top: 8px;
  color: #6c757d;
  font-size: 11px;
}

/* Estado mensaje */
.estado-mensaje {
  margin-top: 15px;
  padding: 12px 15px;
  border-radius: 8px;
  font-size: 13px;
  text-align: center;
}

.estado-mensaje.cancelado {
  background: #ffe6e6;
  color: #721c24;
}

.estado-mensaje.entregado {
  background: #d4edda;
  color: #155724;
}

.estado-mensaje.preparando {
  background: #fff3cd;
  color: #856404;
}

/* Transitions */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  max-height: 0;
  padding-top: 0;
  padding-bottom: 0;
}

/* Scrollbar */
.modal-body::-webkit-scrollbar {
  width: 6px;
}

.modal-body::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.modal-body::-webkit-scrollbar-thumb {
  background: #28a745;
  border-radius: 3px;
}

/* Responsive */
@media (max-width: 576px) {
  .tracking-modal {
    max-height: 100vh;
    border-radius: 0;
  }

  .timeline {
    flex-wrap: nowrap;
    overflow-x: auto;
    padding-bottom: 15px;
  }

  .step-label {
    font-size: 9px;
    max-width: 50px;
  }

  .step-icon {
    width: 35px;
    height: 35px;
    font-size: 14px;
  }

  .pedido-meta {
    width: 100%;
    justify-content: space-between;
  }
}
</style>
