<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import type { CSSProperties } from 'vue'
import axios from '@/plugins/axios'
import type { Venta } from '@/models/venta'

const emit = defineEmits<{
  (e: 'viewDetails', venta: Venta): void
}>()

const ventas = ref<Venta[]>([])
const loading = ref(false)
const searchTerm = ref('')
const estadoFiltro = ref<string | null>(null)
const tipoFiltro = ref<string | null>(null)
const lastUpdate = ref<Date>(new Date())
const refreshing = ref(false)
const expandedVentaId = ref<number | null>(null)
const ventaExpandida = ref<Venta | null>(null)
const detallesVenta = ref<any[]>([])
const loadingDetalles = ref(false)

const estados = [
  { value: 'pendiente', label: 'Pendiente', class: 'warning' },
  { value: 'confirmada', label: 'Confirmada', class: 'info' },
  { value: 'preparando', label: 'Preparando', class: 'primary' },
  { value: 'lista', label: 'Lista', class: 'success' },
  { value: 'entregada', label: 'Entregada', class: 'secondary' },
  { value: 'cancelada', label: 'Cancelada', class: 'danger' }
]

const obtenerLista = async (silent: boolean = false) => {
  try {
    if (silent) {
      refreshing.value = true
    } else {
      loading.value = true
    }
    
    const response = await axios.get('/ventas')
    // Ordenar por ID descendente (los más recientes primero)
    ventas.value = response.data.sort((a: Venta, b: Venta) => b.id - a.id)
    lastUpdate.value = new Date()
    
    if (silent) {
      // Mostrar indicador sutil de actualización
      setTimeout(() => {
        refreshing.value = false
      }, 1000)
    }
  } catch (error) {
    console.error('Error al obtener ventas:', error)
    if (!silent) {
      alert('Error al cargar la lista de ventas')
    }
  } finally {
    loading.value = false
  }
}

const filteredVentas = computed(() => {
  let result = ventas.value

  // Filtrar por estado
  if (estadoFiltro.value) {
    result = result.filter(v => v.estado === estadoFiltro.value)
  }

  // Filtrar por tipo
  if (tipoFiltro.value) {
    result = result.filter(v => v.tipoVenta === tipoFiltro.value)
  }

  // Filtrar por búsqueda
  if (searchTerm.value) {
    const term = searchTerm.value.toLowerCase()
    result = result.filter(v => 
      v.numeroVenta.toLowerCase().includes(term) ||
      v.clienteNombre.toLowerCase().includes(term) ||
      v.clienteTelefono.includes(term)
    )
  }

  return result.sort((a, b) => 
    new Date(b.fechaVenta).getTime() - new Date(a.fechaVenta).getTime()
  )
})

const getEstadoBadge = (estado: string) => {
  const estadoObj = estados.find(e => e.value === estado)
  return estadoObj || { label: estado, class: 'secondary' }
}

const tipoBadgeStyle = (tipo: string): CSSProperties => {
  if (tipo === 'online') {
    return {
      background: '#0dcaf0',
      color: '#000000',
      border: '1px solid #0aa2c0',
      boxShadow: '0 1px 3px rgba(13, 202, 240, 0.3)'
    }
  }

  return {
    background: '#0d6efd',
    color: '#ffffff',
    border: '1px solid #0a58ca',
    boxShadow: '0 1px 3px rgba(13, 110, 253, 0.3)'
  }
}

const defaultMetodoBadgeStyle: CSSProperties = {
  background: '#6c757d',
  color: '#ffffff',
  border: '1px solid #565e64',
  boxShadow: '0 1px 3px rgba(108, 117, 125, 0.3)'
}

const metodoBadgeStyle = (metodo: string): CSSProperties => {
  const normalized = (metodo || '').toLowerCase()
  const styles: Record<string, CSSProperties> = {
    efectivo: {
      background: '#198754',
      color: '#ffffff',
      border: '1px solid #146c43',
      boxShadow: '0 1px 3px rgba(25, 135, 84, 0.3)'
    },
    qr: {
      background: '#6f42c1',
      color: '#ffffff',
      border: '1px solid #59359a',
      boxShadow: '0 1px 3px rgba(111, 66, 193, 0.3)'
    },
    debito: {
      background: '#20c997',
      color: '#ffffff',
      border: '1px solid #17a589',
      boxShadow: '0 1px 3px rgba(32, 201, 151, 0.3)'
    },
    tarjeta: {
      background: '#fd7e14',
      color: '#ffffff',
      border: '1px solid #e56705',
      boxShadow: '0 1px 3px rgba(253, 126, 20, 0.3)'
    }
  }

  return styles[normalized] ?? defaultMetodoBadgeStyle
}

const formatFecha = (fecha: string) => {
  const date = new Date(fecha)
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatTiempoDesde = (fecha: Date) => {
  const segundos = Math.floor((new Date().getTime() - fecha.getTime()) / 1000)
  if (segundos < 60) return 'Hace unos segundos'
  const minutos = Math.floor(segundos / 60)
  if (minutos < 60) return `Hace ${minutos} min`
  const horas = Math.floor(minutos / 60)
  return `Hace ${horas}h ${minutos % 60}min`
}

const toggleDetalles = async (venta: Venta) => {
  // Si ya está expandida esta venta, la colapsamos
  if (expandedVentaId.value === venta.id) {
    expandedVentaId.value = null
    ventaExpandida.value = null
    detallesVenta.value = []
    return
  }

  // Expandir nueva venta
  expandedVentaId.value = venta.id
  ventaExpandida.value = venta
  
  try {
    loadingDetalles.value = true
    const response = await axios.get(`/ventas/${venta.id}`)
    detallesVenta.value = response.data.detalles || []
  } catch (error) {
    console.error('Error al cargar detalles:', error)
    detallesVenta.value = []
  } finally {
    loadingDetalles.value = false
  }
}

// Auto-refresh cada 30 segundos
let refreshInterval: number | null = null

const iniciarAutoRefresh = () => {
  // Refresh cada 30 segundos (silencioso)
  refreshInterval = window.setInterval(() => {
    obtenerLista(true)
  }, 30000)
}

const detenerAutoRefresh = () => {
  if (refreshInterval) {
    window.clearInterval(refreshInterval)
    refreshInterval = null
  }
}

const cambiarEstado = async (id: number, nuevoEstado: string) => {
  try {
    await axios.patch(`/ventas/${id}`, { estado: nuevoEstado })
    alert('Estado actualizado exitosamente')
    obtenerLista()
  } catch (error) {
    console.error('Error al cambiar estado:', error)
    alert('Error al cambiar el estado de la venta')
  }
}

onMounted(() => {
  obtenerLista()
  iniciarAutoRefresh()
})

onUnmounted(() => {
  detenerAutoRefresh()
})

defineExpose({ obtenerLista })
</script>

<template>
  <div class="crud-card">
    <div class="crud-header">
      <div class="row align-items-center">
        <div class="col-md-3">
          <h5 class="crud-title" style="color: #2c3e50;">
            <i class="fas fa-shopping-cart"></i>
            Lista de Ventas
            <span v-if="refreshing" class="refresh-indicator">
              <i class="fas fa-sync-alt fa-spin"></i>
            </span>
          </h5>
          <small style="font-size: 0.75rem; display: block; margin-top: 0.25rem; color: #6c757d; font-weight: 500;">
            <i class="far fa-clock"></i> {{ formatTiempoDesde(lastUpdate) }}
          </small>
        </div>
        <div class="col-md-3">
          <select 
            class="crud-filter-select form-control" 
            v-model="tipoFiltro"
            style="background-color: #ffffff !important; color: #2c3e50 !important; border: 2px solid #dee2e6 !important;"
          >
            <option :value="null" style="color: #2c3e50;">📋 Todos los tipos</option>
            <option value="online" style="color: #2c3e50;">🌐 Online</option>
            <option value="presencial" style="color: #2c3e50;">🏪 Presencial</option>
          </select>
        </div>
        <div class="col-md-3">
          <select 
            class="crud-filter-select form-control" 
            v-model="estadoFiltro"
            style="background-color: #ffffff !important; color: #2c3e50 !important; border: 2px solid #dee2e6 !important;"
          >
            <option :value="null" style="color: #2c3e50;">📊 Todos los estados</option>
            <option v-for="estado in estados" :key="estado.value" :value="estado.value" style="color: #2c3e50;">
              {{ estado.label }}
            </option>
          </select>
        </div>
        <div class="col-md-3">
          <input
            type="text"
            class="crud-search-input form-control"
            placeholder="🔍 Buscar venta..."
            v-model="searchTerm"
            style="background-color: #ffffff !important; color: #2c3e50 !important; border: 2px solid #dee2e6 !important;"
          />
        </div>
      </div>
    </div>

    <div class="crud-body">
      <div v-if="loading" class="crud-loading">
        <div class="spinner-border crud-spinner" role="status">
          <span class="sr-only">Cargando...</span>
        </div>
        <p class="mt-2 text-muted">Cargando ventas...</p>
      </div>

      <div v-else-if="filteredVentas.length === 0" class="crud-empty">
        <i class="fas fa-inbox crud-empty-icon"></i>
        <p class="crud-empty-text">No hay ventas registradas</p>
      </div>

      <div v-else class="table-responsive">
        <table class="crud-table crud-table-compact table">
          <thead>
            <tr>
              <th width="4%">#</th>
              <th width="12%">Nº Venta</th>
              <th width="18%">Cliente</th>
              <th width="16%">Tipo / Pago</th>
              <th width="10%">Total</th>
              <th width="13%">Fecha</th>
              <th width="17%">Estado</th>
              <th width="10%" class="text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(venta, index) in filteredVentas" :key="venta.id">
            <tr>
              <td><strong>{{ index + 1 }}</strong></td>
              <td>
                <strong style="color: #0056b3;">{{ venta.numeroVenta }}</strong>
              </td>
              <td>
                <div style="line-height: 1.4;">
                  <div style="font-weight: 600; color: #2c3e50;">{{ venta.clienteNombre }}</div>
                  <small style="color: #6c757d;">
                    <i class="fas fa-phone-alt"></i> {{ venta.clienteTelefono }}
                  </small>
                </div>
              </td>
              <td>
                <div style="display: flex; flex-direction: column; gap: 0.25rem;">
                  <span 
                    class="crud-badge crud-badge-compact"
                    :style="tipoBadgeStyle(venta.tipoVenta)"
                  >
                    <i class="fas" :class="venta.tipoVenta === 'online' ? 'fa-globe' : 'fa-store'"></i>
                    {{ venta.tipoVenta === 'online' ? 'Online' : 'Presencial' }}
                  </span>
                  <span 
                    class="crud-badge crud-badge-compact"
                    :style="metodoBadgeStyle(venta.metodoPago)"
                  >
                    <i class="fas fa-credit-card"></i>
                    {{ venta.metodoPago.toUpperCase() }}
                  </span>
                </div>
              </td>
              <td>
                <span class="precio-compact">
                  Bs. {{ Number(venta.total).toFixed(2) }}
                </span>
              </td>
              <td>
                <small style="color: #6c757d; font-size: 0.8rem;">
                  <i class="far fa-calendar-alt"></i>
                  {{ formatFecha(venta.fechaVenta) }}
                </small>
              </td>
              <td>
                <span 
                  class="crud-badge crud-badge-compact"
                  :class="`crud-badge-${getEstadoBadge(venta.estado).class}`"
                >
                  <i class="fas fa-check-circle mr-1"></i>
                  {{ getEstadoBadge(venta.estado).label }}
                </span>
              </td>
              <td class="text-center">
                <button
                  @click="toggleDetalles(venta)"
                  class="crud-btn-view crud-btn-compact"
                  :class="{ 'active': expandedVentaId === venta.id }"
                  :title="expandedVentaId === venta.id ? 'Ocultar detalles' : 'Ver detalles completos'"
                >
                  <i class="fas" :class="expandedVentaId === venta.id ? 'fa-eye-slash' : 'fa-eye'"></i>
                </button>
              </td>
            </tr>

            <!-- FILA EXPANDIBLE CON DETALLES -->
            <tr v-if="expandedVentaId === venta.id && ventaExpandida" :key="`detalles-${expandedVentaId}`" class="expandable-row">
              <td colspan="8" class="expandable-content">
                <div class="detalles-container">
                  <!-- Loading -->
                  <div v-if="loadingDetalles" class="text-center py-4">
                    <div class="spinner-border spinner-border-sm text-primary" role="status">
                      <span class="sr-only">Cargando...</span>
                    </div>
                    <p class="mt-2 mb-0 text-muted small">Cargando detalles...</p>
                  </div>

                  <!-- Detalles de la venta -->
                  <div v-else class="detalles-content">
                    <div class="row">
                      <!-- Información del Cliente -->
                      <div class="col-md-6 mb-3">
                        <div class="detalle-card">
                          <h6 class="detalle-title">
                            <i class="fas fa-user text-primary"></i>
                            Información del Cliente
                          </h6>
                          <div class="detalle-body">
                            <p class="mb-1"><strong>Nombre:</strong> {{ ventaExpandida.clienteNombre }}</p>
                            <p class="mb-1"><strong>Teléfono:</strong> {{ ventaExpandida.clienteTelefono }}</p>
                            <p class="mb-1" v-if="ventaExpandida.clienteEmail">
                              <strong>Email:</strong> {{ ventaExpandida.clienteEmail }}
                            </p>
                            <p class="mb-0" v-if="ventaExpandida.clienteNotas">
                              <strong>Notas:</strong> {{ ventaExpandida.clienteNotas }}
                            </p>
                          </div>
                        </div>
                      </div>

                      <!-- Información de la Venta -->
                      <div class="col-md-6 mb-3">
                        <div class="detalle-card">
                          <h6 class="detalle-title">
                            <i class="fas fa-receipt text-success"></i>
                            Información de la Venta
                          </h6>
                          <div class="detalle-body">
                            <p class="mb-1"><strong>Número:</strong> {{ ventaExpandida.numeroVenta }}</p>
                            <p class="mb-1"><strong>Tipo:</strong> {{ ventaExpandida.tipoVenta === 'online' ? 'Online' : 'Presencial' }}</p>
                            <p class="mb-1"><strong>Pago:</strong> {{ ventaExpandida.metodoPago.toUpperCase() }}</p>
                            <p class="mb-1"><strong>Estado:</strong> 
                              <span class="crud-badge crud-badge-compact" :class="`crud-badge-${getEstadoBadge(ventaExpandida.estado).class}`">
                                {{ getEstadoBadge(ventaExpandida.estado).label }}
                              </span>
                            </p>
                            <p class="mb-0"><strong>Fecha:</strong> {{ formatFecha(ventaExpandida.fechaVenta) }}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Productos -->
                    <div class="row">
                      <div class="col-12">
                        <div class="detalle-card">
                          <h6 class="detalle-title">
                            <i class="fas fa-shopping-bag text-warning"></i>
                            Productos ({{ detallesVenta.length }})
                          </h6>
                          <div class="detalle-body p-0">
                            <div class="table-responsive">
                              <table class="table table-sm mb-0">
                                <thead>
                                  <tr>
                                    <th width="5%">#</th>
                                    <th width="45%">Producto</th>
                                    <th width="15%">Precio Unit.</th>
                                    <th width="10%">Cant.</th>
                                    <th width="15%">Subtotal</th>
                                    <th width="10%">Notas</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr v-for="(detalle, idx) in detallesVenta" :key="detalle.id">
                                    <td>{{ idx + 1 }}</td>
                                    <td>
                                      <strong>{{ detalle.nombreProducto }}</strong>
                                    </td>
                                    <td>Bs. {{ Number(detalle.precioUnitario).toFixed(2) }}</td>
                                    <td><strong>{{ detalle.cantidad }}</strong></td>
                                    <td><strong class="text-success">Bs. {{ Number(detalle.subtotal).toFixed(2) }}</strong></td>
                                    <td>
                                      <small v-if="detalle.notas" class="text-muted">{{ detalle.notas }}</small>
                                      <small v-else class="text-muted">-</small>
                                    </td>
                                  </tr>
                                </tbody>
                                <tfoot>
                                  <tr>
                                    <td colspan="4" class="text-right"><strong>Subtotal:</strong></td>
                                    <td colspan="2"><strong>Bs. {{ Number(ventaExpandida.subtotal).toFixed(2) }}</strong></td>
                                  </tr>
                                  <tr v-if="ventaExpandida.descuento > 0">
                                    <td colspan="4" class="text-right"><strong>Descuento:</strong></td>
                                    <td colspan="2"><strong class="text-danger">- Bs. {{ Number(ventaExpandida.descuento).toFixed(2) }}</strong></td>
                                  </tr>
                                  <tr>
                                    <td colspan="4" class="text-right"><strong class="text-success">TOTAL:</strong></td>
                                    <td colspan="2"><strong class="text-success" style="font-size: 1.1rem;">Bs. {{ Number(ventaExpandida.total).toFixed(2) }}</strong></td>
                                  </tr>
                                </tfoot>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Notas Internas -->
                    <div v-if="ventaExpandida.notasInternas" class="row">
                      <div class="col-12">
                        <div class="alert alert-warning mb-0">
                          <strong><i class="fas fa-sticky-note mr-2"></i>Notas Internas:</strong>
                          <p class="mb-0 mt-2">{{ ventaExpandida.notasInternas }}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default { name: 'VentaList' }
</script>

<style scoped>
/* ===== FILTROS Y BÚSQUEDA ===== */
.crud-filter-select,
.crud-search-input {
  background-color: #ffffff !important;
  color: #2c3e50 !important;
  border: 2px solid #dee2e6 !important;
  font-weight: 500 !important;
}

.crud-filter-select:focus,
.crud-search-input:focus {
  border-color: #0d6efd !important;
  box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25) !important;
}

.crud-filter-select option {
  background-color: #ffffff !important;
  color: #2c3e50 !important;
}

.crud-search-input::placeholder {
  color: #6c757d !important;
  opacity: 1 !important;
}

/* ===== INDICADOR DE REFRESH ===== */
.refresh-indicator {
  display: inline-block;
  margin-left: 0.5rem;
  color: #28a745;
  font-size: 0.85rem;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* ===== CONTENEDOR DE TABLA ===== */
.table-responsive {
  overflow-x: auto;
  overflow-y: visible;
  -webkit-overflow-scrolling: touch;
  margin-bottom: 0;
}

/* ===== FILAS EXPANDIBLES ===== */
.expandable-row {
  background: #f8f9fa;
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.expandable-content {
  padding: 0 !important;
  border-top: 3px solid #0d6efd;
}

.detalles-container {
  background: #ffffff;
  padding: 1.5rem;
  border-radius: 0 0 8px 8px;
}

.detalles-content {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.detalle-card {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  overflow: hidden;
  height: 100%;
}

.detalle-title {
  background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
  color: #ffffff;
  padding: 0.75rem 1rem;
  margin: 0;
  font-size: 0.9rem;
  font-weight: 600;
  border-bottom: 2px solid #1a252f;
}

.detalle-title i {
  margin-right: 0.5rem;
  font-size: 0.95rem;
}

.detalle-body {
  padding: 1rem;
  font-size: 0.9rem;
}

.detalle-body p {
  color: #495057;
  line-height: 1.6;
}

.detalle-body strong {
  color: #2c3e50;
  font-weight: 600;
}

/* Botón activo cuando está expandido */
.crud-btn-view.active {
  background-color: #dc3545;
  border-color: #dc3545;
  color: #ffffff;
}

.crud-btn-view.active:hover {
  background-color: #c82333;
  border-color: #bd2130;
}

/* ===== DROPDOWN MENU ===== */
.dropdown-menu {
  border: 1px solid #e9ecef;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-radius: 8px;
  padding: 0.5rem 0;
}

.dropdown-header {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  color: #6c757d;
  padding: 0.5rem 1rem;
  letter-spacing: 0.5px;
}

.dropdown-item {
  padding: 0.5rem 1rem;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  transition: all 0.2s ease;
}

.dropdown-item:hover:not(:disabled) {
  background: #f8f9fa;
  color: #2c3e50;
  padding-left: 1.25rem;
}

.dropdown-item:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background: #f8f9fa;
}

.dropdown-item i.fa-circle {
  font-size: 0.5rem;
}


</style>
