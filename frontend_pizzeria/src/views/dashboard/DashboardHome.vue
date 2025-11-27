<script setup lang="ts">
</script>

<template>
  <div class="dashboard-home">
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
</template>

<style scoped>
.dashboard-home {
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

.shortcut-ingredientes {
  color: #20c997;
}

.shortcut-ingredientes .shortcut-icon {
  background: linear-gradient(135deg, #20c997, #17a673);
}

.shortcut-web {
  color: #6f42c1;
}

.shortcut-web .shortcut-icon {
  background: linear-gradient(135deg, #6f42c1, #5a32a3);
}

/* Responsive */
@media (max-width: 992px) {
  .shortcuts-grid {
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  }
}

@media (max-width: 768px) {
  .dashboard-home {
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
