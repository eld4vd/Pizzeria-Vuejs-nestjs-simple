export type EstadoCompra = 'pendiente' | 'recibida' | 'cancelada'

export interface DetalleCompra {
  id?: number
  idCompra?: number
  idIngrediente: number
  nombreIngrediente: string
  precioUnitario: number
  cantidad: number
  unidadMedida?: string
  subtotal: number
  notas?: string
}

export interface Compra {
  id: number
  numeroCompra: string
  idProveedor: number
  estado: EstadoCompra
  total: number
  notas?: string
  fechaCompra: Date
  proveedor?: {
    id: number
    nombre: string
    empresa?: string
  }
  detalles?: DetalleCompra[]
}
