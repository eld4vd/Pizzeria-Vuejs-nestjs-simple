import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Compra } from './compra.entity';
import { Ingrediente } from 'src/ingredientes/entities/ingrediente.entity';

@Entity('detalle_compras')
export class DetalleCompra {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column('integer', { name: 'id_compra', nullable: false })
  idCompra: number;

  @Column('integer', { name: 'id_ingrediente', nullable: false })
  idIngrediente: number;

  @Column('varchar', { length: 100, nullable: false, name: 'nombre_ingrediente' })
  nombreIngrediente: string;

  @Column('decimal', { precision: 10, scale: 2, nullable: false, name: 'precio_unitario' })
  precioUnitario: number;

  @Column('integer', { nullable: false })
  cantidad: number;

  @Column('varchar', { length: 50, nullable: true, name: 'unidad_medida' })
  unidadMedida: string;

  @Column('decimal', { precision: 10, scale: 2, nullable: false })
  subtotal: number;

  @Column('text', { nullable: true })
  notas: string;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;

  @ManyToOne(() => Compra, (compra) => compra.detalles, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_compra', referencedColumnName: 'id' })
  compra: Compra;

  @ManyToOne(() => Ingrediente, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'id_ingrediente', referencedColumnName: 'id' })
  ingrediente: Ingrediente;
}
