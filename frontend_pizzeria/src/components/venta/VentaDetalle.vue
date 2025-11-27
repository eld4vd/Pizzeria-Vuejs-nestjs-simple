<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import axios from '@/plugins/axios'
import type { Venta, DetalleVenta } from '@/models/venta'

interface Props {
  venta: Venta | null
  show: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
}>()

const detalles = ref<DetalleVenta[]>([])
const loading = ref(false)

watch(() => props.show, async (newVal) => {
  console.log('👁️ VentaDetalle - watch show cambió:', newVal)
  console.log('📦 Venta prop:', props.venta?.numeroVenta)
  if (newVal && props.venta) {
    console.log('✅ Cargando detalles...')
    await cargarDetalles()
  }
})

const cargarDetalles = async () => {
  if (!props.venta) return

  try {
    loading.value = true
    // Obtener venta completa con detalles
    const response = await axios.get(`/ventas/${props.venta.id}`)
    detalles.value = response.data.detalles || []
  } catch (error) {
    console.error('Error al cargar detalles:', error)
    alert('Error al cargar los detalles de la venta')
  } finally {
    loading.value = false
  }
}

const formatFecha = (fecha: string) => {
  const date = new Date(fecha)
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getEstadoBadge = (estado: string) => {
  const badges: Record<string, { label: string, class: string }> = {
    pendiente: { label: 'Pendiente', class: 'warning' },
    confirmada: { label: 'Confirmada', class: 'info' },
    preparando: { label: 'Preparando', class: 'primary' },
    lista: { label: 'Lista', class: 'success' },
    entregada: { label: 'Entregada', class: 'secondary' },
    cancelada: { label: 'Cancelada', class: 'danger' }
  }
  return badges[estado] || { label: estado, class: 'secondary' }
}

const handleClose = () => {
  detalles.value = []
  emit('close')
}

const imprimirTicket = () => {
  window.print()
}
</script>

<template>
  <Teleport to="body">
    <div 
      v-if="show && venta" 
      class="modal fade show venta-detalle-modal" 
      style="display: block; background: rgba(0,0,0,0.6); position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 9999; overflow-y: auto;"
      @click.self="handleClose"
    >
      <div class="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable" style="max-width: 90vw; margin: 2rem auto;">
        <div class="modal-content">
        <div class="modal-header bg-gradient-info text-white">
          <h5 class="modal-title">
            <i class="fas fa-receipt mr-2"></i>
            Detalles de Venta - {{ venta.numeroVenta }}
          </h5>
          <button type="button" class="close text-white" @click="handleClose">
            <span>&times;</span>
          </button>
        </div>

        <div class="modal-body">
          <!-- Información de la venta -->
          <div class="row mb-4">
            <div class="col-md-6">
              <div class="card border-left-primary shadow-sm h-100">
                <div class="card-body">
                  <h6 class="text-primary mb-3">
                    <i class="fas fa-user mr-2"></i>Información del Cliente
                  </h6>
                  <p class="mb-1"><strong>Nombre:</strong> {{ venta.clienteNombre }}</p>
                  <p class="mb-1"><strong>Teléfono:</strong> {{ venta.clienteTelefono }}</p>
                  <p class="mb-1" v-if="venta.clienteEmail">
                    <strong>Email:</strong> {{ venta.clienteEmail }}
                  </p>
                  <p class="mb-0" v-if="venta.clienteNotas">
                    <strong>Notas:</strong> <br>
                    <small class="text-muted">{{ venta.clienteNotas }}</small>
                  </p>
                </div>
              </div>
            </div>

            <div class="col-md-6">
              <div class="card border-left-success shadow-sm h-100">
                <div class="card-body">
                  <h6 class="text-success mb-3">
                    <i class="fas fa-info-circle mr-2"></i>Información de la Venta
                  </h6>
                  <p class="mb-1">
                    <strong>Tipo:</strong> 
                    <span class="badge" :class="venta.tipoVenta === 'online' ? 'badge-info' : 'badge-dark'">
                      {{ venta.tipoVenta === 'online' ? 'Online' : 'Presencial' }}
                    </span>
                  </p>
                  <p class="mb-1">
                    <strong>Método de Pago:</strong> 
                    <span class="badge badge-secondary">{{ venta.metodoPago.toUpperCase() }}</span>
                  </p>
                  <p class="mb-1">
                    <strong>Estado:</strong> 
                    <span :class="`badge badge-${getEstadoBadge(venta.estado).class}`">
                      {{ getEstadoBadge(venta.estado).label }}
                    </span>
                  </p>
                  <p class="mb-1">
                    <strong>Fecha:</strong> {{ formatFecha(venta.fechaVenta) }}
                  </p>
                  <p class="mb-0" v-if="venta.empleado">
                    <strong>Atendido por:</strong> {{ venta.empleado.nombre }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Detalles de productos -->
          <div class="card shadow-sm">
            <div class="card-header bg-light">
              <h6 class="mb-0">
                <i class="fas fa-list mr-2"></i>Productos del Pedido
              </h6>
            </div>
            <div class="card-body p-0">
              <div v-if="loading" class="text-center py-4">
                <div class="spinner-border text-info" role="status">
                  <span class="sr-only">Cargando...</span>
                </div>
              </div>

              <div v-else-if="detalles.length === 0" class="text-center py-4">
                <i class="fas fa-box-open fa-2x text-muted mb-2"></i>
                <p class="text-muted mb-0">No hay productos en esta venta</p>
              </div>

              <table v-else class="table table-hover mb-0">
                <thead>
                  <tr>
                    <th width="10%">#</th>
                    <th width="40%">Producto</th>
                    <th width="15%" class="text-center">Cantidad</th>
                    <th width="15%" class="text-right">Precio Unit.</th>
                    <th width="20%" class="text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(detalle, index) in detalles" :key="detalle.id">
                    <td>{{ index + 1 }}</td>
                    <td>
                      <strong>{{ detalle.nombreProducto }}</strong>
                      <br>
                      <small v-if="detalle.notas" class="text-muted">
                        <i class="fas fa-sticky-note mr-1"></i>{{ detalle.notas }}
                      </small>
                    </td>
                    <td class="text-center">
                      <span class="badge badge-primary">{{ detalle.cantidad }}</span>
                    </td>
                    <td class="text-right">
                      Bs. {{ detalle.precioUnitario.toFixed(2) }}
                    </td>
                    <td class="text-right">
                      <strong>Bs. {{ detalle.subtotal.toFixed(2) }}</strong>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Totales -->
          <div class="row mt-4">
            <div class="col-md-6 offset-md-6">
              <div class="card shadow-sm">
                <div class="card-body">
                  <div class="d-flex justify-content-between mb-2">
                    <span>Subtotal:</span>
                    <strong>Bs. {{ venta.subtotal.toFixed(2) }}</strong>
                  </div>
                  <div class="d-flex justify-content-between mb-2" v-if="venta.descuento > 0">
                    <span>Descuento:</span>
                    <strong class="text-danger">- Bs. {{ venta.descuento.toFixed(2) }}</strong>
                  </div>
                  <hr>
                  <div class="d-flex justify-content-between">
                    <h5 class="mb-0">Total:</h5>
                    <h5 class="mb-0 text-success">Bs. {{ venta.total.toFixed(2) }}</h5>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Notas internas -->
          <div v-if="venta.notasInternas" class="alert alert-warning mt-3">
            <strong><i class="fas fa-exclamation-triangle mr-2"></i>Notas Internas:</strong>
            <p class="mb-0 mt-2">{{ venta.notasInternas }}</p>
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="handleClose">
            <i class="fas fa-times mr-1"></i> Cerrar
          </button>
          <button type="button" class="btn btn-info" @click="imprimirTicket">
            <i class="fas fa-print mr-1"></i> Imprimir Ticket
          </button>
        </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.venta-detalle-modal {
  display: flex !important;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.bg-gradient-info {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.border-left-primary {
  border-left: 4px solid #4e73df;
}

.border-left-success {
  border-left: 4px solid #1cc88a;
}

.modal.show {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-content {
  animation: slideUp 0.3s ease;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-body {
  overflow-y: auto;
  flex: 1;
}

@keyframes slideUp {
  from {
    transform: translateY(50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@media print {
  .modal-header,
  .modal-footer {
    display: none;
  }
}
</style>
