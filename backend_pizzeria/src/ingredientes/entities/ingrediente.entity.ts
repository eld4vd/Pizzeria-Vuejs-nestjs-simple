import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProductoIngrediente } from 'src/producto-ingredientes/entities/producto-ingrediente.entity';

@Entity('ingredientes')
export class Ingrediente {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column('varchar', { length: 100, unique: true, nullable: false })
  nombre: string;

  @Column('text', { nullable: true })
  descripcion: string | null;

  @Column('varchar', { length: 50, nullable: true })
  unidadMedida: string | null; // gramos, unidades, ml, etc.

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  stock: number;

  @Column('varchar', { length: 255, nullable: true })
  imagenUrl: string | null;

  @Column('boolean', { default: true })
  disponible: boolean;

  @Column('boolean', { default: false })
  esAlergeno: boolean; // para marcar si es un alérgeno común

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;

  @UpdateDateColumn({ name: 'fecha_modificacion' })
  fechaModificacion: Date;

  @DeleteDateColumn({ name: 'fecha_eliminacion' })
  fechaEliminacion: Date;

  @OneToMany(() => ProductoIngrediente, (pi) => pi.ingrediente)
  productos: ProductoIngrediente[];
}
