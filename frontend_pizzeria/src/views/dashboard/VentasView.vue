<script setup lang="ts">
import { ref, onUnmounted, watch } from 'vue'
import VentaList from '@/components/venta/VentaList.vue'
import VentaDetalle from '@/components/venta/VentaDetalle.vue'
import VentaSave from '@/components/venta/VentaSave.vue'
import type { Venta } from '@/models/venta'

const listRef = ref<InstanceType<typeof VentaList> | null>(null)
const ventaSeleccionada = ref<Venta | null>(null)
const showDetalleModal = ref(false)
const showNuevaVentaModal = ref(false)
const fullscreenMode = ref(false)

// Toggle fullscreen mode
const toggleFullscreen = () => {
  fullscreenMode.value = !fullscreenMode.value
}

// Watch para agregar/quitar clase del body
watch(fullscreenMode, (isFullscreen) => {
  if (isFullscreen) {
    document.body.classList.add('ventas-fullscreen-mode')
  } else {
    document.body.classList.remove('ventas-fullscreen-mode')
  }
})

// Limpiar al desmontar
onUnmounted(() => {
  document.body.classList.remove('ventas-fullscreen-mode')
})

// Escuchar ESC para salir del modo fullscreen
const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && fullscreenMode.value) {
    fullscreenMode.value = false
  }
}
document.addEventListener('keydown', handleKeydown)
onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})

const handleVerDetalles = (venta: Venta) => {
  console.log('📥 VentasView - handleVerDetalles recibido')
  console.log('📋 Venta recibida:', venta)
  ventaSeleccionada.value = venta
  showDetalleModal.value = true
  console.log('✅ Modal de detalles abierto:', showDetalleModal.value)
  console.log('✅ Venta seleccionada:', ventaSeleccionada.value?.numeroVenta)
}

const handleCerrarDetalle = () => {
  showDetalleModal.value = false
  ventaSeleccionada.value = null
  listRef.value?.obtenerLista()
}

const handleNuevaVenta = () => {
  showNuevaVentaModal.value = true
}

const handleCerrarNuevaVenta = () => {
  showNuevaVentaModal.value = false
}

const handleVentaGuardada = () => {
  showNuevaVentaModal.value = false
  listRef.value?.obtenerLista()
}
</script>

<template>
  <div class="container-fluid" :class="{ 'fullscreen-container': fullscreenMode }">
    <!-- Header -->
    <div class="row mb-4">
      <div class="col-12">
        <div class="d-flex justify-content-between align-items-center flex-wrap gap-2">
          <div>
            <h2 class="mb-1">
              <i class="fas fa-shopping-cart text-primary mr-2"></i>
              Gestión de Ventas
            </h2>
            <p class="text-muted mb-0">
              Administra las ventas online y presenciales
            </p>
          </div>
          <div class="d-flex gap-2 flex-wrap">
            <!-- Botón Pantalla Completa -->
            <button 
              class="btn btn-outline-info"
              @click="toggleFullscreen"
              :title="fullscreenMode ? 'Salir de pantalla completa (ESC)' : 'Pantalla completa'"
            >
              <i :class="fullscreenMode ? 'fas fa-compress' : 'fas fa-expand'" class="mr-1"></i>
              {{ fullscreenMode ? 'Salir' : 'Expandir' }}
            </button>
            <router-link 
              v-if="!fullscreenMode"
              to="/dashboard" 
              class="btn btn-outline-secondary"
            >
              <i class="fas fa-arrow-left mr-1"></i> Volver
            </router-link>
            <button 
              class="btn btn-primary btn-lg"
              @click="handleNuevaVenta"
            >
              <i class="fas fa-plus mr-2"></i>
              Nueva Venta Presencial
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Indicador de modo pantalla completa -->
    <div v-if="fullscreenMode" class="fullscreen-indicator">
      <i class="fas fa-info-circle mr-2"></i>
      Modo pantalla completa · Presiona <kbd>ESC</kbd> para salir
    </div>

    <!-- Lista -->
    <div class="row">
      <div class="col-12">
        <VentaList 
          ref="listRef"
          @viewDetails="handleVerDetalles"
        />
      </div>
    </div>

    <!-- Modal de Nueva Venta -->
    <VentaSave
      :show="showNuevaVentaModal"
      @close="handleCerrarNuevaVenta"
      @saved="handleVentaGuardada"
    />

    <!-- Modal de Detalles -->
    <VentaDetalle
      :venta="ventaSeleccionada"
      :show="showDetalleModal"
      @close="handleCerrarDetalle"
    />
  </div>
</template>

<style scoped>
.border-left-primary {
  border-left: 4px solid #4e73df;
}

.border-left-success {
  border-left: 4px solid #1cc88a;
}

.border-left-info {
  border-left: 4px solid #36b9cc;
}

.border-left-warning {
  border-left: 4px solid #f6c23e;
}

.gap-2 {
  gap: 0.5rem;
}

.fullscreen-container {
  padding: 20px 30px !important;
}

.fullscreen-indicator {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 10px 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: slideIn 0.3s ease;
}

.fullscreen-indicator kbd {
  background: rgba(255, 255, 255, 0.2);
  padding: 2px 8px;
  border-radius: 4px;
  font-family: monospace;
  margin: 0 4px;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>

<!-- Estilos globales para el modo fullscreen -->
<style>
/* Cuando está en modo fullscreen, ocultar sidebar y topbar */
body.ventas-fullscreen-mode .sidebar {
  transform: translateX(-100%) !important;
  width: 0 !important;
  opacity: 0 !important;
  pointer-events: none !important;
}

body.ventas-fullscreen-mode .main-content {
  margin-left: 0 !important;
  transition: margin-left 0.3s ease;
}

body.ventas-fullscreen-mode .topbar {
  display: none !important;
}

body.ventas-fullscreen-mode .content {
  padding: 0 !important;
  min-height: 100vh !important;
}

/* Animación suave */
body.ventas-fullscreen-mode .dashboard-container {
  transition: all 0.3s ease;
}

/* Aumentar tamaño de letra en modo fullscreen */
body.ventas-fullscreen-mode .crud-table {
  font-size: 1rem !important;
}

body.ventas-fullscreen-mode .crud-table th {
  font-size: 1.05rem !important;
  padding: 14px 12px !important;
}

body.ventas-fullscreen-mode .crud-table td {
  font-size: 1rem !important;
  padding: 12px 10px !important;
}

body.ventas-fullscreen-mode .crud-title {
  font-size: 1.5rem !important;
}

body.ventas-fullscreen-mode .crud-badge {
  font-size: 0.9rem !important;
  padding: 6px 12px !important;
}

body.ventas-fullscreen-mode .precio-compact {
  font-size: 1.05rem !important;
}

body.ventas-fullscreen-mode h2 {
  font-size: 1.8rem !important;
}

body.ventas-fullscreen-mode .crud-header {
  padding: 1.25rem !important;
}

body.ventas-fullscreen-mode .crud-filter-select,
body.ventas-fullscreen-mode .crud-search-input {
  font-size: 1rem !important;
  padding: 10px 14px !important;
}
</style>
