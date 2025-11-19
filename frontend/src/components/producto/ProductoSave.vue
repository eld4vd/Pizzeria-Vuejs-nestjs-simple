<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue'
import axios from '@/plugins/axios'
import type { Producto, CategoriaProducto } from '@/models/producto'
import { useToast } from 'vue-toastification'

const toast = useToast()

interface Ingrediente {
  id: number
  nombre: string
  unidadMedida: string
  precioPorUnidad: number
  stock: number
  disponible: boolean
}

interface ProductoIngrediente {
  idIngrediente: number
  nombreIngrediente?: string
  unidadMedida?: string
  cantidad: number
  notas?: string
}

interface Props {
  producto?: Producto | null
}

const props = defineProps<Props>()
const emit = defineEmits<{
  saved: []
  cancel: []
}>()

const showModal = ref(false)
const ingredientesDisponibles = ref<Ingrediente[]>([])
const ingredientesProducto = ref<ProductoIngrediente[]>([])

// Opciones de categorías y tamaños
const categoriasOptions: { value: CategoriaProducto; label: string }[] = [
  { value: 'pizza', label: '🍕 Pizza' },
  { value: 'bebida', label: '🥤 Bebida' }
]

const tamañosOptions = [
  'personal',
  'mediana',
  'familiar',
  'individual',
  'litro',
  'medio litro'
]

const form = ref({
  categoria: 'pizza' as CategoriaProducto,
  nombre: '',
  descripcion: '',
  precio: null as number | null,
  stock: 0,
  tamañosDisponibles: [] as string[],
  imagenUrl: '',
  disponible: true,
  destacado: false
})

// Para agregar nuevo ingrediente
const nuevoIngrediente = ref({
  idIngrediente: null as number | null,
  cantidad: 1,
  notas: ''
})

const isEditing = ref(false)
const editingId = ref<number | null>(null)

// Computed para saber si es pizza (requiere tamaños e ingredientes)
const esPizza = computed(() => {
  return form.value.categoria === 'pizza'
})

// Calcular el costo total de los ingredientes agregados
const costoIngredientesCalculado = computed(() => {
  let total = 0
  for (const pi of ingredientesProducto.value) {
    const ingrediente = ingredientesDisponibles.value.find(i => i.id === pi.idIngrediente)
    if (ingrediente && ingrediente.precioPorUnidad) {
      total += ingrediente.precioPorUnidad * pi.cantidad
    }
  }
  return total
})

watch(() => props.producto, async (newVal) => {
  if (newVal) {
    isEditing.value = true
    editingId.value = newVal.id
    form.value = {
      categoria: newVal.categoria,
      nombre: newVal.nombre,
      descripcion: newVal.descripcion,
      precio: Number(newVal.precio),
      stock: newVal.stock || 0,
      tamañosDisponibles: newVal.tamañosDisponibles || [],
      imagenUrl: newVal.imagenUrl || '',
      disponible: newVal.disponible,
      destacado: newVal.destacado
    }
    // Cargar ingredientes del producto
    await cargarIngredientesProducto(newVal.id)
    showModal.value = true
  }
}, { immediate: true })

const cargarCatalogosDependientes = async () => {
  try {
    const ingredientesRes = await axios.get('/ingredientes')
    ingredientesDisponibles.value = ingredientesRes.data.filter((i: Ingrediente) => i.disponible)
  } catch (error) {
    console.error('Error al cargar ingredientes:', error)
    toast.error('Error al cargar ingredientes')
  }
}

const cargarIngredientesProducto = async (idProducto: number) => {
  try {
    const response = await axios.get(`/producto-ingredientes/producto/${idProducto}`)
    ingredientesProducto.value = response.data.map((pi: any) => ({
      idIngrediente: pi.idIngrediente,
      nombreIngrediente: pi.ingrediente?.nombre || 'N/A',
      unidadMedida: pi.ingrediente?.unidadMedida || '',
      cantidad: Number(pi.cantidad),
      notas: pi.notas || ''
    }))
  } catch (error) {
    console.error('Error al cargar ingredientes del producto:', error)
  }
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
  isEditing.value = false
  editingId.value = null
  form.value = {
    categoria: 'pizza',
    nombre: '',
    descripcion: '',
    precio: null,
    stock: 0,
    tamañosDisponibles: [],
    imagenUrl: '',
    disponible: true,
    destacado: false
  }
  ingredientesProducto.value = []
  nuevoIngrediente.value = {
    idIngrediente: null,
    cantidad: 1,
    notas: ''
  }
}

const agregarIngrediente = () => {
  if (!nuevoIngrediente.value.idIngrediente) {
    toast.warning('Seleccione un ingrediente')
    return
  }

  const yaExiste = ingredientesProducto.value.some(
    pi => pi.idIngrediente === nuevoIngrediente.value.idIngrediente
  )

  if (yaExiste) {
    toast.warning('Este ingrediente ya está agregado')
    return
  }

  const ingrediente = ingredientesDisponibles.value.find(
    i => i.id === nuevoIngrediente.value.idIngrediente
  )

  if (ingrediente) {
    ingredientesProducto.value.push({
      idIngrediente: ingrediente.id,
      nombreIngrediente: ingrediente.nombre,
      unidadMedida: ingrediente.unidadMedida,
      cantidad: nuevoIngrediente.value.cantidad,
      notas: nuevoIngrediente.value.notas
    })

    // Resetear form
    nuevoIngrediente.value = {
      idIngrediente: null,
      cantidad: 1,
      notas: ''
    }
    toast.success('Ingrediente agregado')
  }
}

const eliminarIngrediente = (idIngrediente: number) => {
  ingredientesProducto.value = ingredientesProducto.value.filter(
    pi => pi.idIngrediente !== idIngrediente
  )
  toast.info('Ingrediente eliminado')
}

const guardarIngredientesProducto = async (idProducto: number) => {
  try {
    // Primero eliminar todos los ingredientes existentes
    const existentes = await axios.get(`/producto-ingredientes/producto/${idProducto}`)
    for (const pi of existentes.data) {
      await axios.delete(`/producto-ingredientes/${pi.id}`)
    }

    // Luego agregar los nuevos
    for (const ingrediente of ingredientesProducto.value) {
      await axios.post('/producto-ingredientes', {
        idProducto,
        idIngrediente: ingrediente.idIngrediente,
        cantidad: Number(ingrediente.cantidad),
        notas: ingrediente.notas || null
      })
    }
  } catch (error) {
    console.error('Error al guardar ingredientes:', error)
    throw error
  }
}

const guardar = async () => {
  if (!form.value.nombre.trim()) {
    toast.warning('El nombre es obligatorio')
    return
  }

  if (!form.value.categoria) {
    toast.warning('Debe seleccionar una categoría')
    return
  }

  if (!form.value.precio || form.value.precio <= 0) {
    toast.warning('El precio es obligatorio y debe ser mayor a 0')
    return
  }

  if (form.value.stock < 0) {
    toast.warning('El stock no puede ser negativo')
    return
  }

  try {
    const data = {
      categoria: form.value.categoria,
      nombre: form.value.nombre.trim(),
      descripcion: form.value.descripcion.trim() || null,
      precio: Number(form.value.precio),
      stock: Number(form.value.stock),
      tamañosDisponibles: form.value.tamañosDisponibles || [],
      imagenUrl: form.value.imagenUrl.trim() || null,
      disponible: form.value.disponible,
      destacado: form.value.destacado
    }

    let idProducto: number

    if (isEditing.value && editingId.value) {
      await axios.patch(`/productos/${editingId.value}`, data)
      idProducto = editingId.value
    } else {
      const response = await axios.post('/productos', data)
      idProducto = response.data.id
    }

    // Guardar ingredientes (esto recalculará el precio final = base + ingredientes)
    if (ingredientesProducto.value.length > 0) {
      await guardarIngredientesProducto(idProducto)
    } else {
      // Si no tiene ingredientes, recalcular igual (precio final = precio base + 0)
      await axios.post(`/productos/${idProducto}/recalcular-precio`)
    }

    const precioFinal = form.value.precio + costoIngredientesCalculado.value
    toast.success(
      isEditing.value 
        ? `Producto actualizado exitosamente. Precio final: Bs. ${precioFinal.toFixed(2)}`
        : `Producto creado exitosamente. Precio final: Bs. ${precioFinal.toFixed(2)}`
    )

    cerrar()
    emit('saved')
  } catch (error: any) {
    console.error('Error al guardar:', error)
    const message = error.response?.data?.message || 'Error al guardar el producto'
    toast.error(Array.isArray(message) ? message.join(', ') : message)
  }
}

onMounted(() => {
  cargarCatalogosDependientes()
})

defineExpose({ abrir })
</script>

<template>
  <div 
    v-if="showModal" 
    class="modal fade show producto-modal-wrapper" 
    style="display: block; background: rgba(0,0,0,0.5);"
    @click.self="cerrar"
  >
    <div class="modal-dialog modal-lg modal-dialog-scrollable">
      <div class="modal-content producto-modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            <i class="fas fa-pizza-slice mr-2"></i>
            {{ isEditing ? 'Editar Producto' : 'Nuevo Producto' }}
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
                    Nombre del Producto <span class="text-danger">*</span>
                  </label>
                  <input
                    id="nombre"
                    type="text"
                    class="form-control"
                    v-model="form.nombre"
                    placeholder="Ej: Pizza Margherita"
                    maxlength="150"
                    required
                  />
                </div>
              </div>

              <div class="col-md-6">
                <div class="form-group">
                  <label for="precio">
                    Precio Base <span class="text-danger">*</span>
                  </label>
                  <div class="input-group">
                    <div class="input-group-prepend">
                      <span class="input-group-text">Bs.</span>
                    </div>
                    <input
                      id="precio"
                      type="number"
                      step="0.01"
                      min="0.01"
                      class="form-control"
                      v-model.number="form.precio"
                      placeholder="Ej: 40.00"
                      required
                    />
                  </div>
                  <small class="form-text text-info">
                    <i class="fas fa-plus-circle mr-1"></i>
                    Al precio base se le sumará automáticamente el costo de los ingredientes
                  </small>
                  <small v-if="costoIngredientesCalculado > 0 && form.precio" class="form-text text-success">
                    <i class="fas fa-arrow-right mr-1"></i>
                    <strong>Precio Final: Bs. {{ ((form.precio || 0) + costoIngredientesCalculado).toFixed(2) }}</strong>
                    ({{ (form.precio || 0).toFixed(2) }} base + {{ costoIngredientesCalculado.toFixed(2) }} ingredientes)
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
                rows="3"
                placeholder="Descripción del producto..."
                maxlength="500"
              ></textarea>
              <small class="form-text text-muted">
                {{ form.descripcion.length }}/500 caracteres
              </small>
            </div>

            <div class="row">
              <div class="col-md-6">
                <div class="form-group">
                  <label for="categoria">
                    Categoría <span class="text-danger">*</span>
                  </label>
                  <select
                    id="categoria"
                    class="form-control"
                    v-model="form.categoria"
                    required
                  >
                    <option 
                      v-for="cat in categoriasOptions" 
                      :key="cat.value"
                      :value="cat.value"
                    >
                      {{ cat.label }}
                    </option>
                  </select>
                  <small class="form-text">
                    <i class="fas" :class="esPizza ? 'fa-pizza-slice text-warning' : 'fa-glass-whiskey text-info'"></i>
                    {{ esPizza ? 'Las pizzas pueden tener múltiples tamaños e ingredientes' : 'Producto simple' }}
                  </small>
                </div>
              </div>

              <div class="col-md-6">
                <div class="form-group">
                  <label for="stock">
                    Stock <span class="text-danger">*</span>
                  </label>
                  <input
                    id="stock"
                    type="number"
                    min="0"
                    step="1"
                    class="form-control"
                    v-model.number="form.stock"
                    placeholder="0"
                    required
                  />
                  <small class="form-text text-muted">
                    Cantidad disponible en inventario
                  </small>
                </div>
              </div>
            </div>

            <!-- Tamaños Disponibles (para pizzas principalmente) -->
            <div v-if="esPizza" class="form-group">
              <label>
                Tamaños Disponibles
                <span class="text-muted">(opcional)</span>
              </label>
              <div class="row">
                <div class="col-md-3" v-for="tamaño in tamañosOptions" :key="tamaño">
                  <div class="custom-control custom-checkbox">
                    <input
                      type="checkbox"
                      class="custom-control-input"
                      :id="`tamaño-${tamaño}`"
                      :value="tamaño"
                      v-model="form.tamañosDisponibles"
                    />
                    <label class="custom-control-label" :for="`tamaño-${tamaño}`">
                      {{ tamaño.charAt(0).toUpperCase() + tamaño.slice(1) }}
                    </label>
                  </div>
                </div>
              </div>
              <small class="form-text text-muted">
                Selecciona los tamaños en que este producto está disponible
              </small>
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
                Opcional: URL de la imagen del producto
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

            <!-- SECCIÓN DE INGREDIENTES (Solo para pizzas) -->
            <div v-if="esPizza">
              <hr class="my-4" />
              <div class="form-group">
                <h6 class="mb-3">
                  <i class="fas fa-leaf text-success mr-2"></i>
                  Ingredientes del Producto
                </h6>

              <!-- Agregar ingrediente -->
              <div class="card mb-3" style="border: 2px solid #fca100;">
                <div class="card-body">
                  <div class="row">
                    <div class="col-md-5">
                      <label>Ingrediente</label>
                      <select
                        class="form-control"
                        v-model="nuevoIngrediente.idIngrediente"
                      >
                        <option :value="null">Seleccionar...</option>
                        <option 
                          v-for="ingrediente in ingredientesDisponibles" 
                          :key="ingrediente.id"
                          :value="ingrediente.id"
                        >
                          {{ ingrediente.nombre }} 
                          <span v-if="ingrediente.unidadMedida">({{ ingrediente.unidadMedida }})</span>
                        </option>
                      </select>
                    </div>

                    <div class="col-md-2">
                      <label>Cantidad</label>
                      <input
                        type="number"
                        step="0.001"
                        min="0.001"
                        class="form-control"
                        v-model.number="nuevoIngrediente.cantidad"
                      />
                    </div>

                    <div class="col-md-3">
                      <label>Notas (opcional)</label>
                      <input
                        type="text"
                        class="form-control"
                        v-model="nuevoIngrediente.notas"
                        placeholder="Ej: Extra queso"
                        maxlength="100"
                      />
                    </div>

                    <div class="col-md-2 d-flex align-items-end">
                      <button
                        type="button"
                        class="btn btn-success btn-block"
                        @click="agregarIngrediente"
                      >
                        <i class="fas fa-plus"></i> Agregar
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Lista de ingredientes agregados -->
              <div v-if="ingredientesProducto.length > 0" class="table-responsive">
                <table class="table table-sm table-bordered">
                  <thead class="thead-light">
                    <tr>
                      <th>Ingrediente</th>
                      <th width="120">Cantidad</th>
                      <th>Notas</th>
                      <th width="80" class="text-center">Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(pi, index) in ingredientesProducto" :key="index">
                      <td>
                        <strong>{{ pi.nombreIngrediente }}</strong>
                        <span v-if="pi.unidadMedida" class="badge badge-secondary ml-2">
                          {{ pi.unidadMedida }}
                        </span>
                      </td>
                      <td>
                        <input
                          type="number"
                          step="0.001"
                          min="0.001"
                          class="form-control form-control-sm"
                          v-model.number="pi.cantidad"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          class="form-control form-control-sm"
                          v-model="pi.notas"
                          maxlength="100"
                        />
                      </td>
                      <td class="text-center">
                        <button
                          type="button"
                          class="btn btn-sm btn-danger"
                          @click="eliminarIngrediente(pi.idIngrediente)"
                        >
                          <i class="fas fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div v-else class="alert alert-info">
                <i class="fas fa-info-circle mr-2"></i>
                No hay ingredientes agregados. Agregue al menos uno para una pizza completa.
              </div>
            </div>
            </div>

            <hr class="my-4" />

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
                    Disponible para la venta
                  </label>
                </div>
              </div>

              <div class="col-md-6">
                <div class="custom-control custom-switch">
                  <input
                    type="checkbox"
                    class="custom-control-input"
                    id="destacado"
                    v-model="form.destacado"
                  />
                  <label class="custom-control-label" for="destacado">
                    <i class="fas fa-star text-warning mr-1"></i>
                    Producto destacado
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
/* Estilos específicos para el modal de productos - SIN SCOPED para mayor prioridad */
.producto-modal-wrapper .modal-header {
  background: #fca100 !important;
  color: #ffffff !important;
  border-bottom: 3px solid #e89100 !important;
}

.producto-modal-wrapper .modal-title {
  font-weight: 600 !important;
  font-size: 1.25rem !important;
  color: #ffffff !important;
}

.producto-modal-wrapper .modal-header .close {
  color: #ffffff !important;
  opacity: 0.9 !important;
  text-shadow: none !important;
}

.producto-modal-wrapper .modal-header .close:hover {
  opacity: 1 !important;
}

/* Modal wrapper */
.producto-modal-wrapper .modal-dialog {
  max-height: 90vh !important;
  margin: 1.75rem auto !important;
  display: flex !important;
  align-items: center !important;
}

.producto-modal-wrapper .modal-dialog-scrollable {
  height: auto !important;
  max-height: calc(100vh - 3.5rem) !important;
}

.producto-modal-wrapper .modal-dialog-scrollable .modal-content {
  max-height: calc(100vh - 3.5rem) !important;
  overflow: hidden !important;
}

.producto-modal-wrapper .modal-dialog-scrollable .modal-body {
  overflow-y: auto !important;
  max-height: calc(100vh - 250px) !important;
}

/* Animaciones */
.producto-modal-wrapper.modal.show {
  animation: fadeIn 0.3s ease;
  overflow-y: auto !important;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.producto-modal-content.modal-content {
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

/* Body del modal */
.producto-modal-wrapper .modal-body {
  padding: 25px !important;
  background: #ffffff !important;
}

/* Scrollbar personalizado para el modal body */
.producto-modal-wrapper .modal-body::-webkit-scrollbar {
  width: 8px;
}

.producto-modal-wrapper .modal-body::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.producto-modal-wrapper .modal-body::-webkit-scrollbar-thumb {
  background: #fca100;
  border-radius: 10px;
}

.producto-modal-wrapper .modal-body::-webkit-scrollbar-thumb:hover {
  background: #e89100;
}

/* Labels mejorados */
.producto-modal-wrapper .form-group label {
  font-weight: 600 !important;
  color: #2c3e50 !important;
  margin-bottom: 8px !important;
  font-size: 0.95rem !important;
}

/* Inputs con mejor contraste - FORZAR con !important */
.producto-modal-wrapper .form-control {
  border: 2px solid #e0e0e0 !important;
  border-radius: 8px !important;
  padding: 10px 15px !important;
  font-size: 0.95rem !important;
  transition: all 0.3s ease !important;
  background-color: #ffffff !important;
  color: #2c3e50 !important;
}

.producto-modal-wrapper .form-control-sm {
  padding: 0.375rem 0.5rem !important;
  font-size: 0.875rem !important;
  border-radius: 4px !important;
}

.producto-modal-wrapper .form-control:focus {
  border-color: #fca100 !important;
  box-shadow: 0 0 0 0.2rem rgba(252, 161, 0, 0.15) !important;
  background-color: #ffffff !important;
  color: #2c3e50 !important;
}

.producto-modal-wrapper .form-control::placeholder {
  color: #95a5a6 !important;
  opacity: 1 !important;
}

/* Selects */
.producto-modal-wrapper select.form-control {
  cursor: pointer !important;
  background-color: #ffffff !important;
  color: #2c3e50 !important;
}

.producto-modal-wrapper select.form-control option {
  background-color: #ffffff !important;
  color: #2c3e50 !important;
}

/* Input específico para tipo text, number, url */
.producto-modal-wrapper input[type="text"].form-control,
.producto-modal-wrapper input[type="number"].form-control,
.producto-modal-wrapper input[type="url"].form-control {
  background-color: #ffffff !important;
  color: #2c3e50 !important;
}

.producto-modal-wrapper input[type="text"].form-control:focus,
.producto-modal-wrapper input[type="number"].form-control:focus,
.producto-modal-wrapper input[type="url"].form-control:focus {
  background-color: #ffffff !important;
  color: #2c3e50 !important;
}

/* Textarea */
.producto-modal-wrapper textarea.form-control {
  resize: vertical !important;
  min-height: 80px !important;
  background-color: #ffffff !important;
  color: #2c3e50 !important;
}

.producto-modal-wrapper textarea.form-control:focus {
  background-color: #ffffff !important;
  color: #2c3e50 !important;
}

/* Input group */
.producto-modal-wrapper .input-group-text {
  background-color: #fca100;
  color: #ffffff;
  border: 2px solid #fca100;
  font-weight: 600;
}

/* Custom switches */
.producto-modal-wrapper .custom-switch {
  padding-left: 2.5rem !important;
  margin-bottom: 1rem !important;
}

.producto-modal-wrapper .custom-control-label {
  font-weight: 500 !important;
  color: #2c3e50 !important;
  cursor: pointer !important;
  padding-top: 2px !important;
}

.producto-modal-wrapper .custom-switch .custom-control-input:checked ~ .custom-control-label::before {
  background-color: #fca100 !important;
  border-color: #fca100 !important;
}

/* Footer mejorado */
.producto-modal-wrapper .modal-footer {
  background: #f8f9fa !important;
  border-top: 1px solid #e0e0e0 !important;
  padding: 15px 25px !important;
}

/* Botones */
.producto-modal-wrapper .btn {
  padding: 10px 24px !important;
  font-weight: 600 !important;
  border-radius: 8px !important;
  transition: all 0.3s ease !important;
}

.producto-modal-wrapper .btn-primary {
  background-color: #fca100 !important;
  border-color: #fca100 !important;
  color: #ffffff !important;
}

.producto-modal-wrapper .btn-primary:hover {
  background-color: #e89100 !important;
  border-color: #e89100 !important;
  transform: translateY(-2px) !important;
  box-shadow: 0 4px 12px rgba(252, 161, 0, 0.3) !important;
}

.producto-modal-wrapper .btn-secondary {
  background-color: #6c757d !important;
  border-color: #6c757d !important;
  color: #ffffff !important;
}

.producto-modal-wrapper .btn-secondary:hover {
  background-color: #5a6268 !important;
  border-color: #545b62 !important;
  transform: translateY(-2px) !important;
}

/* Vista previa de imagen */
.producto-modal-wrapper .img-thumbnail {
  border: 2px solid #e0e0e0 !important;
  border-radius: 8px !important;
  padding: 8px !important;
}

/* Texto de ayuda */
.producto-modal-wrapper .text-muted {
  font-size: 0.875rem !important;
  color: #6c757d !important;
}

/* Asterisco requerido */
.producto-modal-wrapper .text-danger {
  color: #e74c3c !important;
}
</style>
