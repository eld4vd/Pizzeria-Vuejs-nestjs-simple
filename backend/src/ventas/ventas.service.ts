import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateVentaDto } from './dto/create-venta.dto';
import { UpdateVentaDto } from './dto/update-venta.dto';
import { Venta } from './entities/venta.entity';

@Injectable()
export class VentasService {
  constructor(
    @InjectRepository(Venta)
    private ventasRepository: Repository<Venta>,
  ) {}

  async create(createVentaDto: CreateVentaDto): Promise<Venta> {
    const existe = await this.ventasRepository.findOneBy({
      numeroVenta: createVentaDto.numeroVenta.trim(),
    });

    if (existe) throw new ConflictException('La venta ya existe');

    const venta = new Venta();
    venta.numeroVenta = createVentaDto.numeroVenta.trim();
    if (createVentaDto.empleadoId) venta.empleadoId = createVentaDto.empleadoId;
    venta.tipoVenta = createVentaDto.tipoVenta;
    venta.metodoPago = createVentaDto.metodoPago;
    venta.clienteNombre = createVentaDto.clienteNombre.trim();
    venta.clienteTelefono = createVentaDto.clienteTelefono.trim();
    if (createVentaDto.clienteEmail) venta.clienteEmail = createVentaDto.clienteEmail.trim();
    if (createVentaDto.clienteNotas) venta.clienteNotas = createVentaDto.clienteNotas.trim();
    venta.subtotal = createVentaDto.subtotal;
    venta.descuento = createVentaDto.descuento ?? 0;
    venta.total = createVentaDto.total;
    if (createVentaDto.estado) venta.estado = createVentaDto.estado;
    if (createVentaDto.notasInternas) venta.notasInternas = createVentaDto.notasInternas.trim();
    
    return this.ventasRepository.save(venta);
  }

  async findAll(): Promise<Venta[]> {
    return this.ventasRepository.find({ 
      relations: ['empleado', 'detalles'],
      order: { fechaVenta: 'DESC' } 
    });
  }

  async findOne(id: number): Promise<Venta> {
    const venta = await this.ventasRepository.findOne({
      where: { id },
      relations: ['empleado', 'detalles'],
    });
    if (!venta) throw new NotFoundException('La venta no existe');
    return venta;
  }

  async update(id: number, updateVentaDto: UpdateVentaDto): Promise<Venta> {
    const venta = await this.findOne(id);
    const ventaUpdate = Object.assign(venta, updateVentaDto);
    return this.ventasRepository.save(ventaUpdate);
  }

  async remove(id: number) {
    const venta = await this.findOne(id);
    return this.ventasRepository.softRemove(venta);
  }
}
