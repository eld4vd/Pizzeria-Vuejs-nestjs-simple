<script setup lang="ts">
import { ref } from 'vue'
import IngredienteList from '@/components/ingrediente/IngredienteList.vue'
import IngredienteSave from '@/components/ingrediente/IngredienteSave.vue'
import type { Ingrediente } from '@/models/ingrediente'

const listRef = ref<InstanceType<typeof IngredienteList> | null>(null)
const saveRef = ref<InstanceType<typeof IngredienteSave> | null>(null)
const ingredienteSeleccionado = ref<Ingrediente | null>(null)

const handleNuevo = () => {
  ingredienteSeleccionado.value = null
  saveRef.value?.abrir()
}

const handleEditar = (ingrediente: Ingrediente) => {
  ingredienteSeleccionado.value = ingrediente
}

const handleGuardado = () => {
  ingredienteSeleccionado.value = null
  listRef.value?.obtenerLista()
}

const handleCancelar = () => {
  ingredienteSeleccionado.value = null
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
              <i class="fas fa-leaf text-primary mr-2"></i>
              Gestión de Ingredientes
            </h2>
            <p class="text-muted mb-0">Administra los ingredientes de tus productos</p>
          </div>
          <button @click="handleNuevo" class="btn btn-primary btn-lg">
            <i class="fas fa-plus mr-2"></i>
            Nuevo Ingrediente
          </button>
        </div>
      </div>
    </div>

    <!-- Lista -->
    <div class="row">
      <div class="col-12">
        <IngredienteList 
          ref="listRef"
          @edit="handleEditar"
        />
      </div>
    </div>

    <!-- Modal -->
    <IngredienteSave
      ref="saveRef"
      :ingrediente="ingredienteSeleccionado"
      @saved="handleGuardado"
      @cancel="handleCancelar"
    />
  </div>
</template>
