<script setup lang="ts">
import { ref, watch } from 'vue'
import axios from '@/plugins/axios'
import type { Tamaño } from '@/models/tamaño'
import { useToast } from 'vue-toastification'

const toast = useToast()

interface Props {
  tamaño?: Tamaño | null
}

const props = defineProps<Props>()
const emit = defineEmits<{
  saved: []
  cancel: []
}>()

const showModal = ref(false)
const form = ref({
  nombre: '',
  dimension: '',
  multiplicadorPrecio: 1.0,
  activo: true
})

const isEditing = ref(false)
const editingId = ref<number | null>(null)

watch(() => props.tamaño, (newVal) => {
  if (newVal) {
    isEditing.value = true
    editingId.value = newVal.id
    form.value = {
      nombre: newVal.nombre,
      dimension: newVal.dimension || '',
      multiplicadorPrecio: Number(newVal.multiplicadorPrecio),
      activo: newVal.activo
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
    dimension: '',
    multiplicadorPrecio: 1.0,
    activo: true
  }
}

const guardar = async () => {
  if (!form.value.nombre.trim()) {
    alert('El nombre es obligatorio')
    return
  }

  if (form.value.multiplicadorPrecio <= 0) {
    alert('El multiplicador debe ser mayor a 0')
    return
  }

  try {
    const data = {
      nombre: form.value.nombre.trim(),
      dimension: form.value.dimension.trim() || null,
      multiplicadorPrecio: Number(form.value.multiplicadorPrecio),
      activo: form.value.activo
    }

    if (isEditing.value && editingId.value) {
      await axios.patch(`/tamanos/${editingId.value}`, data)
      toast.success('Tamaño actualizado exitosamente')
    } else {
      await axios.post('/tamanos', data)
      toast.success('Tamaño creado exitosamente')
    }

    cerrar()
    emit('saved')
  } catch (error: any) {
    console.error('Error al guardar:', error)
    const message = error.response?.data?.message || 'Error al guardar el tamaño'
    toast.error(Array.isArray(message) ? message.join(', ') : message)
  }
}

defineExpose({ abrir })
</script>

<template>
  <div 
    v-if="showModal" 
    class="modal fade show tamaño-modal-wrapper" 
    style="display: block; background: rgba(0,0,0,0.5);"
    @click.self="cerrar"
  >
    <div class="modal-dialog modal-dialog-scrollable">
      <div class="modal-content tamaño-modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            <i class="fas fa-ruler-horizontal mr-2"></i>
            {{ isEditing ? 'Editar Tamaño' : 'Nuevo Tamaño' }}
          </h5>
          <button type="button" class="close" @click="cerrar">
            <span>&times;</span>
          </button>
        </div>

        <form @submit.prevent="guardar">
          <div class="modal-body">
            <div class="form-group">
              <label for="nombre">
                Nombre <span class="text-danger">*</span>
              </label>
              <input
                id="nombre"
                type="text"
                class="form-control"
                v-model="form.nombre"
                placeholder="Ej: Pequeño, Mediano, Grande"
                maxlength="50"
                required
              />
            </div>

            <div class="row">
              <div class="col-md-6">
                <div class="form-group">
                  <label for="dimension">Dimensión</label>
                  <input
                    id="dimension"
                    type="text"
                    class="form-control"
                    v-model="form.dimension"
                    placeholder="Ej: 8 pulgadas, 30 cm"
                    maxlength="50"
                  />
                  <small class="form-text text-muted">
                    Opcional: tamaño físico
                  </small>
                </div>
              </div>

              <div class="col-md-6">
                <div class="form-group">
                  <label for="multiplicador">
                    Multiplicador <span class="text-danger">*</span>
                  </label>
                  <input
                    id="multiplicador"
                    type="number"
                    step="0.01"
                    min="0.01"
                    max="99.99"
                    class="form-control"
                    v-model.number="form.multiplicadorPrecio"
                    placeholder="1.0"
                    required
                  />
                  <small class="form-text text-muted">
                    Factor del precio base
                  </small>
                </div>
              </div>
            </div>

            <div class="form-group">
              <div class="custom-control custom-switch">
                <input
                  type="checkbox"
                  class="custom-control-input"
                  id="activo"
                  v-model="form.activo"
                />
                <label class="custom-control-label" for="activo">
                  <i class="fas fa-check-circle text-success mr-1"></i>
                  {{ form.activo ? 'Activo' : 'Inactivo' }}
                </label>
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
/* Estilos específicos para el modal de tamaños - SIN SCOPED para mayor prioridad */

/* Modal wrapper */
.tamaño-modal-wrapper .modal-dialog {
  max-height: 90vh !important;
  margin: 1.75rem auto !important;
  display: flex !important;
  align-items: center !important;
}

.tamaño-modal-wrapper .modal-dialog-scrollable {
  height: auto !important;
  max-height: calc(100vh - 3.5rem) !important;
}

.tamaño-modal-wrapper .modal-dialog-scrollable .modal-content {
  max-height: calc(100vh - 3.5rem) !important;
  overflow: hidden !important;
}

.tamaño-modal-wrapper .modal-dialog-scrollable .modal-body {
  overflow-y: auto !important;
  max-height: calc(100vh - 250px) !important;
}

/* Animaciones */
.tamaño-modal-wrapper.modal.show {
  animation: fadeIn 0.3s ease;
  overflow-y: auto !important;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.tamaño-modal-content.modal-content {
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
.tamaño-modal-wrapper .modal-header {
  background: #fca100 !important;
  color: #ffffff !important;
  border-bottom: 3px solid #e89100 !important;
}

.tamaño-modal-wrapper .modal-title {
  font-weight: 600 !important;
  font-size: 1.25rem !important;
  color: #ffffff !important;
}

.tamaño-modal-wrapper .modal-header .close {
  color: #ffffff !important;
  opacity: 0.9 !important;
  text-shadow: none !important;
}

.tamaño-modal-wrapper .modal-header .close:hover {
  opacity: 1 !important;
}

/* Body del modal */
.tamaño-modal-wrapper .modal-body {
  padding: 25px !important;
  background: #ffffff !important;
}

/* Scrollbar personalizado para el modal body */
.tamaño-modal-wrapper .modal-body::-webkit-scrollbar {
  width: 8px;
}

.tamaño-modal-wrapper .modal-body::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.tamaño-modal-wrapper .modal-body::-webkit-scrollbar-thumb {
  background: #fca100;
  border-radius: 10px;
}

.tamaño-modal-wrapper .modal-body::-webkit-scrollbar-thumb:hover {
  background: #e89100;
}

/* Labels mejorados */
.tamaño-modal-wrapper .form-group label {
  font-weight: 600 !important;
  color: #2c3e50 !important;
  margin-bottom: 8px !important;
  font-size: 0.95rem !important;
}

/* Inputs con mejor contraste */
.tamaño-modal-wrapper .form-control {
  border: 2px solid #e0e0e0 !important;
  border-radius: 8px !important;
  padding: 10px 15px !important;
  font-size: 0.95rem !important;
  transition: all 0.3s ease !important;
  background-color: #ffffff !important;
  color: #2c3e50 !important;
}

.tamaño-modal-wrapper .form-control:focus {
  border-color: #fca100 !important;
  box-shadow: 0 0 0 0.2rem rgba(252, 161, 0, 0.15) !important;
  background-color: #ffffff !important;
  color: #2c3e50 !important;
}

.tamaño-modal-wrapper .form-control::placeholder {
  color: #95a5a6 !important;
  opacity: 1 !important;
}

/* Input específico para tipo text y number */
.tamaño-modal-wrapper input[type="text"].form-control,
.tamaño-modal-wrapper input[type="number"].form-control {
  background-color: #ffffff !important;
  color: #2c3e50 !important;
}

.tamaño-modal-wrapper input[type="text"].form-control:focus,
.tamaño-modal-wrapper input[type="number"].form-control:focus {
  background-color: #ffffff !important;
  color: #2c3e50 !important;
}

/* Custom switches */
.tamaño-modal-wrapper .custom-switch {
  padding-left: 2.5rem !important;
  margin-bottom: 1rem !important;
}

.tamaño-modal-wrapper .custom-control-label {
  font-weight: 500 !important;
  color: #2c3e50 !important;
  cursor: pointer !important;
  padding-top: 2px !important;
}

.tamaño-modal-wrapper .custom-switch .custom-control-input:checked ~ .custom-control-label::before {
  background-color: #fca100 !important;
  border-color: #fca100 !important;
}

/* Texto de ayuda */
.tamaño-modal-wrapper .text-muted {
  font-size: 0.875rem !important;
  color: #6c757d !important;
}

/* Asterisco requerido */
.tamaño-modal-wrapper .text-danger {
  color: #e74c3c !important;
}

/* Footer mejorado */
.tamaño-modal-wrapper .modal-footer {
  background: #f8f9fa !important;
  border-top: 1px solid #e0e0e0 !important;
  padding: 15px 25px !important;
}

/* Botones */
.tamaño-modal-wrapper .btn {
  padding: 10px 24px !important;
  font-weight: 600 !important;
  border-radius: 8px !important;
  transition: all 0.3s ease !important;
}

.tamaño-modal-wrapper .btn-primary {
  background-color: #fca100 !important;
  border-color: #fca100 !important;
  color: #ffffff !important;
}

.tamaño-modal-wrapper .btn-primary:hover {
  background-color: #e89100 !important;
  border-color: #e89100 !important;
  transform: translateY(-2px) !important;
  box-shadow: 0 4px 12px rgba(252, 161, 0, 0.3) !important;
}

.tamaño-modal-wrapper .btn-secondary {
  background-color: #6c757d !important;
  border-color: #6c757d !important;
  color: #ffffff !important;
}

.tamaño-modal-wrapper .btn-secondary:hover {
  background-color: #5a6268 !important;
  border-color: #545b62 !important;
  transform: translateY(-2px) !important;
}
</style>
