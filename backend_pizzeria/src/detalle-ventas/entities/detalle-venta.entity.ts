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

  @Column('integer', { name: 'id_venta', nullable: false })
  idVenta: number;

  @Column('integer', { name: 'id_producto', nullable: false })
  idProducto: number;

  @Column('varchar', { length: 150, nullable: false })
  nombreProducto: string;

  @Column('decimal', { precision: 10, scale: 2, nullable: false })
  precioUnitario: number;

  @Column('integer', { nullable: false })
  cantidad: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: false })
  subtotal: number;

  @Column('text', { nullable: true })
  notas: string;

  @Column('varchar', { length: 50, nullable: true })
  tamaño: string;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;

  @ManyToOne(() => Venta, (venta) => venta.detalles, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_venta', referencedColumnName: 'id' })
  venta: Venta;

  @ManyToOne(() => Producto, (producto) => producto.detalles, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'id_producto', referencedColumnName: 'id' })
  producto: Producto;
}
