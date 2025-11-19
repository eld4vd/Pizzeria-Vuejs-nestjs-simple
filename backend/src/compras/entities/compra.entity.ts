import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Proveedor } from 'src/proveedores/entities/proveedore.entity';
import { DetalleCompra } from './detalle-compra.entity';

export enum EstadoCompra {
  PENDIENTE = 'pendiente',
  RECIBIDA = 'recibida',
  CANCELADA = 'cancelada',
}

@Entity('compras')
export class Compra {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column('varchar', { length: 50, unique: true, nullable: false, name: 'numero_compra' })
  numeroCompra: string;

  @Column('integer', { name: 'id_proveedor', nullable: false })
  idProveedor: number;

  @Column('enum', { enum: EstadoCompra, default: EstadoCompra.PENDIENTE })
  estado: EstadoCompra;

  @Column('decimal', { precision: 10, scale: 2, nullable: false })
  total: number;

  @Column('text', { nullable: true })
  notas: string;

  @CreateDateColumn({ name: 'fecha_compra' })
  fechaCompra: Date;

  @UpdateDateColumn({ name: 'fecha_modificacion' })
  fechaModificacion: Date;

  @DeleteDateColumn({ name: 'fecha_eliminacion' })
  fechaEliminacion: Date;

  @ManyToOne(() => Proveedor)
  @JoinColumn({ name: 'id_proveedor', referencedColumnName: 'id' })
  proveedor: Proveedor;

  @OneToMany(() => DetalleCompra, (detalle) => detalle.compra, { cascade: true })
  detalles: DetalleCompra[];
}
