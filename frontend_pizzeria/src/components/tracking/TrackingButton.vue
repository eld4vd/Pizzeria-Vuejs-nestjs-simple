<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useClienteStore } from '@/stores/cliente'
import axios from '@/plugins/axios'

const router = useRouter()
const clienteStore = useClienteStore()

const pedidosActivos = ref<any[]>([])
const loading = ref(false)
let intervalId: number | null = null

// Computed: mostrar botón solo si hay pedidos activos (no entregados ni cancelados)
const tienePedidosActivos = computed(() => {
  return pedidosActivos.value.some(p => 
    p.estado !== 'cancelada' && p.estado !== 'entregada'
  )
})

const cantidadPedidos = computed(() => {
  return pedidosActivos.value.filter(p => 
    p.estado !== 'cancelada' && p.estado !== 'entregada'
  ).length
})

// Cargar pedidos del cliente
const cargarPedidos = async () => {
  if (!clienteStore.cliente?.telefono) return

  try {
    loading.value = true
    const response = await axios.get(`/ventas/cliente/telefono/${clienteStore.cliente.telefono}`)
    // Solo guardar pedidos activos
    pedidosActivos.value = response.data.filter((p: any) => 
      p.estado !== 'cancelada' && p.estado !== 'entregada'
    )
  } catch (error) {
    console.error('Error al cargar pedidos:', error)
    pedidosActivos.value = []
  } finally {
    loading.value = false
  }
}

// Ir a la página de Mis Pedidos
const irAMisPedidos = () => {
  router.push('/mis-pedidos')
}

// Polling cada 30 segundos para actualizar estado
const iniciarPolling = () => {
  if (intervalId) return
  
  intervalId = window.setInterval(() => {
    if (clienteStore.isAuthenticated) {
      cargarPedidos()
    }
  }, 30000)
}

const detenerPolling = () => {
  if (intervalId) {
    clearInterval(intervalId)
    intervalId = null
  }
}

onMounted(() => {
  if (clienteStore.isAuthenticated) {
    cargarPedidos()
    iniciarPolling()
  }
})

onUnmounted(() => {
  detenerPolling()
})

// Watch para cuando el cliente se autentique
watch(() => clienteStore.isAuthenticated, (isAuth) => {
  if (isAuth) {
    cargarPedidos()
    iniciarPolling()
  } else {
    pedidosActivos.value = []
    detenerPolling()
  }
}, { immediate: true })
</script>

<template>
  <div v-if="tienePedidosActivos" class="tracking-button-wrapper">
    <button 
      class="tracking-button"
      @click="irAMisPedidos"
      :disabled="loading"
    >
      <div class="tracking-icon">
        <i class="fas fa-motorcycle"></i>
        <span v-if="cantidadPedidos > 0" class="badge-count">{{ cantidadPedidos }}</span>
      </div>
      <span class="tracking-text">Mi Pedido</span>
    </button>
  </div>
</template>

<style scoped>
.tracking-button-wrapper {
  position: relative;
}

.tracking-button {
  display: flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, #28a745, #20c997);
  color: white;
  border: none;
  padding: 10px 18px;
  border-radius: 25px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(40, 167, 69, 0.3);
  animation: pulse 2s infinite;
}

.tracking-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(40, 167, 69, 0.4);
}

.tracking-button:disabled {
  opacity: 0.7;
  cursor: wait;
}

@keyframes pulse {
  0%, 100% {
    box-shadow: 0 4px 15px rgba(40, 167, 69, 0.3);
  }
  50% {
    box-shadow: 0 4px 25px rgba(40, 167, 69, 0.5);
  }
}

.tracking-icon {
  position: relative;
  font-size: 18px;
}

.badge-count {
  position: absolute;
  top: -8px;
  right: -10px;
  background: #dc3545;
  color: white;
  font-size: 10px;
  font-weight: 700;
  min-width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid white;
}

.tracking-text {
  white-space: nowrap;
}

@media (max-width: 768px) {
  .tracking-button {
    padding: 8px 12px;
    font-size: 12px;
  }

  .tracking-text {
    display: none;
  }

  .tracking-icon {
    font-size: 20px;
  }
}
</style>
