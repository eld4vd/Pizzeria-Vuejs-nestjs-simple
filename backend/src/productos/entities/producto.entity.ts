import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { DetalleVenta } from 'src/detalle-ventas/entities/detalle-venta.entity';
import { ProductoIngrediente } from 'src/producto-ingredientes/entities/producto-ingrediente.entity';

export enum CategoriaProducto {
  PIZZA = 'pizza',
  BEBIDA = 'bebida',
  POSTRE = 'postre',
  EXTRA = 'extra',
}

export enum TamañoProducto {
  PERSONAL = 'personal',
  MEDIANA = 'mediana',
  FAMILIAR = 'familiar',
  INDIVIDUAL = 'individual', // Para bebidas
  LITRO = 'litro', // Para bebidas
}

@Entity('productos')
export class Producto {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column('enum', { enum: CategoriaProducto, nullable: false })
  categoria: CategoriaProducto;

  @Column('varchar', { length: 150, nullable: false })
  nombre: string;

  @Column('text', { nullable: true })
  descripcion: string;

  @Column('decimal', { precision: 10, scale: 2, nullable: false, name: 'precio_base', default: 0 })
  precioBase: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: false })
  precio: number;

  @Column('integer', { default: 0 })
  stock: number;

  @Column('varchar', { length: 255, nullable: true })
  imagenUrl: string;

  // Tamaños disponibles para este producto (JSON)
  // Ejemplo: ["personal", "mediana", "familiar"] para pizzas
  // Ejemplo: ["individual", "litro"] para bebidas
  @Column('simple-array', { nullable: true, name: 'tamaños_disponibles' })
  tamañosDisponibles: string[];

  @Column('boolean', { default: true })
  disponible: boolean;

  @Column('boolean', { default: false })
  destacado: boolean;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;

  @UpdateDateColumn({ name: 'fecha_modificacion' })
  fechaModificacion: Date;

  @DeleteDateColumn({ name: 'fecha_eliminacion' })
  fechaEliminacion: Date;

  @OneToMany(() => DetalleVenta, (detalle) => detalle.producto)
  detalles: DetalleVenta[];

  @OneToMany(() => ProductoIngrediente, (pi) => pi.producto)
  ingredientes: ProductoIngrediente[];
}
