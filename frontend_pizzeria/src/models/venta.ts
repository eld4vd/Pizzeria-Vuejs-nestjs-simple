export interface Venta {
  id: number
  numeroVenta: string
  idEmpleado: number | null
  tipoVenta: 'online' | 'presencial'
  metodoPago: 'qr' | 'debito' | 'efectivo' | 'tarjeta'
  clienteNombre: string
  clienteTelefono: string
  clienteEmail: string | null
  clienteNotas: string | null
  subtotal: number
  descuento: number
  total: number
  estado: 'pendiente' | 'confirmada' | 'preparando' | 'lista' | 'entregada' | 'cancelada'
  notasInternas: string | null
  fechaVenta: string
  empleado?: {
    id: number
    nombre: string
  }
  detalles?: DetalleVenta[]
}

export interface DetalleVenta {
  id: number
  idVenta: number
  idProducto: number
  nombreProducto: string
  precioUnitario: number
  cantidad: number
  subtotal: number
  notas: string | null
}
