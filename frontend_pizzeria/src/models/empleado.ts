export interface Empleado {
  id: number
  usuario: string
  nombre: string
  email: string
  telefono: string | null
  rol: string
  activo: boolean
}
