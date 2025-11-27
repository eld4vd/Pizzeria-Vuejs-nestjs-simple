import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('proveedores')
export class Proveedor {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column('varchar', { length: 150, nullable: false })
  nombre: string;

  @Column('varchar', { length: 200, nullable: true })
  empresa?: string;

  @Column('varchar', { length: 20, nullable: true })
  telefono?: string;

  @Column('varchar', { length: 100, nullable: true })
  email?: string;

  @Column('text', { nullable: true })
  direccion?: string;

  @Column('varchar', { length: 50, nullable: true })
  ciudad?: string;

  @Column('varchar', { length: 20, nullable: true })
  nit?: string;

  @Column('text', { nullable: true })
  notas?: string;

  @Column('boolean', { default: true })
  activo: boolean;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;

  @UpdateDateColumn({ name: 'fecha_modificacion' })
  fechaModificacion: Date;

  @DeleteDateColumn({ name: 'fecha_eliminacion' })
  fechaEliminacion: Date;
}
