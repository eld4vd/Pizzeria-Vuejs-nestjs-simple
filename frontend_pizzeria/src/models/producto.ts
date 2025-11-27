export type CategoriaProducto = 'pizza' | 'bebida' | 'postre' | 'extra'

export interface Producto {
  id: number
  categoria: CategoriaProducto
  nombre: string
  descripcion: string
  precioBase?: number
  precio: number
  stock: number
  tamañosDisponibles?: string[]
  imagenUrl: string | null
  disponible: boolean
  destacado: boolean
  ingredientes?: ProductoIngrediente[]
}

export interface ProductoIngrediente {
  id: number
  cantidad: number
  notas: string | null
  ingrediente: {
    id: number
    nombre: string
    esAlergeno: boolean
  }
}
