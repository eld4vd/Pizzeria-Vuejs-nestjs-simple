export interface Ingrediente {
  id: number
  nombre: string
  descripcion: string | null
  unidadMedida: string | null
  stock: number
  imagenUrl: string | null
  disponible: boolean
  esAlergeno: boolean
}
