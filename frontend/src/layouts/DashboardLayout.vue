<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '@/stores'

const authStore = useAuthStore()
const sidebarOpen = ref(true)

function handleLogout() {
  if (confirm('¿Está seguro de cerrar sesión?')) {
    authStore.logout()
  }
}

function toggleSidebar() {
  sidebarOpen.value = !sidebarOpen.value
}

// Agregar clase al body cuando entramos al dashboard
onMounted(() => {
  document.body.classList.add('dashboard-mode')
})

// Remover clase al body cuando salimos del dashboard
onUnmounted(() => {
  document.body.classList.remove('dashboard-mode')
})
</script>

<template>
  <div class="dashboard-container">
    <!-- Sidebar -->
    <aside class="sidebar" :class="{ 'sidebar-closed': !sidebarOpen }">
      <div class="sidebar-header">
        <div class="logo">
          <span class="flaticon-pizza-1"></span>
          <span v-if="sidebarOpen" class="logo-text">
            <strong>Restaurante</strong><br>
            <small>Delicious</small>
          </span>
        </div>
      </div>

      <nav class="sidebar-nav">
        <ul>
          <!-- Principal -->
          <li>
            <router-link 
              to="/dashboard" 
              class="nav-item" 
              active-class="active" 
              exact
              :title="!sidebarOpen ? 'Inicio' : ''"
            >
              <i class="fas fa-home"></i>
              <span v-if="sidebarOpen">Inicio</span>
            </router-link>
          </li>

          <!-- Ventas -->
          <li>
            <router-link 
              to="/dashboard/ventas" 
              class="nav-item" 
              active-class="active"
              :title="!sidebarOpen ? 'Ventas' : ''"
            >
              <i class="fas fa-cash-register"></i>
              <span v-if="sidebarOpen">Ventas</span>
            </router-link>
          </li>

          <!-- Separador -->
          <li v-if="sidebarOpen" class="nav-section">
            <span>Catálogo</span>
          </li>
          <li v-else class="nav-divider"></li>

          <!-- Productos -->
          <li>
            <router-link 
              to="/dashboard/productos" 
              class="nav-item" 
              active-class="active"
              :title="!sidebarOpen ? 'Productos' : ''"
            >
              <i class="fas fa-pizza-slice"></i>
              <span v-if="sidebarOpen">Productos</span>
            </router-link>
          </li>

          <!-- Ingredientes -->
          <li>
            <router-link 
              to="/dashboard/ingredientes" 
              class="nav-item" 
              active-class="active"
              :title="!sidebarOpen ? 'Ingredientes' : ''"
            >
              <i class="fas fa-leaf"></i>
              <span v-if="sidebarOpen">Ingredientes</span>
            </router-link>
          </li>

          <!-- Proveedores -->
          <li>
            <router-link 
              to="/dashboard/proveedores" 
              class="nav-item" 
              active-class="active"
              :title="!sidebarOpen ? 'Proveedores' : ''"
            >
              <i class="fas fa-truck"></i>
              <span v-if="sidebarOpen">Proveedores</span>
            </router-link>
          </li>

          <!-- Compras -->
          <li>
            <router-link 
              to="/dashboard/compras" 
              class="nav-item" 
              active-class="active"
              :title="!sidebarOpen ? 'Compras' : ''"
            >
              <i class="fas fa-shopping-cart"></i>
              <span v-if="sidebarOpen">Compras</span>
            </router-link>
          </li>

          <!-- Separador -->
          <li class="nav-divider" v-if="sidebarOpen"></li>
          <li v-else class="nav-divider"></li>

          <!-- Ver sitio -->
          <li>
            <router-link 
              to="/" 
              class="nav-item"
              :title="!sidebarOpen ? 'Sitio Web' : ''"
            >
              <i class="fas fa-globe"></i>
              <span v-if="sidebarOpen">Sitio Web</span>
            </router-link>
          </li>
        </ul>
      </nav>

      <div class="sidebar-footer">
        <button 
          @click="handleLogout" 
          class="logout-btn"
          :title="!sidebarOpen ? 'Cerrar Sesión' : ''"
        >
          <i class="fas fa-sign-out-alt"></i>
          <span v-if="sidebarOpen">Cerrar Sesión</span>
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="main-content">
      <!-- Top Bar -->
      <header class="topbar">
        <div class="topbar-left">
          <button @click="toggleSidebar" class="toggle-sidebar-btn">
            <i class="fas fa-bars"></i>
          </button>
          <span class="topbar-title">Panel de Administración</span>
        </div>
        
        <div class="topbar-right">
          <div class="user-info">
            <div class="user-details">
              <span class="user-name">{{ authStore.user }}</span>
              <span class="user-role">Empleado</span>
            </div>
            <div class="user-avatar">
              <i class="fas fa-user"></i>
            </div>
          </div>
        </div>
      </header>

      <!-- Content Area - RouterView para vistas hijas -->
      <main class="content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<style>
/* Estilos globales para resetear el sitio público cuando estamos en dashboard */
body.dashboard-mode {
  overflow-x: hidden;
  background: #f8f9fa !important;
}

body.dashboard-mode #app {
  max-width: 100% !important;
  padding: 0 !important;
  margin: 0 !important;
}

/* Asegurar que FontAwesome se muestre correctamente */
body.dashboard-mode .fa,
body.dashboard-mode .fas,
body.dashboard-mode .far,
body.dashboard-mode .fal,
body.dashboard-mode .fab {
  font-family: "Font Awesome 6 Free" !important;
  font-weight: 900 !important;
  -webkit-font-smoothing: antialiased;
  display: inline-block;
  font-style: normal;
  font-variant: normal;
  text-rendering: auto;
  line-height: 1;
}
</style>

<style scoped>
.dashboard-container {
  display: flex;
  min-height: 100vh;
  background: #f8f9fa;
}

/* Sidebar */
.sidebar {
  width: 260px;
  background: #1a1a1a;
  color: #ffffff;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
  position: fixed;
  height: 100vh;
  z-index: 1000;
}

.sidebar-closed {
  width: 70px;
}

.sidebar-closed .logo-text {
  display: none;
}

.sidebar-closed .nav-section {
  display: none;
}

.sidebar-header {
  padding: 18px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #fca100;
}

.logo .flaticon-pizza-1 {
  font-size: 28px;
}

.logo-text strong {
  font-size: 18px;
  color: #ffffff;
  line-height: 1.2;
}

.logo-text small {
  font-size: 11px;
  color: #fca100;
  line-height: 1;
}

.sidebar-nav {
  flex: 1;
  padding: 10px 0;
  overflow-y: hidden; /* Sin scroll */
}

.sidebar-nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sidebar-nav li {
  margin-bottom: 2px;
}

.nav-section {
  padding: 12px 20px 8px;
  color: #888;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-top: 10px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  color: #cccccc;
  text-decoration: none;
  transition: all 0.3s ease;
  font-size: 14px;
  position: relative;
}

.sidebar-closed .nav-item {
  justify-content: center;
  padding: 12px 0;
}

.nav-item:hover {
  background: rgba(252, 161, 0, 0.1);
  color: #fca100;
}

.nav-item.active {
  background: rgba(252, 161, 0, 0.15);
  color: #fca100;
  border-left: 3px solid #fca100;
}

.sidebar-closed .nav-item.active {
  border-left: none;
  border-right: 3px solid #fca100;
}

.nav-item i {
  font-size: 18px;
  min-width: 18px;
  text-align: center;
  font-family: "Font Awesome 6 Free" !important;
  font-weight: 900 !important;
  line-height: 1;
}

.sidebar-closed .nav-item i {
  font-size: 20px;
}

/* Asegurar que los iconos no hereden estilos del flaticon */
.sidebar i.fas,
.sidebar i.far,
.sidebar i.fab {
  font-family: "Font Awesome 6 Free" !important;
  font-weight: 900 !important;
}

/* Tooltip para sidebar colapsado */
.sidebar-closed .nav-item[title]:hover::after {
  content: attr(title);
  position: absolute;
  left: 100%;
  top: 50%;
  transform: translateY(-50%);
  margin-left: 10px;
  padding: 8px 12px;
  background: #2a2a2a;
  color: #ffffff;
  border-radius: 6px;
  font-size: 13px;
  white-space: nowrap;
  z-index: 1000;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(252, 161, 0, 0.3);
}

.sidebar-closed .nav-item[title]:hover::before {
  content: '';
  position: absolute;
  left: 100%;
  top: 50%;
  transform: translateY(-50%);
  margin-left: 3px;
  border: 6px solid transparent;
  border-right-color: #2a2a2a;
  z-index: 1001;
}

.nav-divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
  margin: 10px 20px;
}

.sidebar-footer {
  padding: 15px 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.logout-btn {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 15px;
  background: rgba(220, 53, 69, 0.1);
  color: #ff4d4d;
  border: 1px solid rgba(220, 53, 69, 0.3);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
  position: relative;
}

.sidebar-closed .logout-btn {
  justify-content: center;
  padding: 10px;
}

.logout-btn:hover {
  background: rgba(220, 53, 69, 0.2);
  transform: translateY(-1px);
}

.logout-btn i {
  font-size: 18px;
  font-family: "Font Awesome 6 Free" !important;
  font-weight: 900 !important;
  line-height: 1;
}

.sidebar-closed .logout-btn i {
  font-size: 20px;
}

/* Tooltip para botón de logout */
.sidebar-closed .logout-btn[title]:hover::after {
  content: attr(title);
  position: absolute;
  left: 100%;
  top: 50%;
  transform: translateY(-50%);
  margin-left: 10px;
  padding: 8px 12px;
  background: #2a2a2a;
  color: #ffffff;
  border-radius: 6px;
  font-size: 13px;
  white-space: nowrap;
  z-index: 1000;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(220, 53, 69, 0.5);
}

.sidebar-closed .logout-btn[title]:hover::before {
  content: '';
  position: absolute;
  left: 100%;
  top: 50%;
  transform: translateY(-50%);
  margin-left: 3px;
  border: 6px solid transparent;
  border-right-color: #2a2a2a;
  z-index: 1001;
}

/* Main Content */
.main-content {
  flex: 1;
  margin-left: 260px;
  transition: all 0.3s ease;
}

.sidebar-closed ~ .main-content {
  margin-left: 70px;
}

.sidebar-closed .flaticon-pizza-1 {
  font-size: 32px;
}

.topbar {
  background: #1a1a1a;
  padding: 15px 30px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  position: sticky;
  top: 0;
  z-index: 100;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.topbar-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.toggle-sidebar-btn {
  background: rgba(252, 161, 0, 0.1);
  border: 1px solid rgba(252, 161, 0, 0.3);
  color: #fca100;
  cursor: pointer;
  padding: 0;
  border-radius: 8px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
}

.toggle-sidebar-btn i {
  font-size: 20px;
  font-weight: 900;
}

.toggle-sidebar-btn:hover {
  background: rgba(252, 161, 0, 0.2);
  transform: scale(1.05);
}

.toggle-sidebar-btn:active {
  transform: scale(0.95);
}

.topbar-title {
  font-size: 16px;
  font-weight: 600;
  color: #ffffff;
  display: none;
}

.topbar-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 50px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.user-details {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.user-name {
  font-weight: 600;
  color: #ffffff;
  font-size: 14px;
  line-height: 1.2;
}

.user-role {
  font-size: 11px;
  color: #fca100;
  font-weight: 500;
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #fca100, #e85a19);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-size: 14px;
}

.user-avatar i {
  font-family: "Font Awesome 6 Free" !important;
  font-weight: 900 !important;
  line-height: 1;
}

.content {
  padding: 30px;
  min-height: calc(100vh - 70px);
  background: #f8f9fa;
}

/* Responsive */
@media (max-width: 1200px) {
  .topbar-title {
    display: block;
  }
}

@media (max-width: 768px) {
  .sidebar {
    transform: translateX(-100%);
  }

  .sidebar-closed {
    transform: translateX(-100%);
  }

  .main-content {
    margin-left: 0;
  }

  .topbar {
    padding: 12px 20px;
  }

  .user-details {
    display: none;
  }
  
  .topbar-title {
    font-size: 14px;
  }
}
</style>
