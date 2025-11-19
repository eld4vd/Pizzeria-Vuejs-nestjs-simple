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
import { Empleado } from 'src/empleados/entities/empleado.entity';
import { DetalleVenta } from 'src/detalle-ventas/entities/detalle-venta.entity';

export enum TipoVenta {
  ONLINE = 'online',
  PRESENCIAL = 'presencial',
}

export enum MetodoPago {
  QR = 'qr',
  DEBITO = 'debito',
  EFECTIVO = 'efectivo',
  TARJETA = 'tarjeta',
}

export enum EstadoVenta {
  PENDIENTE = 'pendiente',
  CONFIRMADA = 'confirmada',
  PREPARANDO = 'preparando',
  LISTA = 'lista',
  ENTREGADA = 'entregada',
  CANCELADA = 'cancelada',
}

@Entity('ventas')
export class Venta {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column('varchar', { length: 50, unique: true, nullable: false })
  numeroVenta: string;

  @Column('integer', { name: 'id_empleado', nullable: true })
  idEmpleado: number;

  @Column('enum', { enum: TipoVenta, nullable: false })
  tipoVenta: TipoVenta;

  @Column('enum', { enum: MetodoPago, nullable: false })
  metodoPago: MetodoPago;

  @Column('varchar', { length: 100, nullable: false })
  clienteNombre: string;

  @Column('varchar', { length: 20, nullable: false })
  clienteTelefono: string;

  @Column('varchar', { length: 100, nullable: true })
  clienteEmail: string;

  @Column('text', { nullable: true })
  clienteNotas: string;

  @Column('decimal', { precision: 10, scale: 2, nullable: false })
  subtotal: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0.0 })
  descuento: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: false })
  total: number;

  @Column('enum', {
    enum: EstadoVenta,
    default: EstadoVenta.CONFIRMADA,
  })
  estado: EstadoVenta;

  @Column('text', { nullable: true })
  notasInternas: string;

  @CreateDateColumn({ name: 'fecha_venta' })
  fechaVenta: Date;

  @UpdateDateColumn({ name: 'fecha_modificacion' })
  fechaModificacion: Date;

  @DeleteDateColumn({ name: 'fecha_eliminacion' })
  fechaEliminacion: Date;

  @ManyToOne(() => Empleado, (empleado) => empleado.ventas)
  @JoinColumn({ name: 'id_empleado', referencedColumnName: 'id' })
  empleado: Empleado;

  @OneToMany(() => DetalleVenta, (detalle) => detalle.venta)
  detalles: DetalleVenta[];
}
