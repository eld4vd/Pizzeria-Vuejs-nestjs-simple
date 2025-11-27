<script setup lang="ts">
import { computed, ref } from 'vue'
import { useCartStore } from '@/stores/cart'
import { useRouter } from 'vue-router'
import CheckoutModal from '@/components/checkout/CheckoutModal.vue'

interface Props {
  show: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
}>()

const cartStore = useCartStore()
const router = useRouter()

const items = computed(() => cartStore.items)
const total = computed(() => cartStore.total)
const hasItems = computed(() => items.value.length > 0)

// Estado para el modal de checkout
const showCheckout = ref(false)

const formatPrice = (price: number | string) => {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price
  return `Bs. ${numPrice.toFixed(2)}`
}

const updateQuantity = (productoId: number, cantidad: number) => {
  if (cantidad <= 0) {
    if (confirm('¿Deseas eliminar este producto del carrito?')) {
      cartStore.removeItem(productoId)
    }
  } else {
    cartStore.updateQuantity(productoId, cantidad)
  }
}

const removeItem = (productoId: number, nombreProducto: string) => {
  if (confirm(`¿Deseas eliminar "${nombreProducto}" del carrito?`)) {
    cartStore.removeItem(productoId)
  }
}

const clearCart = () => {
  if (confirm('¿Deseas vaciar todo el carrito?')) {
    cartStore.clearCart()
  }
}

const handleCheckout = () => {
  emit('close')
  showCheckout.value = true
}

const closeCheckout = () => {
  showCheckout.value = false
}

const handleClose = () => {
  emit('close')
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div 
        v-if="show" 
        class="modal-overlay"
        @click.self="handleClose"
      >
        <div class="cart-modal">
          <!-- Header -->
          <div class="cart-header">
            <h3 class="cart-title">
              <i class="fas fa-shopping-cart mr-2"></i>
              Mi Carrito
              <span v-if="hasItems" class="item-count">({{ items.length }})</span>
            </h3>
            <button class="close-btn" @click="handleClose">
              <i class="fas fa-times"></i>
            </button>
          </div>

          <!-- Body -->
          <div class="cart-body">
            <!-- Carrito vacío -->
            <div v-if="!hasItems" class="empty-cart">
              <i class="fas fa-shopping-basket"></i>
              <p>Tu carrito está vacío</p>
              <router-link to="/menu" class="btn btn-primary" @click="handleClose">
                <i class="fas fa-utensils mr-2"></i>
                Ver menú
              </router-link>
            </div>

            <!-- Items del carrito -->
            <div v-else class="cart-items">
              <div 
                v-for="item in items" 
                :key="item.producto.id"
                class="cart-item"
              >
                <!-- Imagen -->
                <div 
                  class="item-image"
                  :style="{ backgroundImage: `url(${item.producto.imagenUrl || '/images/pizza-1.jpg'})` }"
                ></div>

                <!-- Info -->
                <div class="item-info">
                  <h4 class="item-name">
                    {{ item.producto.nombre }}
                    <span v-if="item.tamaño" class="size-badge">{{ item.tamaño }}</span>
                  </h4>
                  <p class="item-price">{{ formatPrice(item.precioFinal) }} c/u</p>
                  <p v-if="item.notas" class="item-notes">
                    <i class="fas fa-sticky-note mr-1"></i>
                    {{ item.notas }}
                  </p>
                </div>

                <!-- Controles -->
                <div class="item-controls">
                  <div class="quantity-controls">
                    <button 
                      class="qty-btn"
                      @click="updateQuantity(item.producto.id, item.cantidad - 1)"
                    >
                      <i class="fas fa-minus"></i>
                    </button>
                    <span class="quantity">{{ item.cantidad }}</span>
                    <button 
                      class="qty-btn"
                      @click="updateQuantity(item.producto.id, item.cantidad + 1)"
                    >
                      <i class="fas fa-plus"></i>
                    </button>
                  </div>
                  <p class="item-subtotal">{{ formatPrice(item.precioFinal * item.cantidad) }}</p>
                  <button 
                    class="remove-btn"
                    @click="removeItem(item.producto.id, item.producto.nombre)"
                    title="Eliminar"
                  >
                    <i class="fas fa-trash-alt"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div v-if="hasItems" class="cart-footer">
            <div class="cart-total">
              <span class="total-label">Total:</span>
              <span class="total-amount">{{ formatPrice(total) }}</span>
            </div>
            <div class="cart-actions">
              <button class="btn btn-outline-danger" @click="clearCart">
                <i class="fas fa-trash mr-2"></i>
                Vaciar carrito
              </button>
              <button class="btn btn-primary" @click="handleCheckout">
                <i class="fas fa-check-circle mr-2"></i>
                Finalizar pedido
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Checkout Modal -->
    <CheckoutModal :show="showCheckout" @close="closeCheckout" />
  </Teleport>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: flex-end;
  z-index: 9999;
  padding: 0;
}

.cart-modal {
  background: white;
  width: 100%;
  max-width: 500px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  box-shadow: -4px 0 20px rgba(0, 0, 0, 0.2);
  animation: slideInRight 0.3s ease;
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}

/* Header */
.cart-header {
  padding: 20px 25px;
  background: linear-gradient(135deg, #fca100, #e85a19);
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
}

.cart-title {
  margin: 0;
  font-size: 22px;
  font-weight: 700;
  display: flex;
  align-items: center;
}

.item-count {
  font-size: 16px;
  opacity: 0.9;
  margin-left: 5px;
}

.close-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  width: 35px;
  height: 35px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: rotate(90deg);
}

/* Body */
.cart-body {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.empty-cart {
  text-align: center;
  padding: 60px 20px;
}

.empty-cart i {
  font-size: 80px;
  color: #dee2e6;
  margin-bottom: 20px;
}

.empty-cart p {
  font-size: 18px;
  color: #6c757d;
  margin-bottom: 25px;
}

/* Cart Items */
.cart-items {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.cart-item {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 15px;
  display: flex;
  gap: 15px;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.cart-item:hover {
  border-color: #fca100;
  box-shadow: 0 4px 12px rgba(252, 161, 0, 0.15);
}

.item-image {
  width: 80px;
  height: 80px;
  border-radius: 10px;
  background-size: cover;
  background-position: center;
  flex-shrink: 0;
}

.item-info {
  flex: 1;
  min-width: 0;
}

.item-name {
  font-size: 16px;
  font-weight: 700;
  color: #2c3e50;
  margin: 0 0 5px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item-price {
  color: #6c757d;
  font-size: 14px;
  margin: 0 0 5px 0;
}

.item-notes {
  font-size: 12px;
  color: #6c757d;
  font-style: italic;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.size-badge {
  display: inline-block;
  background: linear-gradient(135deg, #fca100, #e85a19);
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  margin-left: 8px;
  text-transform: capitalize;
  vertical-align: middle;
}

.item-controls {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 10px;
  background: white;
  border-radius: 20px;
  padding: 5px 10px;
}

.qty-btn {
  background: none;
  border: none;
  color: #fca100;
  width: 25px;
  height: 25px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
}

.qty-btn:hover {
  background: #fca100;
  color: white;
}

.quantity {
  font-weight: 700;
  color: #2c3e50;
  min-width: 25px;
  text-align: center;
}

.item-subtotal {
  font-weight: 700;
  color: #28a745;
  font-size: 16px;
  margin: 0;
}

.remove-btn {
  background: none;
  border: none;
  color: #dc3545;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 5px;
  font-size: 14px;
}

.remove-btn:hover {
  color: #c82333;
  transform: scale(1.2);
}

/* Footer */
.cart-footer {
  padding: 20px 25px;
  background: #f8f9fa;
  border-top: 2px solid #dee2e6;
  flex-shrink: 0;
}

.cart-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 15px;
  background: white;
  border-radius: 10px;
}

.total-label {
  font-size: 20px;
  font-weight: 600;
  color: #2c3e50;
}

.total-amount {
  font-size: 26px;
  font-weight: 700;
  color: #28a745;
}

.cart-actions {
  display: flex;
  gap: 10px;
}

.cart-actions .btn {
  flex: 1;
  padding: 12px 20px;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.cart-actions .btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Transitions */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .cart-modal,
.modal-leave-active .cart-modal {
  transition: transform 0.3s ease;
}

.modal-enter-from .cart-modal,
.modal-leave-to .cart-modal {
  transform: translateX(100%);
}

/* Scrollbar */
.cart-body::-webkit-scrollbar {
  width: 8px;
}

.cart-body::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.cart-body::-webkit-scrollbar-thumb {
  background: #fca100;
  border-radius: 4px;
}

.cart-body::-webkit-scrollbar-thumb:hover {
  background: #e85a19;
}

/* Responsive */
@media (max-width: 576px) {
  .cart-modal {
    max-width: 100%;
  }

  .cart-header {
    padding: 15px 20px;
  }

  .cart-title {
    font-size: 18px;
  }

  .cart-body {
    padding: 15px;
  }

  .cart-item {
    padding: 12px;
  }

  .item-image {
    width: 60px;
    height: 60px;
  }

  .cart-actions {
    flex-direction: column;
  }
}
</style>
