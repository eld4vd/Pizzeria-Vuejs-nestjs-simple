<script setup lang="ts">
import { ref } from 'vue'
import ProveedorList from '@/components/proveedor/ProveedorList.vue'
import ProveedorSave from '@/components/proveedor/ProveedorSave.vue'
import type { Proveedor } from '@/models/proveedor'

const proveedorListRef = ref<InstanceType<typeof ProveedorList> | null>(null)
const proveedorSaveRef = ref<InstanceType<typeof ProveedorSave> | null>(null)

const crearProveedor = () => {
  proveedorSaveRef.value?.abrir()
}

const editarProveedor = (proveedor: Proveedor) => {
  proveedorSaveRef.value?.abrir(proveedor)
}

const actualizarLista = () => {
  proveedorListRef.value?.cargarProveedores()
}
</script>

<template>
  <div class="container-fluid py-4">
    <div class="row">
      <div class="col-12">
        <h2 class="mb-4">
          <i class="fas fa-truck mr-2 text-primary"></i>
          Gestión de Proveedores
        </h2>
      </div>
    </div>

    <div class="row">
      <div class="col-12">
        <ProveedorList
          ref="proveedorListRef"
          @create="crearProveedor"
          @edit="editarProveedor"
        />
      </div>
    </div>

    <ProveedorSave
      ref="proveedorSaveRef"
      @saved="actualizarLista"
    />
  </div>
</template>

<style scoped>
h2 {
  font-weight: 600;
}
</style>
