import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Venta } from 'src/ventas/entities/venta.entity';

@Entity('empleados')
export class Empleado {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column('varchar', { length: 100, nullable: false })
  nombre: string;

  @Column('varchar', { length: 100, unique: true, nullable: false })
  email: string;

  @Column('varchar', { length: 255, nullable: false })
  password: string;

  @Column('varchar', { length: 20, nullable: true })
  telefono: string;

  @Column('boolean', { default: true })
  activo: boolean;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;

  @UpdateDateColumn({ name: 'ultima_actualizacion' })
  ultimaActualizacion: Date;

  @DeleteDateColumn({ name: 'fecha_eliminacion', select: false })
  fechaEliminacion: Date;

  @OneToMany(() => Venta, (venta) => venta.empleado)
  ventas: Venta[];

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
  }

  async validatePassword(plainPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, this.password);
  }
}
