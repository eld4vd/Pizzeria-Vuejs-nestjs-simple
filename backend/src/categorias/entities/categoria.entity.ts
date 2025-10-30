import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Producto } from 'src/productos/entities/producto.entity';

@Entity('categorias')
export class Categoria {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column('varchar', { length: 100, unique: true, nullable: false })
  nombre: string;

  @Column('text', { nullable: true })
  descripcion: string;

  @Column('varchar', { length: 255, nullable: true })
  imagenUrl: string;

  @Column('boolean', { default: true })
  activo: boolean;

  @Column('int', { default: 0 })
  orden: number;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;

  @UpdateDateColumn({ name: 'ultima_actualizacion' })
  ultimaActualizacion: Date;

  @DeleteDateColumn({ name: 'fecha_eliminacion', select: false })
  fechaEliminacion: Date;

  @OneToMany(() => Producto, (producto) => producto.categoria)
  productos: Producto[];
}
