<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import axios from '@/plugins/axios'
import type { Proveedor } from '@/models/proveedor'
import type { Ingrediente } from '@/models/ingrediente'
import type { DetalleCompra } from '@/models/compra'

const toast = useToast()
const emit = defineEmits<{
  saved: []
  cancel: []
}>()

const showModal = ref(false)
const proveedores = ref<Proveedor[]>([])
const ingredientesDisponibles = ref<Ingrediente[]>([])

const form = ref({
  idProveedor: null as number | null,
  fechaCompra: new Date().toISOString().substring(0, 16), // formato datetime-local
  notas: ''
})

const detalles = ref<DetalleCompra[]>([])

const nuevoDetalle = ref({
  idIngrediente: null as number | null,
  cantidad: 1,
  precioUnitario: null as number | null
})

const totalCompra = computed(() => {
  return detalles.value.reduce((sum, d) => sum + (d.cantidad * d.precioUnitario), 0)
})

const cargarProveedores = async () => {
  try {
    const response = await axios.get('/proveedores')
    proveedores.value = response.data
  } catch (error) {
    console.error('Error al cargar proveedores:', error)
    toast.error('Error al cargar proveedores')
  }
}

const cargarIngredientes = async () => {
  try {
    const response = await axios.get('/ingredientes')
    ingredientesDisponibles.value = response.data.filter((i: Ingrediente) => i.disponible)
  } catch (error) {
    console.error('Error al cargar ingredientes:', error)
    toast.error('Error al cargar ingredientes')
  }
}

const agregarDetalle = () => {
  if (!nuevoDetalle.value.idIngrediente) {
    toast.warning('Seleccione un ingrediente')
    return
  }

  if (nuevoDetalle.value.cantidad <= 0) {
    toast.warning('La cantidad debe ser mayor a 0')
    return
  }

  if (!nuevoDetalle.value.precioUnitario || nuevoDetalle.value.precioUnitario <= 0) {
    toast.warning('El precio unitario debe ser mayor a 0')
    return
  }

  const yaExiste = detalles.value.some(d => d.idIngrediente === nuevoDetalle.value.idIngrediente)
  if (yaExiste) {
    toast.warning('Este ingrediente ya está en la compra')
    return
  }

  const ingrediente = ingredientesDisponibles.value.find(i => i.id === nuevoDetalle.value.idIngrediente)
  if (!ingrediente) return

  detalles.value.push({
    idIngrediente: ingrediente.id,
    nombreIngrediente: ingrediente.nombre,
    unidadMedida: ingrediente.unidadMedida || '',
    cantidad: nuevoDetalle.value.cantidad,
    precioUnitario: nuevoDetalle.value.precioUnitario,
    subtotal: nuevoDetalle.value.cantidad * nuevoDetalle.value.precioUnitario
  })

  // Resetear formulario de detalle
  nuevoDetalle.value = {
    idIngrediente: null,
    cantidad: 1,
    precioUnitario: null
  }
}

const quitarDetalle = (index: number) => {
  detalles.value.splice(index, 1)
}

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
  form.value = {
    idProveedor: null,
    fechaCompra: new Date().toISOString().substring(0, 16),
    notas: ''
  }
  detalles.value = []
  nuevoDetalle.value = {
    idIngrediente: null,
    cantidad: 1,
    precioUnitario: null
  }
}

const guardar = async () => {
  if (!form.value.idProveedor) {
    toast.warning('Debe seleccionar un proveedor')
    return
  }

  if (detalles.value.length === 0) {
    toast.warning('Debe agregar al menos un ingrediente')
    return
  }

  try {
    const data = {
      idProveedor: form.value.idProveedor,
      fechaCompra: form.value.fechaCompra,
      total: totalCompra.value,
      notas: form.value.notas.trim() || null,
      detalles: detalles.value.map(d => ({
        idIngrediente: d.idIngrediente,
        nombreIngrediente: d.nombreIngrediente,
        cantidad: d.cantidad,
        precioUnitario: d.precioUnitario,
        unidadMedida: d.unidadMedida,
        subtotal: d.subtotal
      }))
    }

    console.log('📤 Datos a enviar:', JSON.stringify(data, null, 2))
    await axios.post('/compras', data)
    toast.success(`Compra registrada exitosamente. Total: Bs. ${totalCompra.value.toFixed(2)}`)
    cerrar()
    emit('saved')
  } catch (error: any) {
    console.error('Error al guardar:', error)
    console.error('Respuesta del servidor:', error.response?.data)
    const message = error.response?.data?.message || 'Error al registrar la compra'
    toast.error(Array.isArray(message) ? message.join(', ') : message)
  }
}

onMounted(() => {
  cargarProveedores()
  cargarIngredientes()
})

defineExpose({ abrir })
</script>

<template>
  <div 
    v-if="showModal" 
    class="modal fade show compra-modal-wrapper" 
    style="display: block; background: rgba(0,0,0,0.5);"
    @click.self="cerrar"
  >
    <div class="modal-dialog modal-xl modal-dialog-scrollable">
      <div class="modal-content compra-modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            <i class="fas fa-shopping-cart mr-2"></i>
            Nueva Compra
          </h5>
          <button type="button" class="close" @click="cerrar">
            <span>&times;</span>
          </button>
        </div>

        <form @submit.prevent="guardar">
          <div class="modal-body">
            <!-- Información de la compra -->
            <div class="row">
              <div class="col-md-6">
                <div class="form-group">
                  <label for="proveedor">
                    Proveedor <span class="text-danger">*</span>
                  </label>
                  <select
                    id="proveedor"
                    class="form-control"
                    v-model="form.idProveedor"
                    required
                  >
                    <option :value="null">Seleccionar...</option>
                    <option 
                      v-for="proveedor in proveedores" 
                      :key="proveedor.id"
                      :value="proveedor.id"
                    >
                      {{ proveedor.nombre }} - {{ proveedor.empresa }}
                    </option>
                  </select>
                </div>
              </div>

              <div class="col-md-6">
                <div class="form-group">
                  <label for="fechaCompra">
                    Fecha de Compra <span class="text-danger">*</span>
                  </label>
                  <input
                    id="fechaCompra"
                    type="datetime-local"
                    class="form-control"
                    v-model="form.fechaCompra"
                    required
                  />
                </div>
              </div>
            </div>

            <div class="form-group">
              <label for="notas">Notas</label>
              <textarea
                id="notas"
                class="form-control"
                v-model="form.notas"
                rows="2"
                placeholder="Observaciones sobre la compra..."
                maxlength="500"
              ></textarea>
            </div>

            <hr class="my-4" />

            <!-- Agregar ingredientes -->
            <h6 class="mb-3">
              <i class="fas fa-leaf text-success mr-2"></i>
              Ingredientes de la Compra
            </h6>

            <div class="card mb-3" style="border: 2px solid #28a745;">
              <div class="card-body">
                <div class="row">
                  <div class="col-md-4">
                    <label>Ingrediente <span class="text-danger">*</span></label>
                    <select
                      class="form-control"
                      v-model="nuevoDetalle.idIngrediente"
                    >
                      <option :value="null">Seleccionar...</option>
                      <option 
                        v-for="ingrediente in ingredientesDisponibles" 
                        :key="ingrediente.id"
                        :value="ingrediente.id"
                        :disabled="detalles.some(d => d.idIngrediente === ingrediente.id)"
                      >
                        {{ ingrediente.nombre }} ({{ ingrediente.unidadMedida }})
                      </option>
                    </select>
                  </div>

                  <div class="col-md-2">
                    <label>Cantidad <span class="text-danger">*</span></label>
                    <input
                      type="number"
                      step="0.01"
                      min="0.01"
                      class="form-control"
                      v-model.number="nuevoDetalle.cantidad"
                    />
                  </div>

                  <div class="col-md-3">
                    <label>Precio Unitario (Bs.) <span class="text-danger">*</span></label>
                    <input
                      type="number"
                      step="0.01"
                      min="0.01"
                      class="form-control"
                      v-model.number="nuevoDetalle.precioUnitario"
                      placeholder="0.00"
                    />
                  </div>

                  <div class="col-md-3 d-flex align-items-end">
                    <button
                      type="button"
                      class="btn btn-success btn-block"
                      @click="agregarDetalle"
                      :disabled="!nuevoDetalle.idIngrediente || !nuevoDetalle.cantidad || nuevoDetalle.cantidad <= 0 || !nuevoDetalle.precioUnitario || nuevoDetalle.precioUnitario <= 0"
                    >
                      <i class="fas fa-plus mr-1"></i>
                      Agregar
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Lista de ingredientes agregados -->
            <div v-if="detalles.length > 0" class="table-responsive">
              <table class="table table-sm table-bordered">
                <thead class="thead-light">
                  <tr>
                    <th width="5%">#</th>
                    <th width="35%">Ingrediente</th>
                    <th width="15%">Cantidad</th>
                    <th width="15%">Precio Unit.</th>
                    <th width="20%">Subtotal</th>
                    <th width="10%">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(detalle, index) in detalles" :key="index">
                    <td>{{ index + 1 }}</td>
                    <td>
                      <strong>{{ detalle.nombreIngrediente }}</strong>
                      <br>
                      <small class="text-muted">({{ detalle.unidadMedida }})</small>
                    </td>
                    <td>{{ detalle.cantidad }}</td>
                    <td>Bs. {{ detalle.precioUnitario.toFixed(2) }}</td>
                    <td>
                      <strong>Bs. {{ (detalle.cantidad * detalle.precioUnitario).toFixed(2) }}</strong>
                    </td>
                    <td class="text-center">
                      <button
                        type="button"
                        class="btn btn-sm btn-danger"
                        @click="quitarDetalle(index)"
                        title="Quitar"
                      >
                        <i class="fas fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr class="table-active">
                    <td colspan="4" class="text-right"><strong>TOTAL:</strong></td>
                    <td colspan="2">
                      <strong class="text-success" style="font-size: 1.1rem;">
                        Bs. {{ totalCompra.toFixed(2) }}
                      </strong>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div v-else class="alert alert-info">
              <i class="fas fa-info-circle mr-2"></i>
              No hay ingredientes agregados. Use el formulario superior para agregar.
            </div>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="cerrar">
              <i class="fas fa-times mr-1"></i>
              Cancelar
            </button>
            <button type="submit" class="btn btn-primary" :disabled="detalles.length === 0">
              <i class="fas fa-save mr-1"></i>
              Guardar Compra
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Modal wrapper */
.compra-modal-wrapper {
  z-index: 1050 !important;
}

.compra-modal-wrapper .modal-dialog {
  margin: 1.75rem auto !important;
  max-width: 1200px !important;
}

.compra-modal-content {
  border-radius: 15px !important;
  border: none !important;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2) !important;
}

/* Header */
.compra-modal-wrapper .modal-header {
  background: linear-gradient(135deg, #fca100 0%, #e85a19 100%) !important;
  color: #ffffff !important;
  border-radius: 15px 15px 0 0 !important;
  padding: 20px 25px !important;
  border-bottom: none !important;
}

.compra-modal-wrapper .modal-title {
  font-size: 1.4rem !important;
  font-weight: 700 !important;
  color: #ffffff !important;
}

.compra-modal-wrapper .modal-title i {
  font-size: 1.3rem !important;
}

.compra-modal-wrapper .close {
  color: #ffffff !important;
  opacity: 1 !important;
  text-shadow: none !important;
  font-size: 2rem !important;
  font-weight: 300 !important;
}

.compra-modal-wrapper .close:hover {
  opacity: 0.8 !important;
}

/* Body */
.compra-modal-wrapper .modal-body {
  padding: 30px 25px !important;
  max-height: calc(100vh - 250px) !important;
  overflow-y: auto !important;
}

/* Form groups */
.compra-modal-wrapper .form-group {
  margin-bottom: 20px !important;
}

.compra-modal-wrapper .form-group label {
  font-weight: 600 !important;
  font-size: 0.95rem !important;
  color: #2c3e50 !important;
  margin-bottom: 8px !important;
  display: block !important;
}

.compra-modal-wrapper .text-danger {
  color: #e74c3c !important;
  font-weight: 700 !important;
}

/* Form controls */
.compra-modal-wrapper .form-control,
.compra-modal-wrapper select.form-control {
  border: 2px solid #e0e0e0 !important;
  border-radius: 8px !important;
  padding: 12px 16px !important;
  font-size: 0.95rem !important;
  transition: all 0.3s ease !important;
  color: #2c3e50 !important;
  background-color: #ffffff !important;
}

.compra-modal-wrapper .form-control:focus,
.compra-modal-wrapper select.form-control:focus {
  border-color: #fca100 !important;
  box-shadow: 0 0 0 0.2rem rgba(252, 161, 0, 0.15) !important;
  outline: none !important;
}

.compra-modal-wrapper .form-control::placeholder {
  color: #adb5bd !important;
  font-style: italic !important;
}

.compra-modal-wrapper textarea.form-control {
  resize: vertical !important;
  min-height: 80px !important;
}

/* Card de agregar ingredientes */
.compra-modal-wrapper .card {
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2f1 100%) !important;
  border: 2px solid #28a745 !important;
  border-radius: 12px !important;
  box-shadow: 0 4px 12px rgba(40, 167, 69, 0.15) !important;
}

.compra-modal-wrapper .card-body {
  padding: 20px !important;
}

.compra-modal-wrapper .card label {
  font-weight: 600 !important;
  font-size: 0.9rem !important;
  color: #2c3e50 !important;
  margin-bottom: 8px !important;
}

/* Tabla de detalles */
.compra-modal-wrapper .table-responsive {
  border-radius: 10px !important;
  overflow: hidden !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
}

.compra-modal-wrapper .table {
  margin-bottom: 0 !important;
  background-color: #ffffff !important;
}

.compra-modal-wrapper .table thead th {
  background-color: #f8f9fa !important;
  font-size: 0.9rem !important;
  font-weight: 700 !important;
  color: #495057 !important;
  border: none !important;
  padding: 12px !important;
  text-transform: uppercase !important;
  letter-spacing: 0.5px !important;
}

.compra-modal-wrapper .table tbody td {
  vertical-align: middle !important;
  padding: 12px !important;
  color: #2c3e50 !important;
  border-color: #e9ecef !important;
}

.compra-modal-wrapper .table tfoot {
  background-color: #f8f9fa !important;
}

.compra-modal-wrapper .table tfoot td {
  padding: 15px !important;
  font-size: 1rem !important;
  border-top: 2px solid #dee2e6 !important;
}

.compra-modal-wrapper .text-success {
  color: #28a745 !important;
}

.compra-modal-wrapper .text-muted {
  color: #6c757d !important;
  font-size: 0.85rem !important;
}

/* Alert */
.compra-modal-wrapper .alert-info {
  background-color: #e7f3ff !important;
  border: 1px solid #b3d9ff !important;
  border-radius: 8px !important;
  color: #004085 !important;
  padding: 15px !important;
}

/* Separador */
.compra-modal-wrapper hr {
  border-top: 2px solid #e9ecef !important;
  margin: 25px 0 !important;
}

/* Encabezado de secciones */
.compra-modal-wrapper h6 {
  font-weight: 700 !important;
  color: #2c3e50 !important;
  font-size: 1.1rem !important;
}

/* Footer */
.compra-modal-wrapper .modal-footer {
  border-top: 1px solid #e9ecef !important;
  padding: 15px 25px !important;
  background-color: #f8f9fa !important;
  border-radius: 0 0 15px 15px !important;
}

/* Botones */
.compra-modal-wrapper .btn {
  padding: 10px 24px !important;
  font-weight: 600 !important;
  border-radius: 8px !important;
  transition: all 0.3s ease !important;
  font-size: 0.95rem !important;
}

.compra-modal-wrapper .btn-primary {
  background-color: #fca100 !important;
  border-color: #fca100 !important;
  color: #ffffff !important;
}

.compra-modal-wrapper .btn-primary:hover:not(:disabled) {
  background-color: #e89100 !important;
  border-color: #e89100 !important;
  transform: translateY(-2px) !important;
  box-shadow: 0 4px 12px rgba(252, 161, 0, 0.3) !important;
}

.compra-modal-wrapper .btn-primary:disabled {
  opacity: 0.6 !important;
  cursor: not-allowed !important;
}

.compra-modal-wrapper .btn-secondary {
  background-color: #6c757d !important;
  border-color: #6c757d !important;
  color: #ffffff !important;
}

.compra-modal-wrapper .btn-secondary:hover {
  background-color: #5a6268 !important;
  border-color: #545b62 !important;
  transform: translateY(-2px) !important;
}

.compra-modal-wrapper .btn-success {
  background-color: #28a745 !important;
  border-color: #28a745 !important;
  color: #ffffff !important;
}

.compra-modal-wrapper .btn-success:hover:not(:disabled) {
  background-color: #218838 !important;
  border-color: #1e7e34 !important;
  transform: translateY(-2px) !important;
  box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3) !important;
}

.compra-modal-wrapper .btn-success:disabled {
  opacity: 0.5 !important;
  cursor: not-allowed !important;
  background-color: #6c757d !important;
  border-color: #6c757d !important;
}

.compra-modal-wrapper .btn-danger {
  background-color: #dc3545 !important;
  border-color: #dc3545 !important;
  color: #ffffff !important;
}

.compra-modal-wrapper .btn-danger:hover {
  background-color: #c82333 !important;
  border-color: #bd2130 !important;
  transform: scale(1.1) !important;
}

.compra-modal-wrapper .btn i {
  margin-right: 6px !important;
}

.compra-modal-wrapper .btn-sm {
  padding: 6px 12px !important;
}

/* Responsive */
@media (max-width: 768px) {
  .compra-modal-wrapper .modal-body {
    padding: 20px 15px !important;
  }

  .compra-modal-wrapper .modal-header,
  .compra-modal-wrapper .modal-footer {
    padding: 15px !important;
  }

  .compra-modal-wrapper .modal-title {
    font-size: 1.2rem !important;
  }

  .compra-modal-wrapper .card-body {
    padding: 15px !important;
  }
}
</style>
