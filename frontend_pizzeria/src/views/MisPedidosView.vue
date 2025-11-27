<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useClienteStore } from '@/stores/cliente'
import { useAuthStore } from '@/stores'
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
  tipoVenta: string
  metodoPago: string
  detalles: Array<{
    nombreProducto: string
    cantidad: number
    precioUnitario: number
    subtotal: number
  }>
}

const router = useRouter()
const clienteStore = useClienteStore()
const authStore = useAuthStore()
const toast = useToast()

const pedidos = ref<Pedido[]>([])
const loading = ref(false)
const pedidoExpandido = ref<number | null>(null)
const cancelando = ref<number | null>(null)

let simulacionIntervalId: number | null = null
let pollingIntervalId: number | null = null

// Estados en orden para simulación
const estadosOrden = ['confirmada', 'preparando', 'lista', 'entregada']

// Verificar si hay un usuario autenticado (de BD o localStorage)
const isClienteDB = computed(() => authStore.isAuthenticated && authStore.isCliente)
const isClienteLocal = computed(() => clienteStore.isAuthenticated)
const isAnyCliente = computed(() => isClienteDB.value || isClienteLocal.value)

// Nombre del cliente
const nombreCliente = computed(() => {
  if (isClienteDB.value) {
    return authStore.userName
  }
  return clienteStore.clienteNombre
})

// Teléfono del cliente
const telefonoCliente = computed(() => {
  if (isClienteDB.value) {
    return authStore.usuario?.telefono || ''
  }
  return clienteStore.cliente?.telefono || ''
})

// ID del cliente (solo para usuarios de BD)
const clienteId = computed(() => {
  if (isClienteDB.value) {
    return authStore.userId
  }
  return null
})

// Pedidos activos (en proceso)
const pedidosActivos = computed(() => {
  return pedidos.value.filter(p => 
    p.estado !== 'cancelada' && p.estado !== 'entregada'
  )
})

// Historial (entregados o cancelados)
const pedidosHistorial = computed(() => {
  return pedidos.value.filter(p => 
    p.estado === 'cancelada' || p.estado === 'entregada'
  )
})

// Cargar pedidos
const cargarPedidos = async () => {
  // Si es cliente autenticado con BD, usar endpoint por ID
  if (isClienteDB.value && clienteId.value) {
    try {
      loading.value = true
      const response = await axios.get(`/ventas/cliente/${clienteId.value}`)
      pedidos.value = response.data
      // Aplicar estados basados en tiempo transcurrido
      aplicarEstadosPorTiempo()
    } catch (error) {
      console.error('Error al cargar pedidos:', error)
      pedidos.value = []
    } finally {
      loading.value = false
    }
    return
  }

  // Si es cliente con localStorage, usar endpoint por teléfono
  if (!telefonoCliente.value) {
    router.push('/menu')
    return
  }

  try {
    loading.value = true
    const response = await axios.get(`/ventas/cliente/telefono/${telefonoCliente.value}`)
    pedidos.value = response.data
    // Aplicar estados basados en tiempo transcurrido
    aplicarEstadosPorTiempo()
  } catch (error) {
    console.error('Error al cargar pedidos:', error)
    pedidos.value = []
  } finally {
    loading.value = false
  }
}

/**
 * LÓGICA DE TIEMPO TRANSCURRIDO
 * 
 * Tiempos de simulación (desde la creación del pedido):
 * - 0 a 1 min: confirmada
 * - 1 a 2 min: preparando  
 * - 2 a 3 min: lista
 * - 3+ min: entregada (va al historial)
 * 
 * Esto hace que pedidos antiguos vayan automáticamente al historial
 */
const TIEMPO_POR_ESTADO = 60 * 1000 // 1 minuto por estado (60 segundos)

const calcularEstadoPorTiempo = (fechaVenta: string, estadoActual: string): string => {
  // Si ya está cancelada, no cambiar
  if (estadoActual === 'cancelada') return 'cancelada'
  
  const ahora = new Date().getTime()
  const fechaCreacion = new Date(fechaVenta).getTime()
  const tiempoTranscurrido = ahora - fechaCreacion
  
  // Calcular en qué estado debería estar según el tiempo
  const minutosTranscurridos = tiempoTranscurrido / TIEMPO_POR_ESTADO
  
  if (minutosTranscurridos >= 3) {
    return 'entregada' // Más de 3 minutos = entregada
  } else if (minutosTranscurridos >= 2) {
    return 'lista' // Entre 2-3 minutos = lista
  } else if (minutosTranscurridos >= 1) {
    return 'preparando' // Entre 1-2 minutos = preparando
  } else {
    return 'confirmada' // Menos de 1 minuto = confirmada
  }
}

// Aplicar estados según el tiempo transcurrido
const aplicarEstadosPorTiempo = () => {
  pedidos.value = pedidos.value.map(pedido => {
    // Solo procesar pedidos que no estén cancelados o ya entregados en BD
    if (pedido.estado === 'cancelada') {
      return pedido
    }
    
    const nuevoEstado = calcularEstadoPorTiempo(pedido.fechaVenta, pedido.estado)
    
    if (nuevoEstado !== pedido.estado) {
      console.log(`📦 Pedido #${pedido.numeroVenta}: ${pedido.estado} → ${nuevoEstado} (por tiempo)`)
    }
    
    return { ...pedido, estado: nuevoEstado }
  }) as Pedido[]
  
  // Iniciar simulación en tiempo real para pedidos aún activos
  iniciarSimulacionTiempoReal()
}

// Set para rastrear qué pedidos ya mostraron notificación de entrega
const pedidosNotificados = ref<Set<number>>(new Set())

// Simulación en tiempo real: actualiza estados cada 10 segundos
const iniciarSimulacionTiempoReal = () => {
  // Limpiar intervalo anterior
  if (simulacionIntervalId) {
    clearInterval(simulacionIntervalId)
    simulacionIntervalId = null
  }
  
  // Solo continuar si hay pedidos activos
  const hayPedidosActivos = pedidos.value.some(p => 
    p.estado !== 'cancelada' && p.estado !== 'entregada'
  )
  
  if (!hayPedidosActivos) {
    console.log('✅ Todos los pedidos están finalizados')
    return
  }
  
  // Actualizar estados cada 10 segundos
  simulacionIntervalId = window.setInterval(() => {
    let algunCambio = false
    
    pedidos.value = pedidos.value.map(pedido => {
      if (pedido.estado === 'cancelada' || pedido.estado === 'entregada') {
        return pedido
      }
      
      const nuevoEstado = calcularEstadoPorTiempo(pedido.fechaVenta, pedido.estado)
      
      if (nuevoEstado !== pedido.estado) {
        algunCambio = true
        console.log(`🚀 [LIVE] Pedido #${pedido.numeroVenta}: ${pedido.estado} → ${nuevoEstado}`)
        
        // Notificar solo una vez cuando se entrega
        if (nuevoEstado === 'entregada' && !pedidosNotificados.value.has(pedido.id)) {
          pedidosNotificados.value.add(pedido.id)
          toast.success(`¡Tu pedido #${pedido.numeroVenta} ha sido entregado! 🎉`)
        }
        
        return { ...pedido, estado: nuevoEstado }
      }
      
      return pedido
    }) as Pedido[]
    
    // Si ya no hay pedidos activos, detener el intervalo
    const quedanActivos = pedidos.value.some(p => 
      p.estado !== 'cancelada' && p.estado !== 'entregada'
    )
    
    if (!quedanActivos && simulacionIntervalId) {
      console.log('✅ Simulación finalizada - todos los pedidos entregados')
      clearInterval(simulacionIntervalId)
      simulacionIntervalId = null
    }
  }, 10000) // Revisar cada 10 segundos
}

// Polling cada 30 segundos
const iniciarPolling = () => {
  if (pollingIntervalId) return
  
  pollingIntervalId = window.setInterval(() => {
    if (isAnyCliente.value) {
      cargarPedidos()
    }
  }, 30000)
}

// Formato de precio
const formatPrice = (price: number) => {
  return `Bs. ${Number(price).toFixed(2)}`
}

// Formato de fecha
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleString('es-BO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Estado del timeline
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

// Progreso en porcentaje
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

// Puede cancelar
const puedeCancelar = (pedido: Pedido) => {
  return ['pendiente', 'confirmada'].includes(pedido.estado)
}

// Cancelar pedido
const cancelarPedido = async (pedido: Pedido) => {
  if (!confirm(`¿Estás seguro de cancelar el pedido #${pedido.numeroVenta}?`)) {
    return
  }

  try {
    cancelando.value = pedido.id
    await axios.patch(`/ventas/${pedido.id}/cancelar`)
    toast.success('Pedido cancelado exitosamente')
    cargarPedidos()
  } catch (error: any) {
    const message = error.response?.data?.message || 'Error al cancelar el pedido'
    toast.error(message)
  } finally {
    cancelando.value = null
  }
}

// Toggle expandir
const toggleExpandir = (pedidoId: number) => {
  pedidoExpandido.value = pedidoExpandido.value === pedidoId ? null : pedidoId
}

// Volver al menú
const volverAlMenu = () => {
  router.push('/menu')
}

onMounted(() => {
  if (!isAnyCliente.value) {
    toast.warning('Debes iniciar sesión como cliente para ver tus pedidos')
    router.push('/menu')
    return
  }
  cargarPedidos()
  iniciarPolling()
})

onUnmounted(() => {
  if (simulacionIntervalId) clearInterval(simulacionIntervalId)
  if (pollingIntervalId) clearInterval(pollingIntervalId)
})

watch(() => isAnyCliente.value, (isAuth) => {
  if (!isAuth) {
    router.push('/menu')
  }
})
</script>

<template>
  <div class="mis-pedidos-page">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="container">
        <div class="hero-content">
          <button class="btn-volver" @click="volverAlMenu">
            <i class="fas fa-arrow-left mr-2"></i>
            Volver al Menú
          </button>
          <h1>
            <i class="fas fa-receipt mr-3"></i>
            Mis Pedidos
          </h1>
          <p v-if="nombreCliente">
            Hola, <strong>{{ nombreCliente }}</strong>
            <span v-if="telefonoCliente"> · {{ telefonoCliente }}</span>
          </p>
        </div>
      </div>
    </section>

    <!-- Contenido Principal -->
    <section class="pedidos-section">
      <div class="container">
        <!-- Loading -->
        <div v-if="loading" class="loading-state">
          <div class="spinner"></div>
          <p>Cargando tus pedidos...</p>
        </div>

        <!-- Sin pedidos -->
        <div v-else-if="pedidos.length === 0" class="empty-state">
          <i class="fas fa-box-open"></i>
          <h3>No tienes pedidos</h3>
          <p>Cuando hagas un pedido, aparecerá aquí</p>
          <button class="btn-primary-custom" @click="volverAlMenu">
            <i class="fas fa-pizza-slice mr-2"></i>
            Ir al Menú
          </button>
        </div>

        <!-- Pedidos -->
        <div v-else class="pedidos-container">
          <!-- Columna Izquierda: Pedidos Activos -->
          <div class="pedidos-column activos">
            <div class="column-header">
              <h2>
                <i class="fas fa-motorcycle mr-2"></i>
                Pedidos Activos
                <span class="badge-count" v-if="pedidosActivos.length">{{ pedidosActivos.length }}</span>
              </h2>
              <div class="demo-badge">
                <i class="fas fa-magic mr-1"></i>
                Demo: Avance cada 1 minuto
              </div>
            </div>

            <div v-if="pedidosActivos.length === 0" class="empty-column">
              <i class="fas fa-check-circle"></i>
              <p>No tienes pedidos en proceso</p>
            </div>

            <div v-else class="pedidos-list">
              <div 
                v-for="pedido in pedidosActivos" 
                :key="pedido.id"
                class="pedido-card activo"
              >
                <!-- Header del pedido -->
                <div class="pedido-header" @click="toggleExpandir(pedido.id)">
                  <div class="pedido-info">
                    <span class="pedido-numero">#{{ pedido.numeroVenta }}</span>
                    <span 
                      class="pedido-estado"
                      :style="{ backgroundColor: getEstadoColor(pedido.estado) }"
                    >
                      {{ getEstadoTexto(pedido.estado) }}
                    </span>
                  </div>
                  <div class="pedido-total">{{ formatPrice(pedido.total) }}</div>
                  <i 
                    class="fas chevron"
                    :class="pedidoExpandido === pedido.id ? 'fa-chevron-up' : 'fa-chevron-down'"
                  ></i>
                </div>

                <!-- Timeline -->
                <div class="timeline-section">
                  <div class="timeline">
                    <div 
                      class="timeline-step"
                      :class="{ 'completed': getEstadoStep(pedido.estado) >= 1, 'active': getEstadoStep(pedido.estado) === 1 }"
                    >
                      <div class="step-icon"><i class="fas fa-check"></i></div>
                      <span>Confirmado</span>
                    </div>
                    <div class="timeline-line" :class="{ 'completed': getEstadoStep(pedido.estado) >= 2 }"></div>
                    <div 
                      class="timeline-step"
                      :class="{ 'completed': getEstadoStep(pedido.estado) >= 2, 'active': getEstadoStep(pedido.estado) === 2 }"
                    >
                      <div class="step-icon"><i class="fas fa-fire"></i></div>
                      <span>Preparando</span>
                    </div>
                    <div class="timeline-line" :class="{ 'completed': getEstadoStep(pedido.estado) >= 3 }"></div>
                    <div 
                      class="timeline-step"
                      :class="{ 'completed': getEstadoStep(pedido.estado) >= 3, 'active': getEstadoStep(pedido.estado) === 3 }"
                    >
                      <div class="step-icon"><i class="fas fa-motorcycle"></i></div>
                      <span>En Camino</span>
                    </div>
                    <div class="timeline-line" :class="{ 'completed': getEstadoStep(pedido.estado) >= 4 }"></div>
                    <div 
                      class="timeline-step"
                      :class="{ 'completed': getEstadoStep(pedido.estado) >= 4 }"
                    >
                      <div class="step-icon"><i class="fas fa-home"></i></div>
                      <span>Entregado</span>
                    </div>
                  </div>
                  
                  <!-- Barra de progreso -->
                  <div class="progress-bar">
                    <div class="progress-fill" :style="{ width: getProgressWidth(pedido.estado) }"></div>
                  </div>
                </div>

                <!-- Detalle expandido -->
                <Transition name="expand">
                  <div v-if="pedidoExpandido === pedido.id" class="pedido-detalle">
                    <div class="detalle-fecha">
                      <i class="fas fa-calendar-alt mr-2"></i>
                      {{ formatDate(pedido.fechaVenta) }}
                    </div>

                    <div class="detalle-productos">
                      <h4>Productos:</h4>
                      <div 
                        v-for="(item, idx) in pedido.detalles" 
                        :key="idx"
                        class="producto-item"
                      >
                        <span class="cantidad">{{ item.cantidad }}x</span>
                        <span class="nombre">{{ item.nombreProducto }}</span>
                        <span class="precio">{{ formatPrice(item.subtotal) }}</span>
                      </div>
                    </div>

                    <div v-if="puedeCancelar(pedido)" class="detalle-acciones">
                      <button 
                        class="btn-cancelar"
                        @click.stop="cancelarPedido(pedido)"
                        :disabled="cancelando === pedido.id"
                      >
                        <i v-if="cancelando === pedido.id" class="fas fa-spinner fa-spin mr-1"></i>
                        <i v-else class="fas fa-times-circle mr-1"></i>
                        {{ cancelando === pedido.id ? 'Cancelando...' : 'Cancelar Pedido' }}
                      </button>
                    </div>
                  </div>
                </Transition>
              </div>
            </div>
          </div>

          <!-- Columna Derecha: Historial -->
          <div class="pedidos-column historial">
            <div class="column-header">
              <h2>
                <i class="fas fa-history mr-2"></i>
                Historial
                <span class="badge-count secondary" v-if="pedidosHistorial.length">{{ pedidosHistorial.length }}</span>
              </h2>
            </div>

            <div v-if="pedidosHistorial.length === 0" class="empty-column">
              <i class="fas fa-clipboard-list"></i>
              <p>Tu historial está vacío</p>
            </div>

            <div v-else class="pedidos-list">
              <div 
                v-for="pedido in pedidosHistorial" 
                :key="pedido.id"
                class="pedido-card historial-card"
                :class="{ 'cancelado': pedido.estado === 'cancelada' }"
                @click="toggleExpandir(pedido.id)"
              >
                <div class="pedido-header">
                  <div class="pedido-info">
                    <span class="pedido-numero">#{{ pedido.numeroVenta }}</span>
                    <span 
                      class="pedido-estado"
                      :style="{ backgroundColor: getEstadoColor(pedido.estado) }"
                    >
                      <i :class="pedido.estado === 'entregada' ? 'fas fa-check' : 'fas fa-ban'" class="mr-1"></i>
                      {{ getEstadoTexto(pedido.estado) }}
                    </span>
                  </div>
                  <div class="pedido-meta">
                    <span class="pedido-fecha">{{ formatDate(pedido.fechaVenta) }}</span>
                    <span class="pedido-total">{{ formatPrice(pedido.total) }}</span>
                  </div>
                </div>

                <!-- Detalle expandido -->
                <Transition name="expand">
                  <div v-if="pedidoExpandido === pedido.id" class="pedido-detalle">
                    <div class="detalle-productos">
                      <div 
                        v-for="(item, idx) in pedido.detalles" 
                        :key="idx"
                        class="producto-item"
                      >
                        <span class="cantidad">{{ item.cantidad }}x</span>
                        <span class="nombre">{{ item.nombreProducto }}</span>
                        <span class="precio">{{ formatPrice(item.subtotal) }}</span>
                      </div>
                    </div>
                  </div>
                </Transition>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.mis-pedidos-page {
  min-height: 100vh;
  background: #f8f9fa;
}

/* Hero Section */
.hero-section {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  padding: 40px 0;
  color: white;
}

.hero-content {
  text-align: center;
}

.btn-volver {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 10px 20px;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 20px;
}

.btn-volver:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateX(-5px);
}

.hero-content h1 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 10px;
}

.hero-content h1 i {
  color: #fca100;
}

.hero-content p {
  font-size: 1.1rem;
  opacity: 0.9;
}

.hero-content p strong {
  color: #fca100;
}

/* Sección de pedidos */
.pedidos-section {
  padding: 40px 0;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Loading & Empty */
.loading-state,
.empty-state {
  text-align: center;
  padding: 80px 20px;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #e9ecef;
  border-top-color: #fca100;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.empty-state i {
  font-size: 80px;
  color: #dee2e6;
  margin-bottom: 20px;
}

.empty-state h3 {
  color: #495057;
  margin-bottom: 10px;
}

.empty-state p {
  color: #6c757d;
  margin-bottom: 25px;
}

.btn-primary-custom {
  background: linear-gradient(135deg, #fca100, #ff8c00);
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 25px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary-custom:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(252, 161, 0, 0.4);
}

/* Contenedor de pedidos */
.pedidos-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
}

@media (max-width: 992px) {
  .pedidos-container {
    grid-template-columns: 1fr;
  }
}

/* Columnas */
.pedidos-column {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.column-header {
  padding: 20px 25px;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}

.column-header h2 {
  margin: 0;
  font-size: 1.3rem;
  font-weight: 600;
  display: flex;
  align-items: center;
}

.column-header h2 i {
  color: #fca100;
}

.badge-count {
  background: #fca100;
  color: #1a1a2e;
  font-size: 12px;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 12px;
  margin-left: 10px;
}

.badge-count.secondary {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.demo-badge {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  font-size: 11px;
  font-weight: 600;
  padding: 5px 12px;
  border-radius: 15px;
}

.empty-column {
  padding: 60px 20px;
  text-align: center;
  color: #6c757d;
}

.empty-column i {
  font-size: 50px;
  color: #dee2e6;
  margin-bottom: 15px;
}

/* Lista de pedidos */
.pedidos-list {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  max-height: 600px;
  overflow-y: auto;
}

/* Tarjeta de pedido */
.pedido-card {
  background: #f8f9fa;
  border-radius: 12px;
  overflow: hidden;
  border: 2px solid #e9ecef;
  transition: all 0.3s ease;
}

.pedido-card.activo {
  border-color: #28a745;
  background: linear-gradient(135deg, #f0fff4 0%, #e8f5e9 100%);
}

.pedido-card.historial-card {
  cursor: pointer;
}

.pedido-card.historial-card:hover {
  border-color: #fca100;
}

.pedido-card.cancelado {
  border-color: #dc3545;
  background: linear-gradient(135deg, #fff5f5 0%, #ffe6e6 100%);
  opacity: 0.85;
}

/* Header del pedido */
.pedido-header {
  padding: 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  gap: 10px;
}

.pedido-info {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.pedido-numero {
  font-weight: 700;
  font-size: 16px;
  color: #1a1a2e;
}

.pedido-estado {
  padding: 4px 12px;
  border-radius: 15px;
  font-size: 11px;
  font-weight: 600;
  color: white;
  text-transform: uppercase;
}

.pedido-total {
  font-weight: 700;
  font-size: 18px;
  color: #28a745;
}

.pedido-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
}

.pedido-fecha {
  font-size: 12px;
  color: #6c757d;
}

.chevron {
  color: #6c757d;
  transition: transform 0.3s ease;
}

/* Timeline */
.timeline-section {
  padding: 15px;
  background: white;
  border-top: 1px solid #e9ecef;
}

.timeline {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 15px;
}

.timeline-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  flex: 0 0 auto;
}

.step-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #e9ecef;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: #adb5bd;
  transition: all 0.3s ease;
}

.timeline-step.completed .step-icon {
  background: #28a745;
  color: white;
}

.timeline-step.active .step-icon {
  background: #fca100;
  color: white;
  animation: pulse-icon 1.5s infinite;
}

@keyframes pulse-icon {
  0%, 100% { box-shadow: 0 0 0 0 rgba(252, 161, 0, 0.4); }
  50% { box-shadow: 0 0 0 10px rgba(252, 161, 0, 0); }
}

.timeline-step span {
  font-size: 10px;
  font-weight: 600;
  color: #6c757d;
  text-align: center;
}

.timeline-step.completed span,
.timeline-step.active span {
  color: #1a1a2e;
}

.timeline-line {
  flex: 1;
  height: 3px;
  background: #e9ecef;
  margin-top: 16px;
  min-width: 15px;
}

.timeline-line.completed {
  background: #28a745;
}

/* Barra de progreso */
.progress-bar {
  height: 6px;
  background: #e9ecef;
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #28a745, #20c997);
  border-radius: 3px;
  transition: width 0.5s ease;
}

/* Detalle */
.pedido-detalle {
  padding: 15px;
  background: white;
  border-top: 1px solid #e9ecef;
}

.detalle-fecha {
  font-size: 13px;
  color: #6c757d;
  margin-bottom: 15px;
}

.detalle-productos h4 {
  font-size: 14px;
  font-weight: 600;
  color: #1a1a2e;
  margin-bottom: 10px;
}

.producto-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 0;
  border-bottom: 1px solid #f1f1f1;
}

.producto-item:last-child {
  border-bottom: none;
}

.producto-item .cantidad {
  font-weight: 700;
  color: #fca100;
  min-width: 35px;
}

.producto-item .nombre {
  flex: 1;
  color: #495057;
}

.producto-item .precio {
  font-weight: 600;
  color: #1a1a2e;
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

/* Transitions */
.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  max-height: 0;
}

/* Scrollbar */
.pedidos-list::-webkit-scrollbar {
  width: 6px;
}

.pedidos-list::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.pedidos-list::-webkit-scrollbar-thumb {
  background: #fca100;
  border-radius: 3px;
}

/* Responsive */
@media (max-width: 768px) {
  .hero-content h1 {
    font-size: 1.8rem;
  }

  .timeline-step span {
    font-size: 9px;
  }

  .step-icon {
    width: 30px;
    height: 30px;
    font-size: 12px;
  }

  .timeline-line {
    margin-top: 14px;
  }

  .pedido-header {
    flex-wrap: wrap;
  }
}
</style>
