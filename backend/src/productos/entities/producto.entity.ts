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
import { Categoria } from 'src/categorias/entities/categoria.entity';
import { DetalleVenta } from 'src/detalle-ventas/entities/detalle-venta.entity';

@Entity('productos')
export class Producto {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column('int', { name: 'categoria_id', nullable: false })
  categoriaId: number;

  @Column('varchar', { length: 150, nullable: false })
  nombre: string;

  @Column('text', { nullable: true })
  descripcion: string;

  @Column('decimal', { precision: 10, scale: 2, nullable: false })
  precio: number;

  @Column('varchar', { length: 255, nullable: true })
  imagenUrl: string;

  @Column('boolean', { default: true })
  disponible: boolean;

  @Column('boolean', { default: false })
  destacado: boolean;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;

  @UpdateDateColumn({ name: 'ultima_actualizacion' })
  ultimaActualizacion: Date;

  @DeleteDateColumn({ name: 'fecha_eliminacion', select: false })
  fechaEliminacion: Date;

  @ManyToOne(() => Categoria, (categoria) => categoria.productos)
  @JoinColumn({ name: 'categoria_id', referencedColumnName: 'id' })
  categoria: Categoria;

  @OneToMany(() => DetalleVenta, (detalle) => detalle.producto)
  detalles: DetalleVenta[];
}
