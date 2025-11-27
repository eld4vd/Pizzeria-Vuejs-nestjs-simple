import { defineStore } from 'pinia'
import { getTokenFromLocalStorage } from '@/helpers'
import http from '@/plugins/axios'
import router from '@/router'

interface Usuario {
  id: number
  usuario: string
  nombre: string
  email?: string
  telefono?: string
  rol?: string
}

const useAuthStore = defineStore('auth', {
  state: () => ({
    user: localStorage.getItem('user') || '',
    usuario: localStorage.getItem('usuario') ? JSON.parse(localStorage.getItem('usuario')!) : null as Usuario | null,
    token: getTokenFromLocalStorage(),
    returnUrl: '',
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
    userName: (state) => state.usuario?.nombre || state.user || 'Usuario',
    isAdmin: (state) => state.usuario?.rol === 'admin' || state.usuario?.rol === 'empleado',
    isCliente: (state) => state.usuario?.rol === 'cliente',
    userRole: (state) => state.usuario?.rol || null,
    userId: (state) => state.usuario?.id || null,
  },
  actions: {
    async login(usuario: string, clave: string) {
      const response = await http.post('auth/login', { usuario, clave })
      
      this.user = response.data.empleado?.usuario || response.data.usuario
      this.usuario = {
        id: response.data.empleado?.id || 0,
        usuario: response.data.empleado?.usuario || response.data.usuario,
        nombre: response.data.empleado?.nombre || response.data.usuario,
        email: response.data.empleado?.email,
        telefono: response.data.empleado?.telefono,
        rol: response.data.empleado?.rol || 'empleado'
      }
      this.token = response.data.access_token

      localStorage.setItem('user', this.user || '')
      localStorage.setItem('usuario', JSON.stringify(this.usuario))
      localStorage.setItem('token', this.token || '')

      // Redirigir según el rol
      const rol = this.usuario?.rol
      if (rol === 'cliente') {
        router.push(this.returnUrl || '/menu')
      } else {
        router.push(this.returnUrl || '/dashboard')
      }
    },
    setUser(userData: Usuario) {
      this.usuario = userData
      this.user = userData.usuario
      localStorage.setItem('user', this.user)
      localStorage.setItem('usuario', JSON.stringify(this.usuario))
    },
    setToken(token: string) {
      this.token = token
      localStorage.setItem('token', token)
    },
    logout() {
      localStorage.clear()
      this.$reset()
      router.push('/login')
    },
    logoutCliente() {
      localStorage.clear()
      this.$reset()
      router.push('/menu')
    },
  },
})

export { useAuthStore }
export { useCartStore } from './cart'
export { useClienteStore } from './cliente'
