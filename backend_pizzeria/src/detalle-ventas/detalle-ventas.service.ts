import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDetalleVentaDto } from './dto/create-detalle-venta.dto';
import { UpdateDetalleVentaDto } from './dto/update-detalle-venta.dto';
import { DetalleVenta } from './entities/detalle-venta.entity';

@Injectable()
export class DetalleVentasService {
  constructor(
    @InjectRepository(DetalleVenta)
    private detalleVentasRepository: Repository<DetalleVenta>,
  ) {}

  async create(createDetalleVentaDto: CreateDetalleVentaDto): Promise<DetalleVenta> {
    const detalle = new DetalleVenta();
    detalle.idVenta = createDetalleVentaDto.idVenta;
    detalle.idProducto = createDetalleVentaDto.idProducto;
    detalle.nombreProducto = createDetalleVentaDto.nombreProducto.trim();
    detalle.precioUnitario = createDetalleVentaDto.precioUnitario;
    detalle.cantidad = createDetalleVentaDto.cantidad;
    detalle.subtotal = createDetalleVentaDto.subtotal;
    detalle.notas = createDetalleVentaDto.notas?.trim() ?? "";
    
    return this.detalleVentasRepository.save(detalle);
  }

  async findAll(): Promise<DetalleVenta[]> {
    return this.detalleVentasRepository.find({ 
      relations: ['venta', 'producto'],
      order: { id: 'ASC' } 
    });
  }

  async findOne(id: number): Promise<DetalleVenta> {
    const detalle = await this.detalleVentasRepository.findOne({
      where: { id },
      relations: ['venta', 'producto'],
    });
    if (!detalle) throw new NotFoundException('El detalle de venta no existe');
    return detalle;
  }

  async update(id: number, updateDetalleVentaDto: UpdateDetalleVentaDto): Promise<DetalleVenta> {
    const detalle = await this.findOne(id);
    const detalleUpdate = Object.assign(detalle, updateDetalleVentaDto);
    return this.detalleVentasRepository.save(detalleUpdate);
  }

  async remove(id: number) {
    const detalle = await this.findOne(id);
    return this.detalleVentasRepository.softRemove(detalle);
  }
}
