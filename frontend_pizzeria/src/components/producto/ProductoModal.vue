<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { Producto } from '@/models/producto'

interface Props {
  producto: Producto | null
  show: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
  addToCart: [producto: Producto, cantidad: number, tamaño: string | undefined, precioFinal: number, notas?: string]
}>()

const cantidad = ref(1)
const tamañoSeleccionado = ref<string>('')
const notas = ref('')

// Configuración de precios por tamaño
const preciosPorTamaño: Record<string, number> = {
  'personal': 1.0,    // Precio base
  'mediana': 1.5,     // +50%
  'familiar': 2.0,    // +100%
  'individual': 1.0,  // Para bebidas
  'litro': 1.8        // Para bebidas grandes
}

const imagenUrl = computed(() => {
  return props.producto?.imagenUrl || '/images/pizza-1.jpg'
})

const precioBase = computed(() => {
  if (!props.producto) return 0
  return typeof props.producto.precio === 'string' 
    ? parseFloat(props.producto.precio) 
    : props.producto.precio
})

const precioConTamaño = computed(() => {
  if (!tamañoSeleccionado.value) return precioBase.value
  const multiplicador = preciosPorTamaño[tamañoSeleccionado.value] || 1.0
  return precioBase.value * multiplicador
})

const precioTotal = computed(() => {
  return precioConTamaño.value * cantidad.value
})

const tieneTamañosDisponibles = computed(() => {
  return props.producto?.tamañosDisponibles && 
         props.producto.tamañosDisponibles.length > 0
})

// Formatear nombre del tamaño para mostrar
const formatearTamaño = (tamaño: string) => {
  return tamaño.charAt(0).toUpperCase() + tamaño.slice(1)
}

// Inicializar tamaño por defecto cuando se abre el modal
watch(() => props.show, (newVal) => {
  if (newVal && props.producto) {
    if (tieneTamañosDisponibles.value && props.producto.tamañosDisponibles) {
      tamañoSeleccionado.value = props.producto.tamañosDisponibles[0]
    } else {
      tamañoSeleccionado.value = ''
    }
  }
})

const handleAddToCart = () => {
  if (props.producto) {
    const tamaño = tieneTamañosDisponibles.value ? tamañoSeleccionado.value : undefined
    emit('addToCart', props.producto, cantidad.value, tamaño, precioConTamaño.value, notas.value || undefined)
    handleClose()
  }
}

const handleClose = () => {
  cantidad.value = 1
  tamañoSeleccionado.value = ''
  notas.value = ''
  emit('close')
}
</script>

<template>
  <div 
    v-if="show && producto" 
    class="modal fade show" 
    style="display: block; background: rgba(0,0,0,0.5);"
    @click.self="handleClose"
  >
    <div class="modal-dialog modal-lg modal-dialog-centered">
      <div class="modal-content">
        <!-- Header -->
        <div class="modal-header bg-primary text-white">
          <h5 class="modal-title">
            <i class="fa fa-pizza-slice mr-2"></i>{{ producto.nombre }}
          </h5>
          <button type="button" class="close text-white" @click="handleClose">
            <span>&times;</span>
          </button>
        </div>

        <!-- Body -->
        <div class="modal-body compact-modal-body">
          <div class="row">
            <!-- Imagen -->
            <div class="col-md-5">
              <img 
                :src="imagenUrl" 
                :alt="producto.nombre"
                class="img-fluid rounded product-image"
              >
              <div class="mt-2">
                <span v-if="producto.destacado" class="badge badge-warning">
                  <i class="fa fa-star mr-1"></i>Destacado
                </span>
              </div>
            </div>

            <!-- Detalles -->
            <div class="col-md-7">
              <!-- Precio -->
              <div class="price-section mb-2">
                <h4 class="text-primary mb-0">
                  Bs. {{ precioConTamaño.toFixed(2) }}
                  <span v-if="tamañoSeleccionado && precioConTamaño !== precioBase" class="price-old">
                    Bs. {{ precioBase.toFixed(2) }}
                  </span>
                </h4>
              </div>

              <!-- Descripción compacta -->
              <p class="text-muted description-compact mb-2">{{ producto.descripcion }}</p>

              <!-- Selector de Tamaño (compacto) -->
              <div v-if="tieneTamañosDisponibles" class="form-group mb-2">
                <label class="mb-1"><strong>Tamaño:</strong></label>
                <div class="size-selector">
                  <label 
                    v-for="tamaño in producto.tamañosDisponibles" 
                    :key="tamaño"
                    class="size-option"
                    :class="{ active: tamañoSeleccionado === tamaño }"
                  >
                    <input 
                      type="radio" 
                      name="tamaño" 
                      :value="tamaño"
                      v-model="tamañoSeleccionado"
                    >
                    <span class="size-name">{{ formatearTamaño(tamaño) }}</span>
                    <span class="size-price">+{{ ((preciosPorTamaño[tamaño] - 1) * 100).toFixed(0) }}%</span>
                  </label>
                </div>
              </div>

              <!-- Cantidad y Notas en la misma fila -->
              <div class="row mb-2">
                <div class="col-md-6">
                  <label class="mb-1"><strong>Cantidad:</strong></label>
                  <div class="quantity-control">
                    <button 
                      class="qty-btn"
                      type="button"
                      @click="cantidad = Math.max(1, cantidad - 1)"
                    >
                      <i class="fa fa-minus"></i>
                    </button>
                    <input 
                      type="number" 
                      class="qty-input" 
                      v-model.number="cantidad"
                      min="1"
                      max="99"
                    >
                    <button 
                      class="qty-btn"
                      type="button"
                      @click="cantidad = Math.min(99, cantidad + 1)"
                    >
                      <i class="fa fa-plus"></i>
                    </button>
                  </div>
                </div>
                <div class="col-md-6">
                  <label class="mb-1"><strong>Total:</strong></label>
                  <div class="total-display">
                    Bs. {{ precioTotal.toFixed(2) }}
                  </div>
                </div>
              </div>

              <!-- Notas especiales (compactas) -->
              <div class="form-group mb-0">
                <label class="mb-1"><strong>Notas:</strong></label>
                <textarea 
                  id="notas"
                  class="form-control form-control-sm" 
                  v-model="notas"
                  rows="2"
                  placeholder="Ej: Sin cebolla, extra queso..."
                  maxlength="200"
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="handleClose">
            <i class="fa fa-times mr-1"></i> Cancelar
          </button>
          <button 
            type="button" 
            class="btn btn-primary"
            @click="handleAddToCart"
            :disabled="!producto.disponible"
          >
            <i class="fa fa-shopping-cart mr-1"></i>
            {{ producto.disponible ? 'Añadir al carrito' : 'No disponible' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal.show {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.modal-content {
  animation: slideUp 0.3s ease;
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

/* Asegurar que los labels sean visibles */
.form-group label {
  color: #2c3e50 !important;
  font-weight: 600;
}

/* Asegurar que los inputs sean visibles */
.form-control {
  color: #2c3e50 !important;
  background-color: #ffffff !important;
  border: 1px solid #ced4da !important;
}

.form-control:focus {
  color: #2c3e50 !important;
  background-color: #ffffff !important;
  border-color: #80bdff !important;
}

.form-control::placeholder {
  color: #6c757d !important;
  opacity: 0.7;
}

/* Texto pequeño debajo del textarea */
.form-text {
  color: #6c757d !important;
}

/* Badge personalizado */
.badge {
  font-size: 0.85rem;
  padding: 0.35rem 0.65rem;
  font-weight: 600;
}

.badge-primary {
  background-color: #fca100 !important;
  color: white;
}

/* Estilos compactos para el modal */
.compact-modal-body {
  padding: 1rem 1.5rem;
  max-height: 70vh;
  overflow-y: auto;
}

.product-image {
  width: 100%;
  height: 220px;
  object-fit: cover;
}

.price-section h4 {
  font-size: 1.5rem;
  line-height: 1.2;
}

.price-old {
  font-size: 0.85rem;
  color: #6c757d;
  text-decoration: line-through;
  margin-left: 8px;
}

.description-compact {
  font-size: 0.9rem;
  line-height: 1.4;
  max-height: 60px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
}

/* Selector de tamaños compacto */
.size-selector {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.size-option {
  flex: 1;
  min-width: 90px;
  background: white;
  border: 2px solid #dee2e6;
  border-radius: 8px;
  padding: 8px 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
  position: relative;
  margin: 0;
}

.size-option input {
  display: none;
}

.size-option .size-name {
  display: block;
  font-weight: 600;
  font-size: 0.9rem;
  color: #2c3e50;
  margin-bottom: 2px;
}

.size-option .size-price {
  display: block;
  font-size: 0.75rem;
  color: #6c757d;
}

.size-option:hover {
  border-color: #fca100;
  background: rgba(252, 161, 0, 0.05);
}

.size-option.active {
  border-color: #fca100;
  background: linear-gradient(135deg, rgba(252, 161, 0, 0.1), rgba(232, 90, 25, 0.1));
  box-shadow: 0 2px 8px rgba(252, 161, 0, 0.2);
}

.size-option.active .size-name {
  color: #fca100;
}

.size-option.active .size-price {
  color: #fca100;
  font-weight: 600;
}

/* Control de cantidad compacto */
.quantity-control {
  display: flex;
  align-items: center;
  background: white;
  border: 1px solid #ced4da;
  border-radius: 6px;
  overflow: hidden;
  height: 38px;
}

.qty-btn {
  background: #f8f9fa;
  border: none;
  color: #fca100;
  width: 36px;
  height: 100%;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}

.qty-btn:hover {
  background: #fca100;
  color: white;
}

.qty-input {
  border: none;
  text-align: center;
  width: 50px;
  height: 100%;
  font-weight: 600;
  color: #2c3e50;
  padding: 0;
  -moz-appearance: textfield;
}

.qty-input::-webkit-outer-spin-button,
.qty-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.qty-input:focus {
  outline: none;
  box-shadow: none;
}

/* Display del total */
.total-display {
  background: linear-gradient(135deg, #28a745, #20c997);
  color: white;
  font-size: 1.3rem;
  font-weight: 700;
  padding: 6px 12px;
  border-radius: 6px;
  text-align: center;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(40, 167, 69, 0.3);
}

/* Labels compactos */
.form-group label {
  font-size: 0.9rem;
  margin-bottom: 0.25rem !important;
}

/* Textarea compacto */
.form-control-sm {
  font-size: 0.85rem;
  padding: 0.4rem 0.6rem;
}

/* Scrollbar del body */
.compact-modal-body::-webkit-scrollbar {
  width: 6px;
}

.compact-modal-body::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.compact-modal-body::-webkit-scrollbar-thumb {
  background: #fca100;
  border-radius: 3px;
}

/* Responsive */
@media (max-width: 767px) {
  .product-image {
    height: 180px;
  }

  .compact-modal-body {
    max-height: 65vh;
  }

  .size-option {
    min-width: 80px;
    padding: 6px 4px;
  }

  .size-option .size-name {
    font-size: 0.85rem;
  }

  .total-display {
    font-size: 1.1rem;
    margin-top: 0.5rem;
  }
}
</style>
