<script setup lang="ts">
import type { Categoria } from '@/models/categoria'
import http from '@/plugins/axios'
import { computed, onMounted, ref } from 'vue'

const ENDPOINT = 'categorias'
const categorias = ref<Categoria[]>([])
const emit = defineEmits(['edit'])
const categoriaDelete = ref<Categoria | null>(null)
const mostrarConfirmDialog = ref<boolean>(false)
const busqueda = ref<string>('')

async function obtenerLista() {
  categorias.value = await http.get(ENDPOINT).then((response) => {
    // Ordenar por ID descendente (los más recientes primero)
    return response.data.sort((a: Categoria, b: Categoria) => b.id - a.id)
  })
}

const categoriasFiltradas = computed(() => {
  return categorias.value.filter(
    (categoria) =>
      categoria.nombre.toLowerCase().includes(busqueda.value.toLowerCase()) ||
      (categoria.descripcion && categoria.descripcion.toLowerCase().includes(busqueda.value.toLowerCase())),
  )
})

function emitirEdicion(categoria: Categoria) {
  emit('edit', categoria)
}

function mostrarEliminarConfirm(categoria: Categoria) {
  categoriaDelete.value = categoria
  mostrarConfirmDialog.value = true
}

async function eliminar() {
  await http.delete(`${ENDPOINT}/${categoriaDelete.value?.id}`)
  obtenerLista()
  mostrarConfirmDialog.value = false
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
            <i class="fas fa-tags"></i>
            Lista de Categorías
          </h5>
        </div>
        <div class="col-md-6">
          <input
            type="text"
            class="crud-search-input form-control"
            placeholder="🔍 Buscar por nombre o descripción..."
            v-model="busqueda"
          />
        </div>
      </div>
    </div>

    <div class="crud-body">
      <div v-if="categoriasFiltradas.length === 0" class="crud-empty">
        <i class="fas fa-inbox crud-empty-icon"></i>
        <p class="crud-empty-text">No se encontraron categorías</p>
      </div>

      <div v-else class="table-responsive">
        <table class="crud-table table">
          <thead>
            <tr>
              <th width="5%">#</th>
              <th width="20%">Categoría</th>
              <th width="30%">Descripción</th>
              <th width="10%">Orden</th>
              <th width="12%">Estado</th>
              <th width="13%" class="text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(categoria, index) in categoriasFiltradas" :key="categoria.id">
              <td><strong>{{ index + 1 }}</strong></td>
              <td>
                <div class="d-flex align-items-center">
                  <img 
                    v-if="categoria.imagenUrl" 
                    :src="categoria.imagenUrl" 
                    :alt="categoria.nombre"
                    class="crud-img-thumbnail mr-2"
                    style="width: 50px; height: 50px;"
                  />
                  <div>
                    <strong style="color: #2c3e50;">{{ categoria.nombre }}</strong>
                  </div>
                </div>
              </td>
              <td>
                <small style="color: #6c757d;">
                  {{ categoria.descripcion || 'Sin descripción' }}
                </small>
              </td>
              <td>
                <span class="crud-badge crud-badge-info">
                  {{ categoria.orden }}
                </span>
              </td>
              <td>
                <span 
                  class="crud-badge"
                  :class="categoria.activo ? 'crud-badge-success' : 'crud-badge-secondary'"
                >
                  {{ categoria.activo ? '✓ Activo' : '✗ Inactivo' }}
                </span>
              </td>
              <td class="text-center">
                <button
                  @click="emitirEdicion(categoria)"
                  class="crud-btn-edit mr-1"
                  title="Editar categoría"
                >
                  <i class="fas fa-edit"></i>
                </button>
                <button
                  @click="mostrarEliminarConfirm(categoria)"
                  class="crud-btn-delete"
                  title="Eliminar categoría"
                >
                  <i class="fas fa-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal de confirmación -->
    <div v-if="mostrarConfirmDialog" class="modal-overlay" @click="mostrarConfirmDialog = false">
      <div class="confirm-modal" @click.stop>
        <div class="confirm-modal-header">
          <i class="fas fa-exclamation-triangle text-warning"></i>
          <h3>Confirmar Eliminación</h3>
        </div>
        <div class="confirm-modal-body">
          <p>¿Está seguro que desea eliminar la categoría <strong>{{ categoriaDelete?.nombre }}</strong>?</p>
          <p class="text-danger"><small>Esta acción no se puede deshacer.</small></p>
        </div>
        <div class="confirm-modal-footer">
          <button @click="mostrarConfirmDialog = false" class="btn btn-secondary">
            <i class="fas fa-times"></i> Cancelar
          </button>
          <button @click="eliminar" class="btn btn-danger">
            <i class="fas fa-trash"></i> Eliminar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Modal de confirmación */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.confirm-modal {
  background: #ffffff;
  border-radius: 12px;
  max-width: 500px;
  width: 90%;
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

.confirm-modal-header {
  padding: 20px 25px;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  align-items: center;
  gap: 12px;
}

.confirm-modal-header i {
  font-size: 28px;
}

.confirm-modal-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #2c3e50;
}

.confirm-modal-body {
  padding: 25px;
}

.confirm-modal-body p {
  margin: 0 0 12px 0;
  color: #2c3e50;
  line-height: 1.6;
}

.confirm-modal-footer {
  padding: 15px 25px;
  border-top: 1px solid #e0e0e0;
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.btn {
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.btn-secondary {
  background: #e0e0e0;
  color: #333;
}

.btn-secondary:hover {
  background: #d0d0d0;
}

.btn-danger {
  background: #c62828;
  color: #ffffff;
}

.btn-danger:hover {
  background: #b71c1c;
}
</style>
