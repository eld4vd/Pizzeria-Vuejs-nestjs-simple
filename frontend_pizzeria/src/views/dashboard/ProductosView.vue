<script setup lang="ts">
import { ref } from 'vue'
import ProductoList from '@/components/producto/ProductoList.vue'
import ProductoSave from '@/components/producto/ProductoSave.vue'
import type { Producto } from '@/models/producto'

const listRef = ref<InstanceType<typeof ProductoList> | null>(null)
const saveRef = ref<InstanceType<typeof ProductoSave> | null>(null)
const productoSeleccionado = ref<Producto | null>(null)

const handleNuevo = () => {
  productoSeleccionado.value = null
  saveRef.value?.abrir()
}

const handleEditar = (producto: Producto) => {
  productoSeleccionado.value = producto
}

const handleGuardado = () => {
  productoSeleccionado.value = null
  listRef.value?.obtenerLista()
}

const handleCancelar = () => {
  productoSeleccionado.value = null
}
</script>

<template>
  <div class="container-fluid">
    <!-- Header -->
    <div class="row mb-4">
      <div class="col-12">
        <div class="d-flex justify-content-between align-items-center">
          <div>
            <h2 class="mb-1">
              <i class="fas fa-pizza-slice text-primary mr-2"></i>
              Gestión de Productos
            </h2>
            <p class="text-muted mb-0">
              Administra el catálogo de productos que verán los clientes online
            </p>
          </div>
          <button @click="handleNuevo" class="btn btn-primary btn-lg">
            <i class="fas fa-plus mr-2"></i>
            Nuevo Producto
          </button>
        </div>
      </div>
    </div>

    <!-- Lista -->
    <div class="row">
      <div class="col-12">
        <ProductoList 
          ref="listRef"
          @edit="handleEditar"
        />
      </div>
    </div>

    <!-- Modal -->
    <ProductoSave
      ref="saveRef"
      :producto="productoSeleccionado"
      @saved="handleGuardado"
      @cancel="handleCancelar"
    />
  </div>
</template>
