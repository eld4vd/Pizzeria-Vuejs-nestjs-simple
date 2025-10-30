import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEmpleadoDto } from './dto/create-empleado.dto';
import { UpdateEmpleadoDto } from './dto/update-empleado.dto';
import { Empleado } from './entities/empleado.entity';

@Injectable()
export class EmpleadosService {
  constructor(
    @InjectRepository(Empleado)
    private empleadosRepository: Repository<Empleado>,
  ) {}

  async create(createEmpleadoDto: CreateEmpleadoDto): Promise<Empleado> {
    const existe = await this.empleadosRepository.findOneBy({
      email: createEmpleadoDto.email.trim(),
    });

    if (existe) throw new ConflictException('El empleado ya existe');

    const empleado = new Empleado();
    empleado.nombre = createEmpleadoDto.nombre.trim();
    empleado.email = createEmpleadoDto.email.trim();
    empleado.password = createEmpleadoDto.password;
    empleado.telefono = createEmpleadoDto.telefono?.trim() ?? '';
    empleado.activo = createEmpleadoDto.activo ?? true;
    
    return this.empleadosRepository.save(empleado);
  }

  async findAll(): Promise<Empleado[]> {
    return this.empleadosRepository.find();
  }

  async findOne(id: number): Promise<Empleado> {
    const empleado = await this.empleadosRepository.findOneBy({ id });
    if (!empleado) throw new NotFoundException('El empleado no existe');
    return empleado;
  }

  async update(id: number, updateEmpleadoDto: UpdateEmpleadoDto): Promise<Empleado> {
    const empleado = await this.findOne(id);
    const empleadoUpdate = Object.assign(empleado, updateEmpleadoDto);
    return this.empleadosRepository.save(empleadoUpdate);
  }

  async remove(id: number) {
    const empleado = await this.findOne(id);
    return this.empleadosRepository.softRemove(empleado);
  }

  async validate(email: string, password: string): Promise<Empleado> {
    const empleado = await this.empleadosRepository.findOne({
      where: { email },
      select: ['id', 'nombre', 'email', 'password', 'telefono', 'activo'],
    });

    if (!empleado) throw new NotFoundException('Empleado inexistente');

    if (!(await empleado?.validatePassword(password))) {
      throw new UnauthorizedException('Contraseña incorrecta');
    }

    empleado.password = '';
    return empleado;
  }
}
