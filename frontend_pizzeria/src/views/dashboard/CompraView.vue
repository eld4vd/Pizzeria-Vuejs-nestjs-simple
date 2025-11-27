<script setup lang="ts">
import { ref } from 'vue'
import CompraList from '@/components/compra/CompraList.vue'
import CompraSave from '@/components/compra/CompraSave.vue'

const compraListRef = ref<InstanceType<typeof CompraList> | null>(null)
const compraSaveRef = ref<InstanceType<typeof CompraSave> | null>(null)

const crearCompra = () => {
  compraSaveRef.value?.abrir()
}

const actualizarLista = () => {
  compraListRef.value?.cargarCompras()
}
</script>

<template>
  <div class="container-fluid py-4">
    <div class="row">
      <div class="col-12">
        <h2 class="mb-4">
          <i class="fas fa-shopping-cart mr-2 text-primary"></i>
          Gestión de Compras
        </h2>
      </div>
    </div>

    <div class="row">
      <div class="col-12">
        <CompraList
          ref="compraListRef"
          @create="crearCompra"
        />
      </div>
    </div>

    <CompraSave
      ref="compraSaveRef"
      @saved="actualizarLista"
    />
  </div>
</template>

<style scoped>
h2 {
  font-weight: 600;
}
</style>
