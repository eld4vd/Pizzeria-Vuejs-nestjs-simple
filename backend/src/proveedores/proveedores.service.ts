import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProveedorDto } from './dto/create-proveedore.dto';
import { UpdateProveedorDto } from './dto/update-proveedore.dto';
import { Proveedor } from './entities/proveedore.entity';

@Injectable()
export class ProveedoresService {
  constructor(
    @InjectRepository(Proveedor)
    private proveedoresRepository: Repository<Proveedor>,
  ) {}

  async create(createProveedorDto: CreateProveedorDto): Promise<Proveedor> {
    const existe = await this.proveedoresRepository.findOneBy({
      nombre: createProveedorDto.nombre.trim(),
    });

    if (existe) {
      throw new ConflictException('El proveedor ya existe');
    }

    const proveedor = this.proveedoresRepository.create();
    proveedor.nombre = createProveedorDto.nombre.trim();
    proveedor.empresa = createProveedorDto.empresa?.trim();
    proveedor.telefono = createProveedorDto.telefono?.trim();
    proveedor.email = createProveedorDto.email?.trim();
    proveedor.direccion = createProveedorDto.direccion?.trim();
    proveedor.ciudad = createProveedorDto.ciudad?.trim();
    proveedor.nit = createProveedorDto.nit?.trim();
    proveedor.notas = createProveedorDto.notas?.trim();
    proveedor.activo = createProveedorDto.activo ?? true;

    return this.proveedoresRepository.save(proveedor);
  }

  async findAll(): Promise<Proveedor[]> {
    return this.proveedoresRepository.find({
      order: { nombre: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Proveedor> {
    const proveedor = await this.proveedoresRepository.findOne({
      where: { id },
    });

    if (!proveedor) {
      throw new NotFoundException('Proveedor no encontrado');
    }

    return proveedor;
  }

  async update(id: number, updateProveedorDto: UpdateProveedorDto): Promise<Proveedor> {
    const proveedor = await this.findOne(id);

    const proveedorActualizado = Object.assign(proveedor, updateProveedorDto);
    return this.proveedoresRepository.save(proveedorActualizado);
  }

  async remove(id: number): Promise<void> {
    const proveedor = await this.findOne(id);
    await this.proveedoresRepository.softRemove(proveedor);
  }
}
