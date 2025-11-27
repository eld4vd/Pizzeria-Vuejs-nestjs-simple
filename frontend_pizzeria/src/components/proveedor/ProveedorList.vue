<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import axios from '@/plugins/axios'
import type { Proveedor } from '@/models/proveedor'

const toast = useToast()

const proveedores = ref<Proveedor[]>([])
const busqueda = ref('')
const cargando = ref(false)

const proveedoresFiltrados = computed(() => {
  if (!busqueda.value.trim()) return proveedores.value
  
  const termino = busqueda.value.toLowerCase()
  return proveedores.value.filter(p =>
    p.nombre.toLowerCase().includes(termino) ||
    p.empresa?.toLowerCase().includes(termino) ||
    p.nit?.toLowerCase().includes(termino) ||
    p.telefono?.includes(termino)
  )
})

const cargarProveedores = async () => {
  try {
    cargando.value = true
    const response = await axios.get('/proveedores')
    proveedores.value = response.data
  } catch (error) {
    console.error('Error al cargar proveedores:', error)
    toast.error('Error al cargar la lista de proveedores')
  } finally {
    cargando.value = false
  }
}

const emit = defineEmits<{
  edit: [proveedor: Proveedor]
  create: []
}>()

const editarProveedor = (proveedor: Proveedor) => {
  emit('edit', proveedor)
}

const nuevoProveedor = () => {
  emit('create')
}

const confirmarEliminar = async (proveedor: Proveedor) => {
  if (!confirm(`¿Está seguro de eliminar al proveedor "${proveedor.nombre}"?`)) {
    return
  }

  try {
    await axios.delete(`/proveedores/${proveedor.id}`)
    toast.success('Proveedor eliminado exitosamente')
    await cargarProveedores()
  } catch (error: any) {
    console.error('Error al eliminar:', error)
    const message = error.response?.data?.message || 'Error al eliminar el proveedor'
    toast.error(Array.isArray(message) ? message.join(', ') : message)
  }
}

onMounted(() => {
  cargarProveedores()
})

defineExpose({ cargarProveedores })
</script>

<template>
  <div class="card shadow-sm">
    <div class="card-header d-flex justify-content-between align-items-center">
      <h5 class="mb-0">
        <i class="fas fa-truck mr-2"></i>
        Lista de Proveedores
      </h5>
      <button class="btn btn-primary btn-sm" @click="nuevoProveedor">
        <i class="fas fa-plus mr-1"></i>
        Nuevo Proveedor
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
              placeholder="Buscar por nombre, empresa, NIT o teléfono..."
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

      <div v-else-if="proveedoresFiltrados.length === 0" class="text-center py-5">
        <i class="fas fa-inbox fa-3x text-muted mb-3"></i>
        <p class="text-muted">
          {{ busqueda ? 'No se encontraron proveedores con ese criterio' : 'No hay proveedores registrados' }}
        </p>
      </div>

      <div v-else class="table-responsive">
        <table class="table table-hover table-sm">
          <thead class="thead-light">
            <tr>
              <th width="3%">#</th>
              <th width="15%">Nombre</th>
              <th width="15%">Empresa</th>
              <th width="10%">NIT</th>
              <th width="10%">Teléfono</th>
              <th width="17%">Email</th>
              <th width="20%">Dirección</th>
              <th width="10%" class="text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(proveedor, index) in proveedoresFiltrados" :key="proveedor.id">
              <td>{{ index + 1 }}</td>
              <td>
                <strong>{{ proveedor.nombre }}</strong>
              </td>
              <td>{{ proveedor.empresa }}</td>
              <td>
                <small>{{ proveedor.nit || '-' }}</small>
              </td>
              <td>
                <small>
                  <i class="fas fa-phone mr-1"></i>
                  {{ proveedor.telefono }}
                </small>
              </td>
              <td>
                <small v-if="proveedor.email">
                  <i class="fas fa-envelope mr-1"></i>
                  {{ proveedor.email }}
                </small>
                <span v-else class="text-muted">-</span>
              </td>
              <td>
                <small>{{ proveedor.direccion || '-' }}</small>
              </td>
              <td class="text-center">
                <button
                  class="btn btn-sm btn-info mr-1"
                  @click="editarProveedor(proveedor)"
                  title="Editar"
                >
                  <i class="fas fa-edit"></i>
                </button>
                <button
                  class="btn btn-sm btn-danger"
                  @click="confirmarEliminar(proveedor)"
                  title="Eliminar"
                >
                  <i class="fas fa-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Resumen -->
      <div class="mt-3 text-muted">
        <small>
          <i class="fas fa-info-circle mr-1"></i>
          Mostrando {{ proveedoresFiltrados.length }} de {{ proveedores.length }} proveedores
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
</style>
