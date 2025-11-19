<template>
  <nav class="navbar navbar-expand-lg navbar-dark ftco_navbar bg-dark ftco-navbar-light sticky-navbar" id="ftco-navbar">
    <div class="container">
      <!-- Logo mejorado -->
      <RouterLink to="/" class="navbar-brand d-flex align-items-center">
        <div class="brand-icon">
          <span class="flaticon-pizza-1"></span>
        </div>
        <div class="brand-text ml-2">
          <span class="brand-title">Hambur</span>
          <small class="brand-subtitle d-block">Gourmet Pizza</small>
        </div>
      </RouterLink>
      
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#ftco-nav" aria-controls="ftco-nav" aria-expanded="false" aria-label="Toggle navigation">
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
            <hr class="my-2" style="border-color: rgba(255,255,255,0.1)">
          </li>

          <!-- Carrito de compras con diseño mejorado -->
          <li class="nav-item">
            <RouterLink to="/menu" class="nav-link cart-nav-link position-relative">
              <i class="fas fa-shopping-cart"></i>
              <span class="d-lg-none ml-2">Carrito</span>
              <span v-if="cartItemCount > 0" class="cart-badge-header">{{ cartItemCount }}</span>
            </RouterLink>
          </li>
          
          <!-- Botón para Panel de Administración -->
          <li v-if="isAuthenticated" class="nav-item ml-lg-2">
            <RouterLink to="/dashboard" class="nav-link admin-link">
              <i class="fas fa-tachometer-alt mr-1"></i>
              Panel Admin
            </RouterLink>
          </li>
          
          <!-- Botón de Iniciar Sesión/Cerrar Sesión -->
          <li class="nav-item ml-lg-2">
            <RouterLink 
              v-if="!isAuthenticated" 
              to="/login" 
              class="nav-link login-link"
            >
              <i class="fas fa-sign-in-alt mr-1"></i>
              Iniciar Sesión
            </RouterLink>
            <a 
              v-else 
              href="#" 
              class="nav-link user-link"
              @click.prevent="handleLogout"
              :title="`${userName} - Click para cerrar sesión`"
            >
              <i class="fas fa-sign-out-alt mr-1"></i>
              Cerrar Sesión
            </a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { RouterLink, useRouter } from 'vue-router'
import { computed } from 'vue'
import { useAuthStore } from '@/stores'
import { useCartStore } from '@/stores/cart'

const authStore = useAuthStore()
const cartStore = useCartStore()
const router = useRouter()

const isAuthenticated = computed(() => authStore.isAuthenticated)
const userName = computed(() => authStore.userName)
const cartItemCount = computed(() => cartStore.itemCount)

const handleLogout = () => {
  if (confirm('¿Estás seguro que deseas cerrar sesión?')) {
    authStore.logout()
    router.push('/login')
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

/* Estilos para el botón de admin */
.admin-link {
  background: linear-gradient(135deg, rgba(252, 161, 0, 0.2) 0%, rgba(255, 140, 0, 0.2) 100%) !important;
  border: 1px solid rgba(252, 161, 0, 0.4);
  border-radius: 25px;
  padding: 8px 20px !important;
  font-weight: 600;
  transition: all 0.3s ease;
  color: #fca100 !important;
}

.admin-link::after {
  display: none;
}

.admin-link:hover {
  background: linear-gradient(135deg, rgba(252, 161, 0, 0.35) 0%, rgba(255, 140, 0, 0.35) 100%) !important;
  border-color: rgba(252, 161, 0, 0.7);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(252, 161, 0, 0.4);
  color: #fff !important;
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

/* Estilos para el usuario logueado */
.user-link {
  background: linear-gradient(135deg, rgba(40, 167, 69, 0.2) 0%, rgba(34, 139, 57, 0.2) 100%) !important;
  border: 1px solid rgba(40, 167, 69, 0.4);
  border-radius: 25px;
  padding: 8px 20px !important;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  color: #28a745 !important;
}

.user-link::after {
  display: none;
}

.user-link:hover {
  background: linear-gradient(135deg, rgba(220, 53, 69, 0.3) 0%, rgba(200, 35, 51, 0.3) 100%) !important;
  border-color: rgba(220, 53, 69, 0.6);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(220, 53, 69, 0.4);
  color: #dc3545 !important;
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
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 2px 8px rgba(255, 107, 107, 0.6);
  }
  50% {
    transform: scale(1.15);
    box-shadow: 0 3px 12px rgba(255, 107, 107, 0.9);
  }
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

  .admin-link,
  .login-link,
  .user-link {
    margin-left: 0 !important;
    margin-top: 10px;
    display: inline-block;
    border-radius: 8px;
    width: 100%;
    text-align: center;
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
