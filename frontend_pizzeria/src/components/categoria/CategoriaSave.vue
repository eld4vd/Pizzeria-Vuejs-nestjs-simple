<script setup lang="ts">
import type { Categoria } from '@/models/categoria'
import http from '@/plugins/axios'
import { computed, ref, watch } from 'vue'
import { useToast } from 'vue-toastification'

const toast = useToast()
const ENDPOINT = 'categorias'
const props = defineProps({
  mostrar: Boolean,
  categoria: {
    type: Object as () => Categoria,
    default: () => ({}) as Categoria,
  },
  modoEdicion: Boolean,
})
const emit = defineEmits(['guardar', 'close'])

const dialogVisible = computed({
  get: () => props.mostrar,
  set: (value) => {
    if (!value) emit('close')
  },
})

const categoria = ref<Categoria>({ ...props.categoria })

watch(
  () => props.categoria,
  (newVal) => {
    if (newVal && Object.keys(newVal).length > 0) {
      categoria.value = { 
        ...newVal,
        orden: newVal.orden ? Number(newVal.orden) : 0
      }
    }
  },
)

async function handleSave() {
  try {
    const body = {
      nombre: categoria.value.nombre.trim(),
      descripcion: categoria.value.descripcion?.trim() || null,
      imagenUrl: categoria.value.imagenUrl?.trim() || null,
      activo: categoria.value.activo,
      orden: Number(categoria.value.orden),
      requierePersonalizacion: categoria.value.requierePersonalizacion || false,
    }
    if (props.modoEdicion) {
      await http.patch(`${ENDPOINT}/${categoria.value.id}`, body)
      toast.success('Categoría actualizada exitosamente')
    } else {
      await http.post(ENDPOINT, body)
      toast.success('Categoría creada exitosamente')
    }
    emit('guardar')
    categoria.value = {} as Categoria
    dialogVisible.value = false
  } catch (error: any) {
    toast.error(error?.response?.data?.message || 'Error al guardar la categoría')
  }
}
</script>

<template>
  <div 
    v-if="dialogVisible" 
    class="modal fade show categoria-modal-wrapper" 
    style="display: block; background: rgba(0,0,0,0.5);"
    @click.self="dialogVisible = false"
  >
    <div class="modal-dialog modal-lg modal-dialog-scrollable">
      <div class="modal-content categoria-modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            <i class="fas" :class="props.modoEdicion ? 'fa-edit' : 'fa-plus-circle'" style="margin-right: 10px;"></i>
            {{ props.modoEdicion ? 'Editar Categoría' : 'Nueva Categoría' }}
          </h5>
          <button type="button" class="close" @click="dialogVisible = false">
            <span>&times;</span>
          </button>
        </div>

        <form @submit.prevent="handleSave">
          <div class="modal-body">
          <div class="form-group">
            <label for="nombre" class="form-label">
              <i class="fas fa-tag"></i>
              Nombre <span class="text-danger">*</span>
            </label>
            <input
              id="nombre"
              v-model="categoria.nombre"
              type="text"
              class="form-control"
              placeholder="Ej: Pizzas Clásicas"
              required
              maxlength="100"
            />
          </div>

          <div class="form-group">
            <label for="descripcion" class="form-label">
              <i class="fas fa-align-left"></i>
              Descripción
            </label>
            <textarea
              id="descripcion"
              v-model="categoria.descripcion"
              class="form-control"
              rows="3"
              placeholder="Descripción de la categoría..."
              maxlength="500"
            ></textarea>
            <small class="form-text text-muted">
              {{ categoria.descripcion?.length || 0 }}/500 caracteres
            </small>
          </div>

          <div class="form-group">
            <label for="imagenUrl">
              URL de Imagen
            </label>
            <input
              id="imagenUrl"
              v-model="categoria.imagenUrl"
              type="url"
              class="form-control"
              placeholder="https://ejemplo.com/imagen.jpg"
              maxlength="255"
            />
            <small class="form-text text-muted">
              Opcional: URL de la imagen de la categoría
            </small>
          </div>

          <!-- Vista previa de imagen -->
          <div v-if="categoria.imagenUrl" class="form-group">
            <label>Vista Previa:</label>
            <div class="text-center">
              <img 
                :src="categoria.imagenUrl" 
                alt="Vista previa"
                class="img-thumbnail"
                style="max-width: 300px; max-height: 200px; object-fit: cover;"
                @error="categoria.imagenUrl = ''"
              />
            </div>
          </div>

          <div class="row">
            <div class="col-md-6">
              <div class="form-group">
                <label for="orden">
                  Orden de visualización
                </label>
                <input
                  id="orden"
                  v-model.number="categoria.orden"
                  type="number"
                  class="form-control"
                  placeholder="0"
                  min="0"
                />
                <small class="form-text text-muted">
                  Menor número aparece primero
                </small>
              </div>
            </div>

            <div class="col-md-6">
              <div class="form-group">
                <label>Estado</label>
                <div class="custom-control custom-switch" style="padding-top: 8px;">
                  <input
                    type="checkbox"
                    class="custom-control-input"
                    id="activo"
                    v-model="categoria.activo"
                  />
                  <label class="custom-control-label" for="activo">
                    <i class="fas fa-check-circle text-success mr-1"></i>
                    {{ categoria.activo ? 'Activo' : 'Inactivo' }}
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">
              <i class="fas fa-cogs"></i>
              Tipo de Productos
            </label>
            <div class="custom-control custom-switch">
              <input
                type="checkbox"
                class="custom-control-input"
                id="requierePersonalizacion"
                v-model="categoria.requierePersonalizacion"
              />
              <label class="custom-control-label" for="requierePersonalizacion">
                <i class="fas" :class="categoria.requierePersonalizacion ? 'fa-pizza-slice text-warning' : 'fa-glass-whiskey text-info'" style="margin-right: 5px;"></i>
                {{ categoria.requierePersonalizacion ? 'Requiere personalización (Tamaño + Ingredientes)' : 'Producto simple (Solo precio)' }}
              </label>
            </div>
            <small class="form-text text-muted">
              <strong>Activado:</strong> Para pizzas, calzones (requiere tamaño e ingredientes)<br>
              <strong>Desactivado:</strong> Para bebidas, postres simples (solo nombre y precio)
            </small>
          </div>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="dialogVisible = false">
              <i class="fas fa-times mr-1"></i> Cancelar
            </button>
            <button type="submit" class="btn btn-primary">
              <i class="fas fa-save mr-1"></i>
              {{ props.modoEdicion ? 'Actualizar' : 'Guardar' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style>
/* Estilos específicos para el modal de categorías - SIN SCOPED para mayor prioridad */

/* Modal wrapper */
.categoria-modal-wrapper .modal-dialog {
  max-height: 90vh !important;
  margin: 1.75rem auto !important;
  display: flex !important;
  align-items: center !important;
}

.categoria-modal-wrapper .modal-dialog-scrollable {
  height: auto !important;
  max-height: calc(100vh - 3.5rem) !important;
}

.categoria-modal-wrapper .modal-dialog-scrollable .modal-content {
  max-height: calc(100vh - 3.5rem) !important;
  overflow: hidden !important;
}

.categoria-modal-wrapper .modal-dialog-scrollable .modal-body {
  overflow-y: auto !important;
  max-height: calc(100vh - 250px) !important;
}

/* Animaciones */
.categoria-modal-wrapper.modal.show {
  animation: fadeIn 0.3s ease;
  overflow-y: auto !important;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.categoria-modal-content.modal-content {
  animation: slideUp 0.3s ease;
  border: none !important;
  border-radius: 12px !important;
  overflow: hidden !important;
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

/* Header del modal */
.categoria-modal-wrapper .modal-header {
  background: #fca100 !important;
  color: #ffffff !important;
  border-bottom: 3px solid #e89100 !important;
}

.categoria-modal-wrapper .modal-title {
  font-weight: 600 !important;
  font-size: 1.25rem !important;
  color: #ffffff !important;
}

.categoria-modal-wrapper .modal-header .close {
  color: #ffffff !important;
  opacity: 0.9 !important;
  text-shadow: none !important;
}

.categoria-modal-wrapper .modal-header .close:hover {
  opacity: 1 !important;
}

/* Body del modal */
.categoria-modal-wrapper .modal-body {
  padding: 25px !important;
  background: #ffffff !important;
}

/* Scrollbar personalizado para el modal body */
.categoria-modal-wrapper .modal-body::-webkit-scrollbar {
  width: 8px;
}

.categoria-modal-wrapper .modal-body::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.categoria-modal-wrapper .modal-body::-webkit-scrollbar-thumb {
  background: #fca100;
  border-radius: 10px;
}

.categoria-modal-wrapper .modal-body::-webkit-scrollbar-thumb:hover {
  background: #e89100;
}

/* Labels mejorados */
.categoria-modal-wrapper .form-group label {
  font-weight: 600 !important;
  color: #2c3e50 !important;
  margin-bottom: 8px !important;
  font-size: 0.95rem !important;
}

/* Inputs con mejor contraste */
.categoria-modal-wrapper .form-control {
  border: 2px solid #e0e0e0 !important;
  border-radius: 8px !important;
  padding: 10px 15px !important;
  font-size: 0.95rem !important;
  transition: all 0.3s ease !important;
  background-color: #ffffff !important;
  color: #2c3e50 !important;
}

.categoria-modal-wrapper .form-control:focus {
  border-color: #fca100 !important;
  box-shadow: 0 0 0 0.2rem rgba(252, 161, 0, 0.15) !important;
  background-color: #ffffff !important;
  color: #2c3e50 !important;
}

.categoria-modal-wrapper .form-control::placeholder {
  color: #95a5a6 !important;
  opacity: 1 !important;
}

/* Textarea */
.categoria-modal-wrapper textarea.form-control {
  resize: vertical !important;
  min-height: 80px !important;
  background-color: #ffffff !important;
  color: #2c3e50 !important;
}

.categoria-modal-wrapper textarea.form-control:focus {
  background-color: #ffffff !important;
  color: #2c3e50 !important;
}

/* Custom switches */
.categoria-modal-wrapper .custom-switch {
  padding-left: 2.5rem !important;
  margin-bottom: 1rem !important;
}

.categoria-modal-wrapper .custom-control-label {
  font-weight: 500 !important;
  color: #2c3e50 !important;
  cursor: pointer !important;
  padding-top: 2px !important;
}

.categoria-modal-wrapper .custom-switch .custom-control-input:checked ~ .custom-control-label::before {
  background-color: #fca100 !important;
  border-color: #fca100 !important;
}

/* Vista previa de imagen */
.categoria-modal-wrapper .img-thumbnail {
  border: 2px solid #e0e0e0 !important;
  border-radius: 8px !important;
  padding: 8px !important;
}

/* Texto de ayuda */
.categoria-modal-wrapper .text-muted {
  font-size: 0.875rem !important;
  color: #6c757d !important;
}

/* Asterisco requerido */
.categoria-modal-wrapper .text-danger {
  color: #e74c3c !important;
}

/* Footer mejorado */
.categoria-modal-wrapper .modal-footer {
  background: #f8f9fa !important;
  border-top: 1px solid #e0e0e0 !important;
  padding: 15px 25px !important;
}

/* Botones */
.categoria-modal-wrapper .btn {
  padding: 10px 24px !important;
  font-weight: 600 !important;
  border-radius: 8px !important;
  transition: all 0.3s ease !important;
}

.categoria-modal-wrapper .btn-primary {
  background-color: #fca100 !important;
  border-color: #fca100 !important;
  color: #ffffff !important;
}

.categoria-modal-wrapper .btn-primary:hover {
  background-color: #e89100 !important;
  border-color: #e89100 !important;
  transform: translateY(-2px) !important;
  box-shadow: 0 4px 12px rgba(252, 161, 0, 0.3) !important;
}

.categoria-modal-wrapper .btn-secondary {
  background-color: #6c757d !important;
  border-color: #6c757d !important;
  color: #ffffff !important;
}

.categoria-modal-wrapper .btn-secondary:hover {
  background-color: #5a6268 !important;
  border-color: #545b62 !important;
  transform: translateY(-2px) !important;
}

</style>
