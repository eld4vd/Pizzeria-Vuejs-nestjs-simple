<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import axios from '@/plugins/axios'
import type { Tamaño } from '@/models/tamaño'
import { useToast } from 'vue-toastification'

const toast = useToast()

const emit = defineEmits<{
  edit: [tamaño: Tamaño]
}>()

const tamaños = ref<Tamaño[]>([])
const loading = ref(false)
const searchTerm = ref('')

const obtenerLista = async () => {
  try {
    loading.value = true
    const response = await axios.get('/tamanos')
    // Ordenar por ID descendente (los más recientes primero)
    tamaños.value = response.data.sort((a: Tamaño, b: Tamaño) => b.id - a.id)
  } catch (error) {
    console.error('Error al obtener tamaños:', error)
    toast.error('Error al cargar la lista de tamaños')
  } finally {
    loading.value = false
  }
}

const filteredTamaños = computed(() => {
  if (!searchTerm.value) return tamaños.value
  
  const term = searchTerm.value.toLowerCase()
  return tamaños.value.filter(t => 
    t.nombre.toLowerCase().includes(term) ||
    (t.dimension && t.dimension.toLowerCase().includes(term))
  )
})

const handleEdit = (tamaño: Tamaño) => {
  emit('edit', tamaño)
}

const handleDelete = async (id: number, nombre: string) => {
  if (!confirm(`¿Está seguro de eliminar el tamaño "${nombre}"?`)) return

  try {
    await axios.delete(`/tamanos/${id}`)
    toast.success('Tamaño eliminado exitosamente')
    obtenerLista()
  } catch (error) {
    console.error('Error al eliminar:', error)
    toast.error('Error al eliminar el tamaño')
  }
}

onMounted(() => {
  obtenerLista()
})

defineExpose({ obtenerLista })
</script>

<template>
  <div class="crud-card">
    <div class="crud-header">
      <div class="row align-items-center">
        <div class="col-md-6">
          <h5 class="crud-title">
            <i class="fas fa-ruler-horizontal"></i>
            Lista de Tamaños
          </h5>
        </div>
        <div class="col-md-6">
          <input
            type="text"
            class="crud-search-input form-control"
            placeholder="🔍 Buscar tamaño..."
            v-model="searchTerm"
          />
        </div>
      </div>
    </div>

    <div class="crud-body">
      <div v-if="loading" class="crud-loading">
        <div class="spinner-border crud-spinner" role="status">
          <span class="sr-only">Cargando...</span>
        </div>
        <p class="mt-2 text-muted">Cargando tamaños...</p>
      </div>

      <div v-else-if="filteredTamaños.length === 0" class="crud-empty">
        <i class="fas fa-inbox crud-empty-icon"></i>
        <p class="crud-empty-text">No hay tamaños registrados</p>
      </div>

      <div v-else class="table-responsive">
        <table class="crud-table table">
          <thead>
            <tr>
              <th width="8%">#</th>
              <th width="25%">Nombre</th>
              <th width="20%">Dimensión</th>
              <th width="17%">Multiplicador</th>
              <th width="15%">Estado</th>
              <th width="15%" class="text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(tamaño, index) in filteredTamaños" :key="tamaño.id">
              <td><strong>{{ index + 1 }}</strong></td>
              <td>
                <strong style="color: #2c3e50;">{{ tamaño.nombre }}</strong>
              </td>
              <td>
                <span v-if="tamaño.dimension" style="color: #6c757d;">
                  {{ tamaño.dimension }}
                </span>
                <span v-else class="text-muted">-</span>
              </td>
              <td>
                <span class="crud-badge crud-badge-info">
                  <i class="fas fa-times"></i> {{ Number(tamaño.multiplicadorPrecio).toFixed(2) }}
                </span>
              </td>
              <td>
                <span 
                  class="crud-badge"
                  :class="tamaño.activo ? 'crud-badge-success' : 'crud-badge-secondary'"
                >
                  {{ tamaño.activo ? '✓ Activo' : '✗ Inactivo' }}
                </span>
              </td>
              <td class="text-center">
                <button
                  @click="handleEdit(tamaño)"
                  class="crud-btn-edit mr-1"
                  title="Editar tamaño"
                >
                  <i class="fas fa-edit"></i>
                </button>
                <button
                  @click="handleDelete(tamaño.id, tamaño.nombre)"
                  class="crud-btn-delete"
                  title="Eliminar tamaño"
                >
                  <i class="fas fa-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default { name: 'TamañoList' }
</script>
