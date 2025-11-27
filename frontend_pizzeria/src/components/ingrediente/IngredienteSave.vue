<script setup lang="ts">
import { ref, watch } from 'vue'
import axios from '@/plugins/axios'
import type { Ingrediente } from '@/models/ingrediente'
import { useToast } from 'vue-toastification'

const toast = useToast()

interface Props {
  ingrediente?: Ingrediente | null
}

const props = defineProps<Props>()
const emit = defineEmits<{
  saved: []
  cancel: []
}>()

const showModal = ref(false)
const form = ref({
  nombre: '',
  descripcion: '',
  unidadMedida: '',
  imagenUrl: '',
  disponible: true,
  esAlergeno: false
})

const isEditing = ref(false)
const editingId = ref<number | null>(null)

watch(() => props.ingrediente, (newVal) => {
  if (newVal) {
    isEditing.value = true
    editingId.value = newVal.id
    form.value = {
      nombre: newVal.nombre,
      descripcion: newVal.descripcion || '',
      unidadMedida: newVal.unidadMedida || '',
      imagenUrl: newVal.imagenUrl || '',
      disponible: newVal.disponible,
      esAlergeno: newVal.esAlergeno
    }
    showModal.value = true
  }
}, { immediate: true })

const abrir = () => {
  resetForm()
  showModal.value = true
}

const cerrar = () => {
  showModal.value = false
  resetForm()
  emit('cancel')
}

const resetForm = () => {
  isEditing.value = false
  editingId.value = null
  form.value = {
    nombre: '',
    descripcion: '',
    unidadMedida: '',
    imagenUrl: '',
    disponible: true,
    esAlergeno: false
  }
}

const guardar = async () => {
  if (!form.value.nombre.trim()) {
    toast.warning('El nombre es obligatorio')
    return
  }

  if (!form.value.unidadMedida || !form.value.unidadMedida.trim()) {
    toast.warning('La unidad de medida es obligatoria')
    return
  }

  try {
    const data = {
      nombre: form.value.nombre.trim(),
      descripcion: form.value.descripcion.trim() || null,
      unidadMedida: form.value.unidadMedida.trim(),
      imagenUrl: form.value.imagenUrl.trim() || null,
      disponible: form.value.disponible,
      esAlergeno: form.value.esAlergeno
    }

    if (isEditing.value && editingId.value) {
      await axios.patch(`/ingredientes/${editingId.value}`, data)
      toast.success('Ingrediente actualizado exitosamente')
    } else {
      await axios.post('/ingredientes', data)
      toast.success('Ingrediente creado exitosamente')
    }

    cerrar()
    emit('saved')
  } catch (error: any) {
    console.error('Error al guardar:', error)
    const message = error.response?.data?.message || 'Error al guardar el ingrediente'
    toast.error(Array.isArray(message) ? message.join(', ') : message)
  }
}

defineExpose({ abrir })
</script>

<template>
  <div 
    v-if="showModal" 
    class="modal fade show ingrediente-modal-wrapper" 
    style="display: block; background: rgba(0,0,0,0.5);"
    @click.self="cerrar"
  >
    <div class="modal-dialog modal-lg modal-dialog-scrollable">
      <div class="modal-content ingrediente-modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            <i class="fas fa-leaf mr-2"></i>
            {{ isEditing ? 'Editar Ingrediente' : 'Nuevo Ingrediente' }}
          </h5>
          <button type="button" class="close" @click="cerrar">
            <span>&times;</span>
          </button>
        </div>

        <form @submit.prevent="guardar">
          <div class="modal-body">
            <div class="row">
              <div class="col-md-6">
                <div class="form-group">
                  <label for="nombre">
                    Nombre <span class="text-danger">*</span>
                  </label>
                  <input
                    id="nombre"
                    type="text"
                    class="form-control"
                    v-model="form.nombre"
                    placeholder="Ej: Tomate, Queso Mozzarella"
                    maxlength="100"
                    required
                  />
                </div>
              </div>

              <div class="col-md-6">
                <div class="form-group">
                  <label for="unidadMedida">
                    Unidad de Medida <span class="text-danger">*</span>
                  </label>
                  <input
                    id="unidadMedida"
                    type="text"
                    class="form-control"
                    v-model="form.unidadMedida"
                    placeholder="Ej: kg, litros, unidades"
                    maxlength="50"
                    required
                  />
                  <small class="form-text text-muted">
                    <i class="fas fa-info-circle mr-1"></i>
                    La unidad se usará en compras y recetas
                  </small>
                </div>
              </div>
            </div>

            <div class="form-group">
              <label for="descripcion">Descripción</label>
              <textarea
                id="descripcion"
                class="form-control"
                v-model="form.descripcion"
                rows="2"
                placeholder="Descripción del ingrediente..."
                maxlength="255"
              ></textarea>
              <small class="form-text text-muted">Opcional</small>
            </div>

            <div class="form-group">
              <label for="imagenUrl">URL de Imagen</label>
              <input
                id="imagenUrl"
                type="url"
                class="form-control"
                v-model="form.imagenUrl"
                placeholder="https://ejemplo.com/imagen.jpg"
                maxlength="255"
              />
              <small class="form-text text-muted">
                Opcional: URL de la imagen del ingrediente
              </small>
            </div>

            <!-- Vista previa de imagen -->
            <div v-if="form.imagenUrl" class="form-group">
              <label>Vista Previa:</label>
              <div class="text-center">
                <img 
                  :src="form.imagenUrl" 
                  alt="Vista previa"
                  class="img-thumbnail"
                  style="max-width: 300px; max-height: 200px; object-fit: cover;"
                  @error="form.imagenUrl = ''"
                />
              </div>
            </div>

            <div class="row">
              <div class="col-md-6">
                <div class="custom-control custom-switch">
                  <input
                    type="checkbox"
                    class="custom-control-input"
                    id="disponible"
                    v-model="form.disponible"
                  />
                  <label class="custom-control-label" for="disponible">
                    <i class="fas fa-check-circle text-success mr-1"></i>
                    Disponible
                  </label>
                </div>
              </div>

              <div class="col-md-6">
                <div class="custom-control custom-switch">
                  <input
                    type="checkbox"
                    class="custom-control-input"
                    id="esAlergeno"
                    v-model="form.esAlergeno"
                  />
                  <label class="custom-control-label" for="esAlergeno">
                    <i class="fas fa-exclamation-triangle text-danger mr-1"></i>
                    Es Alérgeno
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="cerrar">
              <i class="fas fa-times mr-1"></i> Cancelar
            </button>
            <button type="submit" class="btn btn-primary">
              <i class="fas fa-save mr-1"></i>
              {{ isEditing ? 'Actualizar' : 'Guardar' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style>
/* Estilos específicos para el modal de ingredientes - SIN SCOPED para mayor prioridad */

/* Modal wrapper */
.ingrediente-modal-wrapper .modal-dialog {
  max-height: 90vh !important;
  margin: 1.75rem auto !important;
  display: flex !important;
  align-items: center !important;
}

.ingrediente-modal-wrapper .modal-dialog-scrollable {
  height: auto !important;
  max-height: calc(100vh - 3.5rem) !important;
}

.ingrediente-modal-wrapper .modal-dialog-scrollable .modal-content {
  max-height: calc(100vh - 3.5rem) !important;
  overflow: hidden !important;
}

.ingrediente-modal-wrapper .modal-dialog-scrollable .modal-body {
  overflow-y: auto !important;
  max-height: calc(100vh - 250px) !important;
}

/* Animaciones */
.ingrediente-modal-wrapper.modal.show {
  animation: fadeIn 0.3s ease;
  overflow-y: auto !important;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.ingrediente-modal-content.modal-content {
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
.ingrediente-modal-wrapper .modal-header {
  background: #fca100 !important;
  color: #ffffff !important;
  border-bottom: 3px solid #e89100 !important;
}

.ingrediente-modal-wrapper .modal-title {
  font-weight: 600 !important;
  font-size: 1.25rem !important;
  color: #ffffff !important;
}

.ingrediente-modal-wrapper .modal-header .close {
  color: #ffffff !important;
  opacity: 0.9 !important;
  text-shadow: none !important;
}

.ingrediente-modal-wrapper .modal-header .close:hover {
  opacity: 1 !important;
}

/* Body del modal */
.ingrediente-modal-wrapper .modal-body {
  padding: 25px !important;
  background: #ffffff !important;
}

/* Scrollbar personalizado para el modal body */
.ingrediente-modal-wrapper .modal-body::-webkit-scrollbar {
  width: 8px;
}

.ingrediente-modal-wrapper .modal-body::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.ingrediente-modal-wrapper .modal-body::-webkit-scrollbar-thumb {
  background: #fca100;
  border-radius: 10px;
}

.ingrediente-modal-wrapper .modal-body::-webkit-scrollbar-thumb:hover {
  background: #e89100;
}

/* Labels mejorados */
.ingrediente-modal-wrapper .form-group label {
  font-weight: 600 !important;
  color: #2c3e50 !important;
  margin-bottom: 8px !important;
  font-size: 0.95rem !important;
}

/* Inputs con mejor contraste */
.ingrediente-modal-wrapper .form-control {
  border: 2px solid #e0e0e0 !important;
  border-radius: 8px !important;
  padding: 10px 15px !important;
  font-size: 0.95rem !important;
  transition: all 0.3s ease !important;
  background-color: #ffffff !important;
  color: #2c3e50 !important;
}

.ingrediente-modal-wrapper .form-control:focus {
  border-color: #fca100 !important;
  box-shadow: 0 0 0 0.2rem rgba(252, 161, 0, 0.15) !important;
  background-color: #ffffff !important;
  color: #2c3e50 !important;
}

.ingrediente-modal-wrapper .form-control::placeholder {
  color: #95a5a6 !important;
  opacity: 1 !important;
}

/* Input específico para tipo text, number, url */
.ingrediente-modal-wrapper input[type="text"].form-control,
.ingrediente-modal-wrapper input[type="number"].form-control,
.ingrediente-modal-wrapper input[type="url"].form-control {
  background-color: #ffffff !important;
  color: #2c3e50 !important;
}

.ingrediente-modal-wrapper input[type="text"].form-control:focus,
.ingrediente-modal-wrapper input[type="number"].form-control:focus,
.ingrediente-modal-wrapper input[type="url"].form-control:focus {
  background-color: #ffffff !important;
  color: #2c3e50 !important;
}

/* Textarea */
.ingrediente-modal-wrapper textarea.form-control {
  resize: vertical !important;
  min-height: 60px !important;
  background-color: #ffffff !important;
  color: #2c3e50 !important;
}

.ingrediente-modal-wrapper textarea.form-control:focus {
  background-color: #ffffff !important;
  color: #2c3e50 !important;
}

/* Input group */
.ingrediente-modal-wrapper .input-group-text {
  background-color: #fca100 !important;
  color: #ffffff !important;
  border: 2px solid #fca100 !important;
  font-weight: 600 !important;
}

/* Custom switches */
.ingrediente-modal-wrapper .custom-switch {
  padding-left: 2.5rem !important;
  margin-bottom: 1rem !important;
}

.ingrediente-modal-wrapper .custom-control-label {
  font-weight: 500 !important;
  color: #2c3e50 !important;
  cursor: pointer !important;
  padding-top: 2px !important;
}

.ingrediente-modal-wrapper .custom-switch .custom-control-input:checked ~ .custom-control-label::before {
  background-color: #fca100 !important;
  border-color: #fca100 !important;
}

/* Vista previa de imagen */
.ingrediente-modal-wrapper .img-thumbnail {
  border: 2px solid #e0e0e0 !important;
  border-radius: 8px !important;
  padding: 8px !important;
}

/* Texto de ayuda */
.ingrediente-modal-wrapper .text-muted {
  font-size: 0.875rem !important;
  color: #6c757d !important;
}

/* Asterisco requerido */
.ingrediente-modal-wrapper .text-danger {
  color: #e74c3c !important;
}

/* Footer mejorado */
.ingrediente-modal-wrapper .modal-footer {
  background: #f8f9fa !important;
  border-top: 1px solid #e0e0e0 !important;
  padding: 15px 25px !important;
}

/* Botones */
.ingrediente-modal-wrapper .btn {
  padding: 10px 24px !important;
  font-weight: 600 !important;
  border-radius: 8px !important;
  transition: all 0.3s ease !important;
}

.ingrediente-modal-wrapper .btn-primary {
  background-color: #fca100 !important;
  border-color: #fca100 !important;
  color: #ffffff !important;
}

.ingrediente-modal-wrapper .btn-primary:hover {
  background-color: #e89100 !important;
  border-color: #e89100 !important;
  transform: translateY(-2px) !important;
  box-shadow: 0 4px 12px rgba(252, 161, 0, 0.3) !important;
}

.ingrediente-modal-wrapper .btn-secondary {
  background-color: #6c757d !important;
  border-color: #6c757d !important;
  color: #ffffff !important;
}

.ingrediente-modal-wrapper .btn-secondary:hover {
  background-color: #5a6268 !important;
  border-color: #545b62 !important;
  transform: translateY(-2px) !important;
}
</style>
