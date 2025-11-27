import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Producto } from 'src/productos/entities/producto.entity';
import { Ingrediente } from 'src/ingredientes/entities/ingrediente.entity';

@Entity('producto_ingredientes')
export class ProductoIngrediente {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column('integer', { name: 'id_producto', nullable: false })
  idProducto: number;

  @Column('integer', { name: 'id_ingrediente', nullable: false })
  idIngrediente: number;

  @Column('decimal', { precision: 10, scale: 3, nullable: false })
  cantidad: number;

  @Column('text', { nullable: true })
  notas: string;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;

  @UpdateDateColumn({ name: 'fecha_modificacion' })
  fechaModificacion: Date;

  @ManyToOne(() => Producto, (producto) => producto.ingredientes, { 
    onDelete: 'CASCADE' 
  })
  @JoinColumn({ name: 'id_producto', referencedColumnName: 'id' })
  producto: Producto;

  @ManyToOne(() => Ingrediente, (ingrediente) => ingrediente.productos, { 
    onDelete: 'RESTRICT' 
  })
  @JoinColumn({ name: 'id_ingrediente', referencedColumnName: 'id' })
  ingrediente: Ingrediente;
}
