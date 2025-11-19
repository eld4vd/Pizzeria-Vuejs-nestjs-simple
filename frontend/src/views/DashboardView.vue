<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()
const sidebarOpen = ref(true)

function handleLogout() {
  if (confirm('¿Está seguro de cerrar sesión?')) {
    authStore.logout()
  }
}

function toggleSidebar() {
  sidebarOpen.value = !sidebarOpen.value
}
</script>

<template>
  <div class="dashboard-container">
    <!-- Sidebar -->
    <aside class="sidebar" :class="{ 'sidebar-closed': !sidebarOpen }">
      <div class="sidebar-header">
        <div class="logo">
          <span class="flaticon-pizza-1"></span>
          <span v-if="sidebarOpen" class="logo-text">
            <strong>Pizza</strong><br>
            <small>Delicious</small>
          </span>
        </div>
      </div>

      <nav class="sidebar-nav">
        <ul>
          <li>
            <router-link to="/dashboard" class="nav-item" active-class="active" exact>
              <i class="fas fa-home"></i>
              <span v-if="sidebarOpen">Dashboard</span>
            </router-link>
          </li>
          <li>
            <router-link to="/dashboard/ventas" class="nav-item" active-class="active">
              <i class="fas fa-shopping-cart"></i>
              <span v-if="sidebarOpen">Ventas</span>
            </router-link>
          </li>
          <li>
            <router-link to="/dashboard/productos" class="nav-item" active-class="active">
              <i class="fas fa-pizza-slice"></i>
              <span v-if="sidebarOpen">Productos</span>
            </router-link>
          </li>
          <li>
            <router-link to="/dashboard/ingredientes" class="nav-item" active-class="active">
              <i class="fas fa-leaf"></i>
              <span v-if="sidebarOpen">Ingredientes</span>
            </router-link>
          </li>
          <li>
            <router-link to="/dashboard/proveedores" class="nav-item" active-class="active">
              <i class="fas fa-truck"></i>
              <span v-if="sidebarOpen">Proveedores</span>
            </router-link>
          </li>
          <li>
            <router-link to="/dashboard/compras" class="nav-item" active-class="active">
              <i class="fas fa-shopping-bag"></i>
              <span v-if="sidebarOpen">Compras</span>
            </router-link>
          </li>
          <li class="nav-divider" v-if="sidebarOpen"></li>
          <li>
            <router-link to="/" class="nav-item">
              <i class="fas fa-globe"></i>
              <span v-if="sidebarOpen">Ver Sitio Web</span>
            </router-link>
          </li>
        </ul>
      </nav>

      <div class="sidebar-footer">
        <button @click="handleLogout" class="logout-btn">
          <i class="fas fa-sign-out-alt"></i>
          <span v-if="sidebarOpen">Cerrar Sesión</span>
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="main-content">
      <!-- Top Bar -->
      <header class="topbar">
        <button @click="toggleSidebar" class="toggle-sidebar-btn">
          <i class="fas fa-bars"></i>
        </button>
        
        <div class="topbar-right">
          <div class="user-info">
            <span class="user-name">{{ authStore.userName }}</span>
            <div class="user-avatar">
              <i class="fas fa-user"></i>
            </div>
          </div>
        </div>
      </header>

      <!-- Content Area -->
      <main class="content">
        <div class="container-fluid">
          <div class="welcome-section">
            <h1 class="page-title">Panel de Administración</h1>
            <p class="page-subtitle">Accede rápidamente a las secciones del sistema</p>
          </div>

          <!-- Accesos Directos -->
          <div class="shortcuts-grid">
            <!-- Ventas -->
            <router-link to="/dashboard/ventas" class="shortcut-card shortcut-ventas">
              <div class="shortcut-icon">
                <i class="fas fa-shopping-cart"></i>
              </div>
              <div class="shortcut-content">
                <h3>Ventas</h3>
                <p>Gestionar ventas y pedidos</p>
              </div>
              <div class="shortcut-arrow">
                <i class="fas fa-arrow-right"></i>
              </div>
            </router-link>

            <!-- Productos -->
            <router-link to="/dashboard/productos" class="shortcut-card shortcut-productos">
              <div class="shortcut-icon">
                <i class="fas fa-pizza-slice"></i>
              </div>
              <div class="shortcut-content">
                <h3>Productos</h3>
                <p>Administrar catálogo de productos</p>
              </div>
              <div class="shortcut-arrow">
                <i class="fas fa-arrow-right"></i>
              </div>
            </router-link>

            <!-- Ingredientes -->
            <router-link to="/dashboard/ingredientes" class="shortcut-card shortcut-ingredientes">
              <div class="shortcut-icon">
                <i class="fas fa-leaf"></i>
              </div>
              <div class="shortcut-content">
                <h3>Ingredientes</h3>
                <p>Administrar ingredientes</p>
              </div>
              <div class="shortcut-arrow">
                <i class="fas fa-arrow-right"></i>
              </div>
            </router-link>

            <!-- Proveedores -->
            <router-link to="/dashboard/proveedores" class="shortcut-card shortcut-proveedores">
              <div class="shortcut-icon">
                <i class="fas fa-truck"></i>
              </div>
              <div class="shortcut-content">
                <h3>Proveedores</h3>
                <p>Gestionar proveedores</p>
              </div>
              <div class="shortcut-arrow">
                <i class="fas fa-arrow-right"></i>
              </div>
            </router-link>

            <!-- Compras -->
            <router-link to="/dashboard/compras" class="shortcut-card shortcut-compras">
              <div class="shortcut-icon">
                <i class="fas fa-shopping-bag"></i>
              </div>
              <div class="shortcut-content">
                <h3>Compras</h3>
                <p>Registrar compras de ingredientes</p>
              </div>
              <div class="shortcut-arrow">
                <i class="fas fa-arrow-right"></i>
              </div>
            </router-link>

            <!-- Ver Sitio Web -->
            <router-link to="/" class="shortcut-card shortcut-web">
              <div class="shortcut-icon">
                <i class="fas fa-globe"></i>
              </div>
              <div class="shortcut-content">
                <h3>Sitio Web</h3>
                <p>Ver el sitio público</p>
              </div>
              <div class="shortcut-arrow">
                <i class="fas fa-arrow-right"></i>
              </div>
            </router-link>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
.dashboard-container {
  display: flex;
  min-height: 100vh;
  background: #f5f5f5;
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

.sidebar-header {
  padding: 25px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.logo {
  display: flex;
  align-items: center;
  gap: 15px;
  color: #fca100;
}

.logo .flaticon-pizza-1 {
  font-size: 35px;
}

.logo-text strong {
  font-size: 20px;
  color: #ffffff;
}

.logo-text small {
  font-size: 12px;
  color: #fca100;
}

.sidebar-nav {
  flex: 1;
  padding: 20px 0;
  overflow-y: auto;
}

.sidebar-nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sidebar-nav li {
  margin-bottom: 5px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px 20px;
  color: #cccccc;
  text-decoration: none;
  transition: all 0.3s ease;
  font-size: 15px;
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

.nav-item i {
  font-size: 20px;
  min-width: 20px;
}

.nav-divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
  margin: 15px 20px;
}

.sidebar-footer {
  padding: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.logout-btn {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 12px 15px;
  background: rgba(220, 53, 69, 0.1);
  color: #ff4d4d;
  border: 1px solid rgba(220, 53, 69, 0.3);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 15px;
}

.logout-btn:hover {
  background: rgba(220, 53, 69, 0.2);
}

.logout-btn i {
  font-size: 18px;
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

.topbar {
  background: #ffffff;
  padding: 15px 30px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.toggle-sidebar-btn {
  background: none;
  border: none;
  font-size: 24px;
  color: #333;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 8px;
  transition: background 0.3s ease;
}

.toggle-sidebar-btn:hover {
  background: #f0f0f0;
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
}

.user-name {
  font-weight: 600;
  color: #333;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #fca100, #e85a19);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
}

.content {
  padding: 40px 30px;
  max-width: 1400px;
  margin: 0 auto;
}

.welcome-section {
  text-align: center;
  margin-bottom: 50px;
}

.page-title {
  font-size: 36px;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 10px;
}

.page-subtitle {
  color: #6c757d;
  font-size: 18px;
  margin: 0;
}

/* Shortcuts Grid */
.shortcuts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 25px;
  padding: 0;
}

.shortcut-card {
  background: #ffffff;
  padding: 30px;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  gap: 20px;
  text-decoration: none;
  color: inherit;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  position: relative;
  overflow: hidden;
}

.shortcut-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: currentColor;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.shortcut-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  border-color: currentColor;
}

.shortcut-card:hover::before {
  opacity: 1;
}

.shortcut-icon {
  width: 70px;
  height: 70px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  color: #ffffff;
  flex-shrink: 0;
  transition: transform 0.3s ease;
}

.shortcut-card:hover .shortcut-icon {
  transform: scale(1.1) rotate(5deg);
}

.shortcut-content {
  flex: 1;
}

.shortcut-content h3 {
  font-size: 22px;
  font-weight: 700;
  color: #2c3e50;
  margin: 0 0 8px 0;
}

.shortcut-content p {
  margin: 0;
  color: #6c757d;
  font-size: 14px;
  line-height: 1.4;
}

.shortcut-arrow {
  font-size: 24px;
  color: #cbd5e0;
  transition: all 0.3s ease;
}

.shortcut-card:hover .shortcut-arrow {
  color: currentColor;
  transform: translateX(5px);
}

/* Colores específicos para cada shortcut */
.shortcut-ventas {
  color: #007bff;
}

.shortcut-ventas .shortcut-icon {
  background: linear-gradient(135deg, #007bff, #0056b3);
}

.shortcut-productos {
  color: #fca100;
}

.shortcut-productos .shortcut-icon {
  background: linear-gradient(135deg, #fca100, #e85a19);
}

.shortcut-ingredientes {
  color: #20c997;
}

.shortcut-ingredientes .shortcut-icon {
  background: linear-gradient(135deg, #20c997, #17a673);
}

.shortcut-proveedores {
  color: #17a2b8;
}

.shortcut-proveedores .shortcut-icon {
  background: linear-gradient(135deg, #17a2b8, #117a8b);
}

.shortcut-compras {
  color: #28a745;
}

.shortcut-compras .shortcut-icon {
  background: linear-gradient(135deg, #28a745, #1e7e34);
}

.shortcut-web {
  color: #6f42c1;
}

.shortcut-web .shortcut-icon {
  background: linear-gradient(135deg, #6f42c1, #5a32a3);
}

@media (max-width: 992px) {
  .shortcuts-grid {
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
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

  .content {
    padding: 30px 20px;
  }

  .welcome-section {
    margin-bottom: 35px;
  }

  .page-title {
    font-size: 28px;
  }

  .page-subtitle {
    font-size: 16px;
  }

  .shortcuts-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .shortcut-card {
    padding: 25px;
  }

  .shortcut-icon {
    width: 60px;
    height: 60px;
    font-size: 28px;
  }

  .shortcut-content h3 {
    font-size: 20px;
  }
}
</style>
