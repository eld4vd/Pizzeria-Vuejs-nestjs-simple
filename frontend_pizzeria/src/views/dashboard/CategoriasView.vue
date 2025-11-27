<script setup lang="ts">
import CategoriaList from '@/components/categoria/CategoriaList.vue'
import CategoriaSave from '@/components/categoria/CategoriaSave.vue'
import type { Categoria } from '@/models/categoria'
import { ref } from 'vue'

const mostrarDialog = ref(false)
const categoriaListRef = ref<typeof CategoriaList | null>(null)
const categoriaEdit = ref<any>(null)

function handleCreate() {
  categoriaEdit.value = null
  mostrarDialog.value = true
}

function handleEdit(categoria: Categoria) {
  categoriaEdit.value = categoria
  mostrarDialog.value = true
}

function handleCloseDialog() {
  mostrarDialog.value = false
}

function handleGuardar() {
  categoriaListRef.value?.obtenerLista()
  mostrarDialog.value = false
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
              <i class="fas fa-tags text-primary mr-2"></i>
              Gestión de Categorías
            </h2>
            <p class="text-muted mb-0">
              Gestiona las categorías de productos de tu pizzería
            </p>
          </div>
          <button @click="handleCreate" class="btn btn-primary btn-lg">
            <i class="fas fa-plus mr-2"></i>
            Nueva Categoría
          </button>
        </div>
      </div>
    </div>

    <!-- Lista -->
    <div class="row">
      <div class="col-12">
        <CategoriaList ref="categoriaListRef" @edit="handleEdit" />
      </div>
    </div>

    <CategoriaSave
      :mostrar="mostrarDialog"
      :categoria="categoriaEdit"
      :modoEdicion="!!categoriaEdit"
      @guardar="handleGuardar"
      @close="handleCloseDialog"
    />
  </div>
</template>
