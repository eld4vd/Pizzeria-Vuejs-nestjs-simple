<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import axios from '@/plugins/axios'
import type { Ingrediente } from '@/models/ingrediente'
import { useToast } from 'vue-toastification'

const toast = useToast()

const emit = defineEmits<{
  edit: [ingrediente: Ingrediente]
}>()

const ingredientes = ref<Ingrediente[]>([])
const loading = ref(false)
const searchTerm = ref('')

const obtenerLista = async () => {
  try {
    loading.value = true
    const response = await axios.get('/ingredientes')
    // Ordenar por ID descendente (los más recientes primero)
    ingredientes.value = response.data.sort((a: Ingrediente, b: Ingrediente) => b.id - a.id)
  } catch (error) {
    console.error('Error al obtener ingredientes:', error)
    toast.error('Error al cargar la lista de ingredientes')
  } finally {
    loading.value = false
  }
}

const filteredIngredientes = computed(() => {
  if (!searchTerm.value) return ingredientes.value
  
  const term = searchTerm.value.toLowerCase()
  return ingredientes.value.filter(i => 
    i.nombre.toLowerCase().includes(term) ||
    (i.descripcion && i.descripcion.toLowerCase().includes(term)) ||
    (i.unidadMedida && i.unidadMedida.toLowerCase().includes(term))
  )
})

const handleEdit = (ingrediente: Ingrediente) => {
  emit('edit', ingrediente)
}

const handleDelete = async (id: number, nombre: string) => {
  if (!confirm(`¿Está seguro de eliminar el ingrediente "${nombre}"?`)) return

  try {
    await axios.delete(`/ingredientes/${id}`)
    toast.success('Ingrediente eliminado exitosamente')
    obtenerLista()
  } catch (error) {
    console.error('Error al eliminar:', error)
    toast.error('Error al eliminar el ingrediente')
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
            <i class="fas fa-leaf"></i>
            Lista de Ingredientes
          </h5>
        </div>
        <div class="col-md-6">
          <input
            type="text"
            class="crud-search-input form-control"
            placeholder="🔍 Buscar ingrediente..."
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
        <p class="mt-2 text-muted">Cargando ingredientes...</p>
      </div>

      <div v-else-if="filteredIngredientes.length === 0" class="crud-empty">
        <i class="fas fa-inbox crud-empty-icon"></i>
        <p class="crud-empty-text">No hay ingredientes registrados</p>
      </div>

      <div v-else class="table-responsive">
        <table class="crud-table crud-table-compact table">
          <thead>
            <tr>
              <th width="4%">#</th>
              <th width="25%">Ingrediente</th>
              <th width="25%">Descripción</th>
              <th width="12%">Unidad</th>
              <th width="10%">Stock</th>
              <th width="12%">Estado</th>
              <th width="12%" class="text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(ingrediente, index) in filteredIngredientes" :key="ingrediente.id">
              <td><strong>{{ index + 1 }}</strong></td>
              <td>
                <div class="producto-compact">
                  <img 
                    v-if="ingrediente.imagenUrl"
                    :src="ingrediente.imagenUrl" 
                    :alt="ingrediente.nombre"
                    class="producto-compact-img"
                  />
                  <div class="producto-compact-info">
                    <span class="producto-compact-name">
                      {{ ingrediente.nombre }}
                      <span v-if="ingrediente.esAlergeno" class="ingredient-mini alergeno ml-1" style="font-size: 0.7rem;">
                        <i class="fas fa-exclamation-triangle"></i> Alérgeno
                      </span>
                    </span>
                  </div>
                </div>
              </td>
              <td>
                <small style="color: #6c757d; font-size: 0.8rem;">
                  {{ ingrediente.descripcion || '-' }}
                </small>
              </td>
              <td>
                <span v-if="ingrediente.unidadMedida" class="crud-badge crud-badge-compact crud-badge-info">
                  {{ ingrediente.unidadMedida }}
                </span>
                <span v-else class="text-muted" style="font-size: 0.8rem;">-</span>
              </td>
              <td>
                <span 
                  class="crud-badge crud-badge-compact"
                  :class="ingrediente.stock > 0 ? 'crud-badge-success' : (ingrediente.stock === 0 ? 'crud-badge-warning' : 'crud-badge-danger')"
                  style="font-size: 0.9rem; font-weight: 600;"
                >
                  {{ Number(ingrediente.stock).toFixed(2) }}
                </span>
              </td>
              <td>
                <span 
                  class="crud-badge crud-badge-compact"
                  :class="ingrediente.disponible ? 'crud-badge-success' : 'crud-badge-secondary'"
                >
                  {{ ingrediente.disponible ? '✓' : '✗' }}
                </span>
              </td>
              <td class="text-center">
                <button
                  @click="handleEdit(ingrediente)"
                  class="crud-btn-edit crud-btn-compact mr-1"
                  title="Editar ingrediente"
                >
                  <i class="fas fa-edit"></i>
                </button>
                <button
                  @click="handleDelete(ingrediente.id, ingrediente.nombre)"
                  class="crud-btn-delete crud-btn-compact"
                  title="Eliminar ingrediente"
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
export default { name: 'IngredienteList' }
</script>
