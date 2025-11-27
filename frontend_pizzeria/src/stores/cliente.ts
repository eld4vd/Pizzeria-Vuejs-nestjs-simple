import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from '@/plugins/axios'

export interface Cliente {
  id: number
  nombre: string
  telefono: string
  email?: string
  direccion?: string
  ciudad?: string
}

export const useClienteStore = defineStore('cliente', () => {
  const cliente = ref<Cliente | null>(null)
  const token = ref<string | null>(localStorage.getItem('cliente_token'))

  const isAuthenticated = computed(() => !!token.value && !!cliente.value)
  const clienteNombre = computed(() => cliente.value?.nombre || '')

  // Inicializar desde localStorage
  const initFromStorage = () => {
    const storedCliente = localStorage.getItem('cliente_data')
    const storedToken = localStorage.getItem('cliente_token')
    
    if (storedCliente && storedToken) {
      try {
        cliente.value = JSON.parse(storedCliente)
        token.value = storedToken
      } catch {
        clearCliente()
      }
    }
  }

  // Registrar nuevo cliente
  const registrar = async (data: {
    nombre: string
    telefono: string
    email?: string
    direccion?: string
    ciudad?: string
  }): Promise<Cliente> => {
    try {
      const response = await axios.post('/clientes/registrar', data)
      cliente.value = response.data.cliente
      token.value = response.data.token || `cliente_${Date.now()}`
      
      localStorage.setItem('cliente_data', JSON.stringify(cliente.value))
      localStorage.setItem('cliente_token', token.value || '')
      
      return response.data.cliente
    } catch (error: any) {
      // Si el endpoint no existe, simular registro local
      const nuevoCliente: Cliente = {
        id: Date.now(),
        nombre: data.nombre,
        telefono: data.telefono,
        email: data.email,
        direccion: data.direccion,
        ciudad: data.ciudad
      }
      
      cliente.value = nuevoCliente
      token.value = `cliente_local_${Date.now()}`
      
      localStorage.setItem('cliente_data', JSON.stringify(cliente.value))
      localStorage.setItem('cliente_token', token.value || '')
      
      return nuevoCliente
    }
  }

  // Login por teléfono
  const loginPorTelefono = async (telefono: string): Promise<Cliente | null> => {
    try {
      const response = await axios.post('/clientes/login', { telefono })
      cliente.value = response.data.cliente
      token.value = response.data.token || `cliente_${Date.now()}`
      
      localStorage.setItem('cliente_data', JSON.stringify(cliente.value))
      localStorage.setItem('cliente_token', token.value || '')
      
      return response.data.cliente
    } catch {
      // Si no existe, retornar null para que se registre
      return null
    }
  }

  // Limpiar datos del cliente
  const clearCliente = () => {
    cliente.value = null
    token.value = null
    localStorage.removeItem('cliente_data')
    localStorage.removeItem('cliente_token')
  }

  // Actualizar datos del cliente
  const actualizarDatos = (data: Partial<Cliente>) => {
    if (cliente.value) {
      cliente.value = { ...cliente.value, ...data }
      localStorage.setItem('cliente_data', JSON.stringify(cliente.value))
    }
  }

  // Inicializar al crear el store
  initFromStorage()

  return {
    cliente,
    token,
    isAuthenticated,
    clienteNombre,
    registrar,
    loginPorTelefono,
    clearCliente,
    actualizarDatos,
    initFromStorage
  }
})
