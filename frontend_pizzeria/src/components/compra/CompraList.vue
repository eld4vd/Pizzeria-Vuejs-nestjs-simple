<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import axios from '@/plugins/axios'
import type { Compra } from '@/models/compra'

const toast = useToast()

const compras = ref<Compra[]>([])
const busqueda = ref('')
const cargando = ref(false)

const comprasFiltradas = computed(() => {
  if (!busqueda.value.trim()) return compras.value
  
  const termino = busqueda.value.toLowerCase()
  return compras.value.filter(c =>
    c.numeroCompra.toLowerCase().includes(termino) ||
    c.proveedor?.nombre.toLowerCase().includes(termino) ||
    c.proveedor?.empresa?.toLowerCase().includes(termino)
  )
})

const cargarCompras = async () => {
  try {
    cargando.value = true
    const response = await axios.get('/compras')
    compras.value = response.data
  } catch (error) {
    console.error('Error al cargar compras:', error)
    toast.error('Error al cargar la lista de compras')
  } finally {
    cargando.value = false
  }
}

const emit = defineEmits<{
  create: []
}>()

const nuevaCompra = () => {
  emit('create')
}

const formatearFecha = (fecha: Date | string) => {
  const date = typeof fecha === 'string' ? new Date(fecha) : fecha
  return date.toLocaleDateString('es-BO', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(() => {
  cargarCompras()
})

defineExpose({ cargarCompras })
</script>

<template>
  <div class="card shadow-sm">
    <div class="card-header d-flex justify-content-between align-items-center">
      <h5 class="mb-0">
        <i class="fas fa-shopping-cart mr-2"></i>
        Lista de Compras
      </h5>
      <button class="btn btn-primary btn-sm" @click="nuevaCompra">
        <i class="fas fa-plus mr-1"></i>
        Nueva Compra
      </button>
    </div>

    <div class="card-body">
      <!-- Buscador -->
      <div class="row mb-3">
        <div class="col-md-6">
          <div class="input-group">
            <div class="input-group-prepend">
              <span class="input-group-text">
                <i class="fas fa-search"></i>
              </span>
            </div>
            <input
              type="text"
              class="form-control"
              v-model="busqueda"
              placeholder="Buscar por número de compra o proveedor..."
            />
          </div>
        </div>
      </div>

      <!-- Tabla -->
      <div v-if="cargando" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="sr-only">Cargando...</span>
        </div>
      </div>

      <div v-else-if="comprasFiltradas.length === 0" class="text-center py-5">
        <i class="fas fa-inbox fa-3x text-muted mb-3"></i>
        <p class="text-muted">
          {{ busqueda ? 'No se encontraron compras con ese criterio' : 'No hay compras registradas' }}
        </p>
      </div>

      <div v-else class="table-responsive">
        <table class="table table-hover table-sm">
          <thead class="thead-light">
            <tr>
              <th width="5%">#</th>
              <th width="15%">Número Compra</th>
              <th width="15%">Fecha</th>
              <th width="20%">Proveedor</th>
              <th width="15%">Total</th>
              <th width="30%">Notas</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(compra, index) in comprasFiltradas" :key="compra.id">
              <td>{{ index + 1 }}</td>
              <td>
                <strong class="text-primary">{{ compra.numeroCompra }}</strong>
              </td>
              <td>
                <small>
                  <i class="far fa-calendar mr-1"></i>
                  {{ formatearFecha(compra.fechaCompra) }}
                </small>
              </td>
              <td>
                <div>
                  <strong>{{ compra.proveedor?.nombre || 'N/A' }}</strong>
                  <br>
                  <small class="text-muted">{{ compra.proveedor?.empresa }}</small>
                </div>
              </td>
              <td>
                <span class="badge badge-success">
                  Bs. {{ Number(compra.total).toFixed(2) }}
                </span>
              </td>
              <td>
                <small>{{ compra.notas || '-' }}</small>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Resumen -->
      <div class="mt-3 text-muted">
        <small>
          <i class="fas fa-info-circle mr-1"></i>
          Mostrando {{ comprasFiltradas.length }} de {{ compras.length }} compras
        </small>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card-header {
  background-color: #f8f9fa;
  border-bottom: 2px solid #dee2e6;
}

.table-hover tbody tr:hover {
  background-color: #f1f3f5;
  cursor: pointer;
}

.btn-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
}

.badge {
  font-size: 0.85rem;
  padding: 0.4rem 0.6rem;
}
</style>
