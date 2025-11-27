export interface Proveedor {
  id: number
  nombre: string
  empresa?: string
  telefono?: string
  email?: string
  direccion?: string
  ciudad?: string
  nit?: string
  notas?: string
  activo: boolean
  fechaCreacion?: Date
}
