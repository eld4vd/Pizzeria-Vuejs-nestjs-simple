<script setup lang="ts">
import { ref } from 'vue'
import TamañoList from '@/components/tamaño/TamañoList.vue'
import TamañoSave from '@/components/tamaño/TamañoSave.vue'
import type { Tamaño } from '@/models/tamaño'

const listRef = ref<InstanceType<typeof TamañoList> | null>(null)
const saveRef = ref<InstanceType<typeof TamañoSave> | null>(null)
const tamañoSeleccionado = ref<Tamaño | null>(null)

const handleNuevo = () => {
  tamañoSeleccionado.value = null
  saveRef.value?.abrir()
}

const handleEditar = (tamaño: Tamaño) => {
  tamañoSeleccionado.value = tamaño
}

const handleGuardado = () => {
  tamañoSeleccionado.value = null
  listRef.value?.obtenerLista()
}

const handleCancelar = () => {
  tamañoSeleccionado.value = null
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
              <i class="fas fa-ruler-combined text-primary mr-2"></i>
              Gestión de Tamaños
            </h2>
            <p class="text-muted mb-0">Administra los tamaños de tus productos</p>
          </div>
          <button @click="handleNuevo" class="btn btn-primary btn-lg">
            <i class="fas fa-plus mr-2"></i>
            Nuevo Tamaño
          </button>
        </div>
      </div>
    </div>

    <!-- Lista -->
    <div class="row">
      <div class="col-12">
        <TamañoList 
          ref="listRef"
          @edit="handleEditar"
        />
      </div>
    </div>

    <!-- Modal -->
    <TamañoSave
      ref="saveRef"
      :tamaño="tamañoSeleccionado"
      @saved="handleGuardado"
      @cancel="handleCancelar"
    />
  </div>
</template>
