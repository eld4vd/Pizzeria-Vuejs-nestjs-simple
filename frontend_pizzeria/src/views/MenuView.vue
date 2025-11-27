<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import axios from '@/plugins/axios'
import { useCartStore } from '@/stores/cart'
import { useToast } from 'vue-toastification'
import ProductoCard from '@/components/producto/ProductoCard.vue'
import ProductoModal from '@/components/producto/ProductoModal.vue'
import type { Producto } from '@/models/producto'

const cartStore = useCartStore()
const toast = useToast()

// Variable para el intervalo de auto-refresh
let refreshInterval: number | null = null

// Estado
const productos = ref<Producto[]>([])
const loading = ref(true)
const error = ref('')
const categoriaSeleccionada = ref<string | null>(null)
const busqueda = ref('')
const selectedProducto = ref<Producto | null>(null)
const showModal = ref(false)

// Computed
const productosFiltrados = computed(() => {
  console.log('📊 Total de productos cargados:', productos.value.length)
  console.log('📊 Productos disponibles:', productos.value.filter(p => p.disponible).length)
  
  let result = productos.value.filter(p => p.disponible)

  // Filtrar por categoría
  if (categoriaSeleccionada.value) {
    result = result.filter(p => p.categoria === categoriaSeleccionada.value)
    console.log(`📊 Productos en categoría ${categoriaSeleccionada.value}:`, result.length)
  }

  // Filtrar por búsqueda
  if (busqueda.value.trim()) {
    const searchTerm = busqueda.value.toLowerCase()
    result = result.filter(p => 
      p.nombre.toLowerCase().includes(searchTerm) ||
      p.descripcion.toLowerCase().includes(searchTerm)
    )
    console.log(`📊 Productos con búsqueda "${searchTerm}":`, result.length)
  }

  console.log('📊 Productos filtrados finales:', result.length)
  return result
})

// Orden de prioridad de categorías: Pizzas primero, Bebidas al final
const ordenCategorias = ['Pizza', 'Hamburguesa', 'Postre', 'Entrada', 'Bebida']

// Productos agrupados por categoría cuando se selecciona "Todos"
const productosAgrupadosPorCategoria = computed(() => {
  if (categoriaSeleccionada.value !== null) {
    // Si hay categoría específica, no agrupar
    return []
  }

  // Agrupar productos por categoría
  const grupos: { [key: string]: { categoria: string, productos: Producto[] } } = {}
  
  productosFiltrados.value.forEach(producto => {
    const cat = producto.categoria
    if (!grupos[cat]) {
      grupos[cat] = {
        categoria: cat,
        productos: []
      }
    }
    grupos[cat].productos.push(producto)
  })

  // Convertir a array y ordenar por prioridad
  const gruposArray = Object.values(grupos)
  
  // Ordenar: pizza primero, bebida al final
  gruposArray.sort((a, b) => {
    const ordenMap: { [key: string]: number } = { pizza: 1, bebida: 2 }
    return (ordenMap[a.categoria] || 99) - (ordenMap[b.categoria] || 99)
  })

  console.log('📊 Productos agrupados por categoría:', gruposArray.map(g => ({
    categoria: g.categoria,
    cantidad: g.productos.length
  })))

  return gruposArray
})

const productosDestacados = computed(() => {
  const destacados = productosFiltrados.value.filter(p => p.destacado).slice(0, 6)
  console.log('⭐ Productos destacados:', destacados.length)
  return destacados
})

const productosLista = computed(() => {
  const lista = productosFiltrados.value.slice(0, 8)
  console.log('📝 Productos en lista:', lista.length)
  return lista
})

// Métodos
const cargarDatos = async () => {
  try {
    loading.value = true
    error.value = ''

    console.log('🔄 Cargando productos...')

    const productosRes = await axios.get('/productos')

    console.log('✅ Productos recibidos:', productosRes.data.length)
    console.log('📦 Productos:', productosRes.data)

    productos.value = productosRes.data
  } catch (err: any) {
    console.error('❌ Error al cargar datos:', err)
    console.error('Error completo:', err.response || err)
    error.value = 'Error al cargar el menú. Por favor, intenta nuevamente.'
  } finally {
    loading.value = false
  }
}

const handleAddToCart = (producto: Producto) => {
  selectedProducto.value = producto
  showModal.value = true
}

const handleAddToCartFromModal = (producto: Producto, cantidad: number, tamaño: string | undefined, precioFinal: number, notas?: string) => {
  cartStore.addItem(producto, cantidad, tamaño, precioFinal, notas)
  const tamañoTexto = tamaño ? ` (${tamaño})` : ''
  toast.success(`${producto.nombre}${tamañoTexto} añadido al carrito (${cantidad})`, {
    position: 'top-right',
    timeout: 2000
  })
}

const handleViewDetails = (producto: Producto) => {
  selectedProducto.value = producto
  showModal.value = true
}

const filtrarPorCategoria = (categoria: string | null) => {
  categoriaSeleccionada.value = categoria
}

onMounted(() => {
  cargarDatos()
  
  // Auto-refresh cada 60 segundos (1 minuto)
  refreshInterval = setInterval(() => {
    console.log('🔄 Auto-refresh: Actualizando productos...')
    cargarDatos()
  }, 60000) // 60000ms = 1 minuto
  
  nextTick(() => {
    setTimeout(() => {
      if (typeof (window as any).AOS !== 'undefined') {
        (window as any).AOS.refresh()
      }
    }, 500)
  })
})

onUnmounted(() => {
  // Limpiar el intervalo cuando el componente se desmonte
  if (refreshInterval) {
    clearInterval(refreshInterval)
    refreshInterval = null
  }
})
</script>

<template>
  <!-- Hero Section -->
  <section class="home-slider owl-carousel img" style="background-image: url(/images/bg_1.jpg);">
    <div class="slider-item" style="background-image: url(/images/bg_3.jpg);">
      <div class="overlay"></div>
      <div class="container">
        <div class="row slider-text justify-content-center align-items-center">
          <div class="col-md-7 col-sm-12 text-center ftco-animate">
            <h1 class="mb-3 mt-5 bread">Nuestro Menú</h1>
            <p class="breadcrumbs"><span class="mr-2"><router-link to="/">Inicio</router-link></span> <span>Menú</span></p>
          </div>
        </div>
      </div>
    </div>
  </section>
  
  <!-- Menu Section -->
  <section class="ftco-section">
    <!-- Título del Menú -->
    <div class="container">
      <div class="row justify-content-center mb-5 pb-3">
        <div class="col-md-7 heading-section ftco-animate text-center">
          <h2 class="mb-4">Nuestro Menú</h2>
          <p>Descubre nuestras deliciosas pizzas artesanales, preparadas con los mejores ingredientes.</p>
        </div>
      </div>
    </div>

    <!-- Filtros y Búsqueda -->
    <div class="container mb-4">
      <div class="row">
        <!-- Búsqueda -->
        <div class="col-md-6 mb-3">
          <div class="input-group">
            <input 
              type="text" 
              class="form-control" 
              placeholder="Buscar productos..."
              v-model="busqueda"
            >
            <div class="input-group-append">
              <span class="input-group-text">
                <i class="fa fa-search"></i>
              </span>
            </div>
          </div>
        </div>

        <!-- Filtro de categorías -->
        <div class="col-md-6 mb-3">
          <div class="btn-group d-flex flex-wrap" role="group">
            <button 
              type="button" 
              class="btn"
              :class="categoriaSeleccionada === null ? 'btn-primary' : 'btn-outline-primary'"
              @click="filtrarPorCategoria(null)"
            >
              Todas
            </button>
            <button 
              type="button" 
              class="btn"
              :class="categoriaSeleccionada === 'pizza' ? 'btn-primary' : 'btn-outline-primary'"
              @click="filtrarPorCategoria('pizza')"
            >
              🍕 Pizzas
            </button>
            <button 
              type="button" 
              class="btn"
              :class="categoriaSeleccionada === 'bebida' ? 'btn-primary' : 'btn-outline-primary'"
              @click="filtrarPorCategoria('bebida')"
            >
              🥤 Bebidas
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="container">
      <div class="row">
        <div class="col-12 text-center py-5">
          <div class="spinner-border text-primary" role="status">
            <span class="sr-only">Cargando...</span>
          </div>
          <p class="mt-3">Cargando menú...</p>
        </div>
      </div>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="container">
      <div class="row">
        <div class="col-12">
          <div class="alert alert-danger" role="alert">
            <i class="fa fa-exclamation-triangle mr-2"></i>
            {{ error }}
          </div>
        </div>
      </div>
    </div>

    <!-- Productos en Grid -->
    <div v-else-if="productosFiltrados.length > 0">
      <!-- Vista agrupada por categorías (cuando se selecciona "Todos") -->
      <div v-if="categoriaSeleccionada === null && productosAgrupadosPorCategoria.length > 0">
        <div 
          v-for="grupo in productosAgrupadosPorCategoria" 
          :key="grupo.categoria.id"
          class="mb-5"
        >
          <!-- Título de la categoría -->
          <div class="container">
            <div class="row">
              <div class="col-12">
                <div class="category-header">
                  <h3 class="category-title">
                    <i class="fas fa-utensils mr-2"></i>
                    {{ grupo.categoria.nombre }}
                  </h3>
                  <p class="category-description">{{ grupo.categoria.descripcion }}</p>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Productos de esta categoría -->
          <div class="container-wrap">
            <div class="row no-gutters d-flex">
              <ProductoCard
                v-for="producto in grupo.productos"
                :key="producto.id"
                :producto="producto"
                layout="grid"
                @add-to-cart="handleAddToCart"
                @view-details="handleViewDetails"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Vista normal (cuando hay categoría seleccionada o búsqueda) -->
      <div v-else class="container-wrap">
        <div class="row no-gutters d-flex">
          <!-- Mostrar todos los productos filtrados -->
          <ProductoCard
            v-for="producto in productosFiltrados"
            :key="producto.id"
            :producto="producto"
            layout="grid"
            @add-to-cart="handleAddToCart"
            @view-details="handleViewDetails"
          />
        </div>
      </div>
    </div>

    <!-- Sin resultados -->
    <div v-else class="container">
      <div class="row">
        <div class="col-12 text-center py-5">
          <i class="fa fa-pizza-slice" style="font-size: 4rem; color: #ccc;"></i>
          <p class="mt-3 text-muted">No se encontraron productos disponibles.</p>
          <p class="text-muted small">Total productos cargados: {{ productos.length }}</p>
          <button @click="cargarDatos" class="btn btn-primary mt-3">
            <i class="fa fa-refresh mr-2"></i>Recargar
          </button>
        </div>
      </div>
    </div>

    <!-- Lista de Precios -->
    <div v-if="!loading && productosLista.length > 0" class="container">
      <div class="row justify-content-center mb-5 pb-3 mt-5 pt-5">
        <div class="col-md-7 heading-section text-center ftco-animate">
          <h2 class="mb-4">Lista de Productos</h2>
          <p class="flip"><span class="deg1"></span><span class="deg2"></span><span class="deg3"></span></p>
          <p class="mt-5">Todos nuestros productos están preparados con ingredientes frescos y de la más alta calidad.</p>
        </div>
      </div>
      <div class="row">
        <div class="col-md-6">
          <ProductoCard
            v-for="(producto, index) in productosLista.slice(0, Math.ceil(productosLista.length / 2))"
            :key="producto.id"
            :producto="producto"
            layout="list"
            @add-to-cart="handleAddToCart"
            @view-details="handleViewDetails"
          />
        </div>

        <div class="col-md-6">
          <ProductoCard
            v-for="producto in productosLista.slice(Math.ceil(productosLista.length / 2))"
            :key="producto.id"
            :producto="producto"
            layout="list"
            @add-to-cart="handleAddToCart"
            @view-details="handleViewDetails"
          />
        </div>
      </div>
    </div>

    <!-- Modal de Producto -->
    <ProductoModal
      :producto="selectedProducto"
      :show="showModal"
      @close="showModal = false"
      @add-to-cart="handleAddToCartFromModal"
    />
  </section>
</template>

<style scoped>
/* Títulos de Categoría */
.category-header {
  text-align: center;
  padding: 2rem 0 1rem;
  margin-bottom: 1.5rem;
  border-bottom: 3px solid #fca100;
  position: relative;
}

.category-header::after {
  content: '';
  position: absolute;
  bottom: -3px;
  left: 50%;
  transform: translateX(-50%);
  width: 100px;
  height: 3px;
  background: #e85a19;
}

.category-title {
  color: #2c3e50;
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.category-title i {
  color: #fca100;
  font-size: 1.8rem;
}

.category-description {
  color: #6c757d;
  font-size: 1rem;
  margin: 0;
  font-style: italic;
}

/* Filtros */
.btn-group {
  gap: 0.5rem;
}

.btn-group .btn {
  border-radius: 20px !important;
  font-size: 0.9rem;
  padding: 0.5rem 1rem;
  transition: all 0.3s ease;
}

.btn-group .btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

/* Input de búsqueda */
.input-group input {
  border-radius: 25px 0 0 25px !important;
  border-right: none;
}

.input-group-append .input-group-text {
  border-radius: 0 25px 25px 0 !important;
  border-left: none;
  background: white;
  cursor: pointer;
}

/* Animaciones */
.ftco-animate {
  animation: fadeInUp 0.6s ease;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive */
@media (max-width: 768px) {
  .btn-group {
    flex-direction: column;
  }
  
  .btn-group .btn {
    width: 100%;
    margin-bottom: 0.5rem;
  }

  .category-title {
    font-size: 1.5rem;
  }

  .category-title i {
    font-size: 1.3rem;
  }
}
</style>
