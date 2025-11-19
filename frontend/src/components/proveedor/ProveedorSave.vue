<script setup lang="ts">
import { ref, computed } from 'vue'
import { useToast } from 'vue-toastification'
import axios from '@/plugins/axios'
import type { Proveedor } from '@/models/proveedor'

const toast = useToast()
const emit = defineEmits<{
  saved: []
  cancel: []
}>()

const showModal = ref(false)
const isEditing = ref(false)
const editingId = ref<number | null>(null)

const form = ref({
  nombre: '',
  empresa: '',
  nit: '',
  telefono: '',
  email: '',
  direccion: ''
})

const abrir = (proveedor?: Proveedor) => {
  if (proveedor) {
    isEditing.value = true
    editingId.value = proveedor.id
    form.value = {
      nombre: proveedor.nombre,
      empresa: proveedor.empresa || '',
      nit: proveedor.nit || '',
      telefono: proveedor.telefono || '',
      email: proveedor.email || '',
      direccion: proveedor.direccion || ''
    }
  } else {
    resetForm()
  }
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
    empresa: '',
    nit: '',
    telefono: '',
    email: '',
    direccion: ''
  }
}

const guardar = async () => {
  if (!form.value.nombre.trim()) {
    toast.warning('El nombre del proveedor es obligatorio')
    return
  }

  if (!form.value.empresa.trim()) {
    toast.warning('El nombre de la empresa es obligatorio')
    return
  }

  if (!form.value.telefono.trim()) {
    toast.warning('El teléfono es obligatorio')
    return
  }

  try {
    const data = {
      nombre: form.value.nombre.trim(),
      empresa: form.value.empresa.trim(),
      nit: form.value.nit.trim() || null,
      telefono: form.value.telefono.trim(),
      email: form.value.email.trim() || null,
      direccion: form.value.direccion.trim() || null
    }

    if (isEditing.value && editingId.value) {
      await axios.patch(`/proveedores/${editingId.value}`, data)
      toast.success('Proveedor actualizado exitosamente')
    } else {
      await axios.post('/proveedores', data)
      toast.success('Proveedor creado exitosamente')
    }

    cerrar()
    emit('saved')
  } catch (error: any) {
    console.error('Error al guardar:', error)
    const message = error.response?.data?.message || 'Error al guardar el proveedor'
    toast.error(Array.isArray(message) ? message.join(', ') : message)
  }
}

defineExpose({ abrir })
</script>

<template>
  <div 
    v-if="showModal" 
    class="modal fade show proveedor-modal-wrapper" 
    style="display: block; background: rgba(0,0,0,0.5);"
    @click.self="cerrar"
  >
    <div class="modal-dialog modal-lg modal-dialog-scrollable">
      <div class="modal-content proveedor-modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            <i class="fas fa-truck mr-2"></i>
            {{ isEditing ? 'Editar Proveedor' : 'Nuevo Proveedor' }}
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
                    Nombre del Contacto <span class="text-danger">*</span>
                  </label>
                  <input
                    id="nombre"
                    type="text"
                    class="form-control"
                    v-model="form.nombre"
                    placeholder="Ej: Juan Pérez"
                    maxlength="100"
                    required
                  />
                </div>
              </div>

              <div class="col-md-6">
                <div class="form-group">
                  <label for="empresa">
                    Empresa <span class="text-danger">*</span>
                  </label>
                  <input
                    id="empresa"
                    type="text"
                    class="form-control"
                    v-model="form.empresa"
                    placeholder="Ej: Distribuidora S.A."
                    maxlength="150"
                    required
                  />
                </div>
              </div>
            </div>

            <div class="row">
              <div class="col-md-6">
                <div class="form-group">
                  <label for="nit">NIT</label>
                  <input
                    id="nit"
                    type="text"
                    class="form-control"
                    v-model="form.nit"
                    placeholder="Ej: 1234567890"
                    maxlength="20"
                  />
                  <small class="form-text text-muted">Opcional</small>
                </div>
              </div>

              <div class="col-md-6">
                <div class="form-group">
                  <label for="telefono">
                    Teléfono <span class="text-danger">*</span>
                  </label>
                  <input
                    id="telefono"
                    type="tel"
                    class="form-control"
                    v-model="form.telefono"
                    placeholder="Ej: 77123456"
                    maxlength="20"
                    required
                  />
                </div>
              </div>
            </div>

            <div class="form-group">
              <label for="email">Email</label>
              <input
                id="email"
                type="email"
                class="form-control"
                v-model="form.email"
                placeholder="Ej: contacto@empresa.com"
                maxlength="100"
              />
              <small class="form-text text-muted">Opcional</small>
            </div>

            <div class="form-group">
              <label for="direccion">Dirección</label>
              <textarea
                id="direccion"
                class="form-control"
                v-model="form.direccion"
                rows="2"
                placeholder="Dirección completa..."
                maxlength="200"
              ></textarea>
              <small class="form-text text-muted">Opcional</small>
            </div>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="cerrar">
              <i class="fas fa-times mr-1"></i>
              Cancelar
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

<style scoped>
/* Modal wrapper */
.proveedor-modal-wrapper {
  z-index: 1050 !important;
}

.proveedor-modal-wrapper .modal-dialog {
  margin: 1.75rem auto !important;
}

.proveedor-modal-content {
  border-radius: 15px !important;
  border: none !important;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2) !important;
}

/* Header */
.proveedor-modal-wrapper .modal-header {
  background: linear-gradient(135deg, #fca100 0%, #e85a19 100%) !important;
  color: #ffffff !important;
  border-radius: 15px 15px 0 0 !important;
  padding: 20px 25px !important;
  border-bottom: none !important;
}

.proveedor-modal-wrapper .modal-title {
  font-size: 1.4rem !important;
  font-weight: 700 !important;
  color: #ffffff !important;
}

.proveedor-modal-wrapper .modal-title i {
  font-size: 1.3rem !important;
}

.proveedor-modal-wrapper .close {
  color: #ffffff !important;
  opacity: 1 !important;
  text-shadow: none !important;
  font-size: 2rem !important;
  font-weight: 300 !important;
}

.proveedor-modal-wrapper .close:hover {
  opacity: 0.8 !important;
}

/* Body */
.proveedor-modal-wrapper .modal-body {
  padding: 30px 25px !important;
  max-height: calc(100vh - 250px) !important;
  overflow-y: auto !important;
}

/* Form groups */
.proveedor-modal-wrapper .form-group {
  margin-bottom: 20px !important;
}

.proveedor-modal-wrapper .form-group label {
  font-weight: 600 !important;
  font-size: 0.95rem !important;
  color: #2c3e50 !important;
  margin-bottom: 8px !important;
  display: block !important;
}

.proveedor-modal-wrapper .text-danger {
  color: #e74c3c !important;
  font-weight: 700 !important;
}

/* Form controls */
.proveedor-modal-wrapper .form-control {
  border: 2px solid #e0e0e0 !important;
  border-radius: 8px !important;
  padding: 12px 16px !important;
  font-size: 0.95rem !important;
  transition: all 0.3s ease !important;
  color: #2c3e50 !important;
  background-color: #ffffff !important;
}

.proveedor-modal-wrapper .form-control:focus {
  border-color: #fca100 !important;
  box-shadow: 0 0 0 0.2rem rgba(252, 161, 0, 0.15) !important;
  outline: none !important;
}

.proveedor-modal-wrapper .form-control::placeholder {
  color: #adb5bd !important;
  font-style: italic !important;
}

.proveedor-modal-wrapper textarea.form-control {
  resize: vertical !important;
  min-height: 80px !important;
}

/* Text muted */
.proveedor-modal-wrapper .text-muted {
  font-size: 0.85rem !important;
  color: #6c757d !important;
  font-style: italic !important;
}

/* Input group */
.proveedor-modal-wrapper .input-group-text {
  background-color: #f8f9fa !important;
  border: 2px solid #e0e0e0 !important;
  border-right: none !important;
  border-radius: 8px 0 0 8px !important;
  font-weight: 600 !important;
  color: #495057 !important;
}

.proveedor-modal-wrapper .input-group .form-control {
  border-left: none !important;
  border-radius: 0 8px 8px 0 !important;
}

/* Footer */
.proveedor-modal-wrapper .modal-footer {
  border-top: 1px solid #e9ecef !important;
  padding: 15px 25px !important;
  background-color: #f8f9fa !important;
  border-radius: 0 0 15px 15px !important;
}

/* Botones */
.proveedor-modal-wrapper .btn {
  padding: 10px 24px !important;
  font-weight: 600 !important;
  border-radius: 8px !important;
  transition: all 0.3s ease !important;
  font-size: 0.95rem !important;
}

.proveedor-modal-wrapper .btn-primary {
  background-color: #fca100 !important;
  border-color: #fca100 !important;
  color: #ffffff !important;
}

.proveedor-modal-wrapper .btn-primary:hover {
  background-color: #e89100 !important;
  border-color: #e89100 !important;
  transform: translateY(-2px) !important;
  box-shadow: 0 4px 12px rgba(252, 161, 0, 0.3) !important;
}

.proveedor-modal-wrapper .btn-secondary {
  background-color: #6c757d !important;
  border-color: #6c757d !important;
  color: #ffffff !important;
}

.proveedor-modal-wrapper .btn-secondary:hover {
  background-color: #5a6268 !important;
  border-color: #545b62 !important;
  transform: translateY(-2px) !important;
}

.proveedor-modal-wrapper .btn i {
  margin-right: 6px !important;
}

/* Responsive */
@media (max-width: 768px) {
  .proveedor-modal-wrapper .modal-body {
    padding: 20px 15px !important;
  }

  .proveedor-modal-wrapper .modal-header,
  .proveedor-modal-wrapper .modal-footer {
    padding: 15px !important;
  }

  .proveedor-modal-wrapper .modal-title {
    font-size: 1.2rem !important;
  }
}
</style>
