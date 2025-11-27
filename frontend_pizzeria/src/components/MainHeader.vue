<template>
  <nav
    class="navbar navbar-expand-lg navbar-dark ftco_navbar bg-dark ftco-navbar-light sticky-navbar"
    id="ftco-navbar"
  >
    <div class="container">
      <!-- Logo mejorado -->
      <RouterLink to="/" class="navbar-brand d-flex align-items-center">
        <div class="brand-icon">
          <span class="flaticon-pizza-1"></span>
        </div>
        <div class="brand-text ml-2">
          <span class="brand-title">Mana</span>
          <small class="brand-subtitle d-block">Gourmet Pizza</small>
        </div>
      </RouterLink>

      <button
        class="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#ftco-nav"
        aria-controls="ftco-nav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="oi oi-menu"></span> <span class="ml-1">Menú</span>
      </button>

      <div class="collapse navbar-collapse" id="ftco-nav">
        <ul class="navbar-nav ml-auto align-items-lg-center">
          <!-- Enlaces principales -->
          <li class="nav-item">
            <RouterLink to="/" class="nav-link">
              <i class="fas fa-home d-lg-none mr-1"></i>Inicio
            </RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink to="/menu" class="nav-link">
              <i class="fas fa-utensils d-lg-none mr-1"></i>Menú
            </RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink to="/services" class="nav-link">
              <i class="fas fa-concierge-bell d-lg-none mr-1"></i>Servicios
            </RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink to="/blog" class="nav-link">
              <i class="fas fa-blog d-lg-none mr-1"></i>Blog
            </RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink to="/about" class="nav-link">
              <i class="fas fa-info-circle d-lg-none mr-1"></i>Nosotros
            </RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink to="/contact" class="nav-link">
              <i class="fas fa-envelope d-lg-none mr-1"></i>Contacto
            </RouterLink>
          </li>

          <!-- Divider para móvil -->
          <li class="nav-item d-lg-none">
            <hr class="my-2" style="border-color: rgba(255, 255, 255, 0.1)" />
          </li>

          <!-- Menú desplegable para Cliente autenticado (authStore) -->
          <li v-if="isClienteAutenticado" class="nav-item dropdown cliente-dropdown ml-lg-2">
            <a 
              class="nav-link cliente-toggle" 
              href="#" 
              @click.prevent="toggleClienteMenu"
              :class="{ 'active': clienteMenuOpen }"
            >
              <div class="cliente-avatar">
                <i class="fas fa-user"></i>
              </div>
              <span class="cliente-name d-none d-lg-inline">{{ authStore.userName }}</span>
              <i class="fas fa-chevron-down dropdown-arrow" :class="{ 'rotated': clienteMenuOpen }"></i>
            </a>
            <div class="cliente-dropdown-menu" :class="{ 'show': clienteMenuOpen }" @click.stop>
              <div class="dropdown-header">
                <i class="fas fa-user-circle mr-2"></i>
                {{ authStore.userName }}
                <small class="d-block text-muted">Cliente</small>
              </div>
              <div class="dropdown-divider"></div>
              <RouterLink to="/mis-pedidos" class="dropdown-item" @click="closeClienteMenu">
                <i class="fas fa-receipt mr-2"></i>
                Mis Pedidos
              </RouterLink>
              <div class="dropdown-divider"></div>
              <button type="button" class="dropdown-item logout-item" @click="cerrarSesionClienteAuth">
                <i class="fas fa-sign-out-alt mr-2"></i>
                Cerrar Sesión
              </button>
            </div>
          </li>

          <!-- Menú desplegable para Cliente autenticado (localStorage legacy) -->
          <li v-else-if="clienteAutenticado" class="nav-item dropdown cliente-dropdown ml-lg-2">
            <a 
              class="nav-link cliente-toggle" 
              href="#" 
              @click.prevent="toggleClienteMenu"
              :class="{ 'active': clienteMenuOpen }"
            >
              <div class="cliente-avatar">
                <i class="fas fa-user"></i>
              </div>
              <span class="cliente-name d-none d-lg-inline">{{ clienteNombre }}</span>
              <i class="fas fa-chevron-down dropdown-arrow" :class="{ 'rotated': clienteMenuOpen }"></i>
            </a>
            <div class="cliente-dropdown-menu" :class="{ 'show': clienteMenuOpen }" @click.stop>
              <div class="dropdown-header">
                <i class="fas fa-user-circle mr-2"></i>
                {{ clienteNombre }}
                <small class="d-block text-muted">Cliente</small>
              </div>
              <div class="dropdown-divider"></div>
              <RouterLink to="/mis-pedidos" class="dropdown-item" @click="closeClienteMenu">
                <i class="fas fa-receipt mr-2"></i>
                Mis Pedidos
              </RouterLink>
              <div class="dropdown-divider"></div>
              <button type="button" class="dropdown-item logout-item" @click="cerrarSesionCliente">
                <i class="fas fa-sign-out-alt mr-2"></i>
                Cerrar Sesión
              </button>
            </div>
          </li>

          <!-- Botón de seguimiento de pedido (solo aparece si hay pedido activo) -->
          <li class="nav-item tracking-nav-item">
            <TrackingButton />
          </li>

          <!-- Carrito de compras con diseño mejorado -->
          <li class="nav-item">
            <RouterLink to="/menu" class="nav-link cart-nav-link position-relative">
              <i class="fas fa-shopping-cart"></i>
              <span class="d-lg-none ml-2">Carrito</span>
              <span v-if="cartItemCount > 0" class="cart-badge-header">{{ cartItemCount }}</span>
            </RouterLink>
          </li>

          <!-- Menú desplegable para Admin (cuando está logueado como admin/empleado) -->
          <li v-if="isAuthenticated && isAdmin" class="nav-item dropdown admin-dropdown ml-lg-2">
            <a 
              class="nav-link admin-toggle" 
              href="#" 
              @click.prevent="toggleAdminMenu"
              :class="{ 'active': adminMenuOpen }"
            >
              <div class="admin-avatar">
                <i class="fas fa-user-shield"></i>
              </div>
              <span class="admin-name d-none d-lg-inline">{{ userName }}</span>
              <i class="fas fa-chevron-down dropdown-arrow" :class="{ 'rotated': adminMenuOpen }"></i>
            </a>
            <div class="admin-dropdown-menu" :class="{ 'show': adminMenuOpen }" @click.stop>
              <div class="dropdown-header">
                <i class="fas fa-user-circle mr-2"></i>
                {{ userName }}
                <small class="d-block text-muted">Administrador</small>
              </div>
              <div class="dropdown-divider"></div>
              <RouterLink to="/dashboard" class="dropdown-item" @click="closeAndNavigate">
                <i class="fas fa-tachometer-alt mr-2"></i>
                Panel de Administración
              </RouterLink>
              <div class="dropdown-divider"></div>
              <button type="button" class="dropdown-item logout-item" @click="handleLogout">
                <i class="fas fa-sign-out-alt mr-2"></i>
                Cerrar Sesión
              </button>
            </div>
          </li>

          <!-- Botón de Iniciar Sesión / Registrarse (solo cuando NO está logueado como nada) -->
          <li v-if="!isAuthenticated && !clienteAutenticado" class="nav-item ml-lg-2">
            <RouterLink to="/login" class="nav-link login-link">
              <i class="fas fa-sign-in-alt mr-1"></i>
              Iniciar Sesión
            </RouterLink>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { RouterLink, useRouter } from 'vue-router'
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '@/stores'
import { useCartStore } from '@/stores/cart'
import { useClienteStore } from '@/stores/cliente'
import TrackingButton from '@/components/tracking/TrackingButton.vue'

const authStore = useAuthStore()
const cartStore = useCartStore()
const clienteStore = useClienteStore()
const router = useRouter()

const isAuthenticated = computed(() => authStore.isAuthenticated)
const isAdmin = computed(() => authStore.isAdmin)
const isClienteAutenticado = computed(() => authStore.isAuthenticated && authStore.isCliente)
const userName = computed(() => authStore.userName)
const cartItemCount = computed(() => cartStore.itemCount)

// Cliente autenticado (del checkout - localStorage legacy)
const clienteAutenticado = computed(() => clienteStore.isAuthenticated)
const clienteNombre = computed(() => clienteStore.clienteNombre)

// Estado del menú desplegable del admin
const adminMenuOpen = ref(false)

// Estado del menú desplegable del cliente
const clienteMenuOpen = ref(false)

const toggleAdminMenu = (event: Event) => {
  event.stopPropagation()
  adminMenuOpen.value = !adminMenuOpen.value
  clienteMenuOpen.value = false // Cerrar el otro menú
}

const toggleClienteMenu = (event: Event) => {
  event.stopPropagation()
  clienteMenuOpen.value = !clienteMenuOpen.value
  adminMenuOpen.value = false // Cerrar el otro menú
}

const closeClienteMenu = () => {
  clienteMenuOpen.value = false
}

const closeAndNavigate = () => {
  adminMenuOpen.value = false
  router.push('/dashboard')
}

// Cerrar menú al hacer clic fuera
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (!target.closest('.admin-dropdown')) {
    adminMenuOpen.value = false
  }
  if (!target.closest('.cliente-dropdown')) {
    clienteMenuOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

const handleLogout = () => {
  adminMenuOpen.value = false
  if (confirm('¿Estás seguro que deseas cerrar sesión?')) {
    authStore.logout()
    router.push('/login')
  }
}

const cerrarSesionCliente = () => {
  if (confirm('¿Cerrar sesión? Ya no podrás ver el seguimiento de tus pedidos.')) {
    clienteMenuOpen.value = false
    clienteStore.clearCliente()
  }
}

const cerrarSesionClienteAuth = () => {
  if (confirm('¿Cerrar sesión? Ya no podrás ver el seguimiento de tus pedidos.')) {
    clienteMenuOpen.value = false
    authStore.logoutCliente()
  }
}
</script>

<style scoped>
/* Navbar sticky con sombra */
.sticky-navbar {
  position: sticky;
  top: 0;
  z-index: 1030;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
}

/* Logo mejorado */
.navbar-brand {
  font-size: 1rem;
  transition: transform 0.3s ease;
}

.navbar-brand:hover {
  transform: translateY(-3px);
}

.brand-icon {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #fca100 0%, #ff8c00 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 15px rgba(252, 161, 0, 0.4);
  transition: all 0.3s ease;
}

.navbar-brand:hover .brand-icon {
  box-shadow: 0 6px 20px rgba(252, 161, 0, 0.6);
  transform: rotate(-5deg);
}

.brand-icon .flaticon-pizza-1 {
  font-size: 26px;
  color: white;
}

.brand-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #fca100;
  letter-spacing: 0.5px;
  line-height: 1.2;
}

.brand-subtitle {
  font-size: 0.7rem;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.8);
  letter-spacing: 1px;
  text-transform: uppercase;
  margin-top: -2px;
}

/* Enlaces del navbar */
.navbar-nav .nav-link {
  font-weight: 500;
  font-size: 0.95rem;
  padding: 10px 15px !important;
  position: relative;
  transition: all 0.3s ease;
}

.navbar-nav .nav-link::after {
  content: '';
  position: absolute;
  bottom: 5px;
  left: 50%;
  width: 0;
  height: 2px;
  background: #fca100;
  transition: all 0.3s ease;
  transform: translateX(-50%);
}

.navbar-nav .nav-link:hover::after,
.navbar-nav .nav-link.router-link-active::after {
  width: 60%;
}

.navbar-nav .nav-link:hover {
  color: #fca100 !important;
}

/* Estilos para el botón de login */
.login-link {
  background: rgba(255, 255, 255, 0.1) !important;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 25px;
  padding: 8px 20px !important;
  font-weight: 600;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.login-link::after {
  display: none;
}

.login-link:hover {
  background: rgba(255, 255, 255, 0.25) !important;
  border-color: rgba(255, 255, 255, 0.6);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 255, 255, 0.2);
}

/* Carrito en el header */
.cart-nav-link {
  position: relative;
  font-size: 1.3rem !important;
  padding: 8px 15px !important;
  transition: all 0.3s ease;
}

.cart-nav-link:hover {
  transform: scale(1.1);
  color: #fca100 !important;
}

.cart-nav-link::after {
  display: none;
}

.cart-badge-header {
  position: absolute;
  top: 2px;
  right: 5px;
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%);
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 700;
  border: 2px solid #1a1a1a;
  box-shadow: 0 2px 8px rgba(255, 107, 107, 0.6);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
    box-shadow: 0 2px 8px rgba(255, 107, 107, 0.6);
  }
  50% {
    transform: scale(1.15);
    box-shadow: 0 3px 12px rgba(255, 107, 107, 0.9);
  }
}

/* Tracking button nav item */
.tracking-nav-item {
  display: flex;
  align-items: center;
  margin-right: 10px;
}

/* ===== MENÚ DESPLEGABLE DEL ADMIN ===== */
.admin-dropdown {
  position: relative;
  z-index: 1060;
}

.admin-toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, rgba(252, 161, 0, 0.15), rgba(255, 140, 0, 0.15)) !important;
  border: 1px solid rgba(252, 161, 0, 0.3);
  border-radius: 25px;
  padding: 6px 14px !important;
  cursor: pointer;
  transition: all 0.3s ease;
}

.admin-toggle::after {
  display: none !important;
}

.admin-toggle:hover,
.admin-toggle.active {
  background: linear-gradient(135deg, rgba(252, 161, 0, 0.25), rgba(255, 140, 0, 0.25)) !important;
  border-color: rgba(252, 161, 0, 0.5);
}

.admin-avatar {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #fca100, #ff8c00);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 14px;
}

.admin-name {
  color: #fca100;
  font-weight: 600;
  font-size: 13px;
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dropdown-arrow {
  color: #fca100;
  font-size: 10px;
  transition: transform 0.3s ease;
}

.dropdown-arrow.rotated {
  transform: rotate(180deg);
}

/* Menú desplegable */
.admin-dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 10px;
  background: #1a1a1a;
  border: 1px solid rgba(252, 161, 0, 0.3);
  border-radius: 12px;
  min-width: 220px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
  opacity: 0;
  visibility: hidden;
  transform: translateY(-10px);
  transition: all 0.3s ease;
  z-index: 1050;
  overflow: hidden;
}

.admin-dropdown-menu.show {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
  z-index: 1070;
}

.admin-dropdown-menu .dropdown-header {
  padding: 15px 18px;
  color: #ffffff;
  font-weight: 600;
  font-size: 14px;
  background: rgba(252, 161, 0, 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.admin-dropdown-menu .dropdown-header small {
  font-size: 11px;
  color: #fca100;
  font-weight: 500;
}

.admin-dropdown-menu .dropdown-divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
  margin: 0;
}

.admin-dropdown-menu .dropdown-item {
  display: flex;
  align-items: center;
  padding: 12px 18px;
  color: #cccccc;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
  text-decoration: none;
}

.admin-dropdown-menu .dropdown-item:hover {
  background: rgba(252, 161, 0, 0.15);
  color: #fca100;
  padding-left: 22px;
}

.admin-dropdown-menu .dropdown-item i {
  width: 20px;
  text-align: center;
}

.admin-dropdown-menu .logout-item {
  color: #ff6b6b;
  background: none;
  border: none;
  width: 100%;
  text-align: left;
  cursor: pointer;
}

.admin-dropdown-menu .logout-item:hover {
  background: rgba(220, 53, 69, 0.15);
  color: #dc3545;
}

/* ===== MENÚ DESPLEGABLE DEL CLIENTE ===== */
.cliente-dropdown {
  position: relative;
  z-index: 1060;
}

.cliente-toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, rgba(40, 167, 69, 0.15), rgba(32, 201, 151, 0.15)) !important;
  border: 1px solid rgba(40, 167, 69, 0.3);
  border-radius: 25px;
  padding: 6px 14px !important;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cliente-toggle::after {
  display: none !important;
}

.cliente-toggle:hover,
.cliente-toggle.active {
  background: linear-gradient(135deg, rgba(40, 167, 69, 0.25), rgba(32, 201, 151, 0.25)) !important;
  border-color: rgba(40, 167, 69, 0.5);
}

.cliente-avatar {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #28a745, #20c997);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 14px;
}

.cliente-name {
  color: #28a745;
  font-weight: 600;
  font-size: 13px;
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.cliente-toggle .dropdown-arrow {
  color: #28a745;
}

/* Menú desplegable del cliente */
.cliente-dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 10px;
  background: #1a1a1a;
  border: 1px solid rgba(40, 167, 69, 0.3);
  border-radius: 12px;
  min-width: 220px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
  opacity: 0;
  visibility: hidden;
  transform: translateY(-10px);
  transition: all 0.3s ease;
  z-index: 1050;
  overflow: hidden;
}

.cliente-dropdown-menu.show {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
  z-index: 1070;
}

.cliente-dropdown-menu .dropdown-header {
  padding: 15px 18px;
  color: #ffffff;
  font-weight: 600;
  font-size: 14px;
  background: rgba(40, 167, 69, 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.cliente-dropdown-menu .dropdown-header small {
  font-size: 11px;
  color: #28a745;
  font-weight: 500;
}

.cliente-dropdown-menu .dropdown-divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
  margin: 0;
}

.cliente-dropdown-menu .dropdown-item {
  display: flex;
  align-items: center;
  padding: 12px 18px;
  color: #cccccc;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
  text-decoration: none;
}

.cliente-dropdown-menu .dropdown-item:hover {
  background: rgba(40, 167, 69, 0.15);
  color: #28a745;
  padding-left: 22px;
}

.cliente-dropdown-menu .dropdown-item i {
  width: 20px;
  text-align: center;
}

.cliente-dropdown-menu .logout-item {
  color: #ff6b6b;
  background: none;
  border: none;
  width: 100%;
  text-align: left;
  cursor: pointer;
}

.cliente-dropdown-menu .logout-item:hover {
  background: rgba(220, 53, 69, 0.15);
  color: #dc3545;
}

/* Navbar toggler mejorado */
.navbar-toggler {
  border: 2px solid rgba(252, 161, 0, 0.5);
  padding: 8px 12px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.navbar-toggler:hover,
.navbar-toggler:focus {
  border-color: #fca100;
  background: rgba(252, 161, 0, 0.1);
  box-shadow: 0 0 15px rgba(252, 161, 0, 0.3);
}

/* Responsive */
@media (max-width: 991px) {
  .brand-text {
    margin-left: 8px !important;
  }

  .brand-title {
    font-size: 1.3rem;
  }

  .brand-subtitle {
    font-size: 0.65rem;
  }

  .brand-icon {
    width: 45px;
    height: 45px;
  }

  .brand-icon .flaticon-pizza-1 {
    font-size: 22px;
  }

  .navbar-nav {
    padding: 15px 0;
  }

  .navbar-nav .nav-link {
    padding: 12px 15px !important;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  }

  .navbar-nav .nav-link::after {
    display: none;
  }

  .login-link {
    margin-left: 0 !important;
    margin-top: 10px;
    display: inline-block;
    border-radius: 8px;
    width: 100%;
    text-align: center;
  }

  /* Admin dropdown en móvil */
  .admin-dropdown {
    width: 100%;
  }

  .admin-toggle {
    width: 100%;
    justify-content: center;
    padding: 12px 15px !important;
    border-radius: 8px;
    margin-top: 10px;
  }

  .admin-dropdown-menu {
    position: static;
    width: 100%;
    margin-top: 5px;
    border-radius: 8px;
  }

  /* Cliente dropdown en móvil */
  .cliente-dropdown {
    width: 100%;
  }

  .cliente-toggle {
    width: 100%;
    justify-content: center;
    padding: 12px 15px !important;
    border-radius: 8px;
    margin-top: 10px;
  }

  .cliente-dropdown-menu {
    position: static;
    width: 100%;
    margin-top: 5px;
    border-radius: 8px;
  }

  .cart-nav-link {
    font-size: 1.1rem !important;
    padding: 12px 15px !important;
  }

  .cart-badge-header {
    top: 8px;
    right: 10px;
  }
}

@media (max-width: 576px) {
  .brand-title {
    font-size: 1.1rem;
  }

  .brand-subtitle {
    font-size: 0.6rem;
  }

  .brand-icon {
    width: 40px;
    height: 40px;
  }

  .brand-icon .flaticon-pizza-1 {
    font-size: 20px;
  }
}
</style>
