import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { useAuthStore } from '@/stores'
import { getTokenFromLocalStorage } from '@/helpers'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    // Si hay una posición guardada (navegación con botones atrás/adelante), úsala
    if (savedPosition) {
      return savedPosition
    }
    // Si hay un hash en la URL, desplázate a ese elemento
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth',
      }
    }
    // Por defecto, desplázate al inicio de la página
    return { top: 0, behavior: 'smooth' }
  },
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/menu',
      name: 'menu',
      component: () => import('../views/MenuView.vue'),
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/services',
      name: 'services',
      component: () => import('../views/ServicesView.vue'),
    },
    {
      path: '/blog',
      name: 'blog',
      component: () => import('../views/BlogView.vue'),
    },
    {
      path: '/single-blog',
      name: 'single-blog',
      component: () => import('../views/SingleBlogView.vue'),
    },
    {
      path: '/elements',
      name: 'elements',
      component: () => import('../views/ElementsView.vue'),
    },
    {
      path: '/contact',
      name: 'contact',
      component: () => import('../views/ContactView.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/dashboard',
      component: () => import('../layouts/DashboardLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'dashboard',
          component: () => import('../views/dashboard/DashboardHome.vue'),
        },
        {
          path: 'ingredientes',
          name: 'dashboard-ingredientes',
          component: () => import('../views/dashboard/IngredientesView.vue'),
        },
        {
          path: 'productos',
          name: 'dashboard-productos',
          component: () => import('../views/dashboard/ProductosView.vue'),
        },
        {
          path: 'proveedores',
          name: 'dashboard-proveedores',
          component: () => import('../views/dashboard/ProveedorView.vue'),
        },
        {
          path: 'compras',
          name: 'dashboard-compras',
          component: () => import('../views/dashboard/CompraView.vue'),
        },
        {
          path: 'ventas',
          name: 'dashboard-ventas',
          component: () => import('../views/dashboard/VentasView.vue'),
        },
      ],
    },
  ],
})

// Guard de autenticación
router.beforeEach(async (to) => {
  const publicPages = ['/login', '/', '/menu', '/about', '/services', '/blog', '/contact', '/single-blog', '/elements']
  const authRequired = !publicPages.includes(to.path)
  const authStore = useAuthStore()

  if (authRequired && !getTokenFromLocalStorage()) {
    if (authStore) authStore.logout()
    authStore.returnUrl = to.fullPath
    return '/login'
  }
})

export default router
