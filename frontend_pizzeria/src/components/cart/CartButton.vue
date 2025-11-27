<script setup lang="ts">
import { computed } from 'vue'
import { useCartStore } from '@/stores/cart'

const cartStore = useCartStore()

const emit = defineEmits<{
  openCart: []
}>()

const itemCount = computed(() => cartStore.itemCount)
const hasItems = computed(() => itemCount.value > 0)

const handleClick = () => {
  emit('openCart')
}
</script>

<template>
  <button 
    class="cart-button"
    :class="{ 'has-items': hasItems }"
    @click="handleClick"
    title="Ver carrito"
  >
    <i class="fas fa-shopping-cart"></i>
    <span v-if="hasItems" class="cart-badge">{{ itemCount }}</span>
  </button>
</template>

<style scoped>
.cart-button {
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #fca100, #e85a19);
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(252, 161, 0, 0.4);
  transition: all 0.3s ease;
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cart-button:hover {
  transform: translateY(-5px) scale(1.1);
  box-shadow: 0 6px 20px rgba(252, 161, 0, 0.6);
}

.cart-button.has-items {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    box-shadow: 0 4px 15px rgba(252, 161, 0, 0.4);
  }
  50% {
    box-shadow: 0 4px 25px rgba(252, 161, 0, 0.7);
  }
}

.cart-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background: #dc3545;
  color: white;
  border-radius: 50%;
  width: 25px;
  height: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
  border: 2px solid white;
  animation: scaleIn 0.3s ease;
}

@keyframes scaleIn {
  from {
    transform: scale(0);
  }
  to {
    transform: scale(1);
  }
}

@media (max-width: 768px) {
  .cart-button {
    width: 55px;
    height: 55px;
    bottom: 20px;
    right: 20px;
    font-size: 20px;
  }
  
  .cart-badge {
    width: 22px;
    height: 22px;
    font-size: 11px;
  }
}
</style>
