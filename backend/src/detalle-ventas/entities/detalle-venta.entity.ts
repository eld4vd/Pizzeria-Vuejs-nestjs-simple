import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Venta } from 'src/ventas/entities/venta.entity';
import { Producto } from 'src/productos/entities/producto.entity';

@Entity('detalle_ventas')
export class DetalleVenta {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column('int', { name: 'venta_id', nullable: false })
  ventaId: number;

  @Column('int', { name: 'producto_id', nullable: false })
  productoId: number;

  @Column('varchar', { length: 150, nullable: false })
  nombreProducto: string;

  @Column('decimal', { precision: 10, scale: 2, nullable: false })
  precioUnitario: number;

  @Column('int', { nullable: false })
  cantidad: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: false })
  subtotal: number;

  @Column('text', { nullable: true })
  notas: string;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;

  @ManyToOne(() => Venta, (venta) => venta.detalles, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'venta_id', referencedColumnName: 'id' })
  venta: Venta;

  @ManyToOne(() => Producto, (producto) => producto.detalles, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'producto_id', referencedColumnName: 'id' })
  producto: Producto;
}
