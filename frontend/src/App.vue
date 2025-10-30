<script setup lang="ts">
import { RouterView } from 'vue-router'
import MainHeader from './components/MainHeader.vue'
import MainFooter from './components/MainFooter.vue'
</script>

<template>
  <MainHeader />
  <RouterView />
  <MainFooter />
</template>

<style>
/* Reset de estilos de Vue para usar solo el template */
#app {
  max-width: 100%;
  margin: 0;
  padding: 0;
  font-weight: normal;
}

* {
  margin: 0;
  padding: 0;
}
</style>
