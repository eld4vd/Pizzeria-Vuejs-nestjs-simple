import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateCompraDto } from './dto/create-compra.dto';
import { UpdateCompraDto } from './dto/update-compra.dto';
import { Compra, EstadoCompra } from './entities/compra.entity';
import { DetalleCompra } from './entities/detalle-compra.entity';
import { Ingrediente } from 'src/ingredientes/entities/ingrediente.entity';

@Injectable()
export class ComprasService {
  constructor(
    @InjectRepository(Compra)
    private comprasRepository: Repository<Compra>,
    @InjectRepository(DetalleCompra)
    private detalleComprasRepository: Repository<DetalleCompra>,
    @InjectRepository(Ingrediente)
    private ingredientesRepository: Repository<Ingrediente>,
    private dataSource: DataSource,
  ) {}

  async create(createCompraDto: CreateCompraDto): Promise<Compra> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Generar número de compra único
      const ultimaCompra = await this.comprasRepository.find({
        order: { id: 'DESC' },
        take: 1,
      });
      const numeroCompra = `COMP-${String(ultimaCompra.length > 0 ? ultimaCompra[0].id + 1 : 1).padStart(6, '0')}`;

      // Crear la compra
      const compra = this.comprasRepository.create({
        numeroCompra,
        idProveedor: createCompraDto.idProveedor,
        estado: createCompraDto.estado || EstadoCompra.RECIBIDA,
        total: createCompraDto.total,
        notas: createCompraDto.notas,
        fechaCompra: createCompraDto.fechaCompra ? new Date(createCompraDto.fechaCompra) : new Date(),
      });

      const compraSaved = await queryRunner.manager.save(compra);

      // Crear los detalles
      const detalles: DetalleCompra[] = [];
      for (const detalleDto of createCompraDto.detalles) {
        const detalle = this.detalleComprasRepository.create({
          idCompra: compraSaved.id,
          idIngrediente: detalleDto.idIngrediente,
          nombreIngrediente: detalleDto.nombreIngrediente,
          precioUnitario: detalleDto.precioUnitario,
          cantidad: detalleDto.cantidad,
          unidadMedida: detalleDto.unidadMedida,
          subtotal: detalleDto.subtotal,
          notas: detalleDto.notas,
        });

        const detalleSaved = await queryRunner.manager.save(detalle);
        detalles.push(detalleSaved);

        // INCREMENTAR STOCK del ingrediente
        await queryRunner.manager.increment(
          Ingrediente,
          { id: detalleDto.idIngrediente },
          'stock',
          Number(detalleDto.cantidad)
        );
      }

      await queryRunner.commitTransaction();

      // Retornar la compra con sus detalles
      return this.findOne(compraSaved.id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(): Promise<Compra[]> {
    return this.comprasRepository.find({
      relations: ['proveedor', 'detalles', 'detalles.ingrediente'],
      order: { id: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Compra> {
    const compra = await this.comprasRepository.findOne({
      where: { id },
      relations: ['proveedor', 'detalles', 'detalles.ingrediente'],
    });

    if (!compra) {
      throw new NotFoundException('Compra no encontrada');
    }

    return compra;
  }

  async update(id: number, updateCompraDto: UpdateCompraDto): Promise<Compra> {
    const compra = await this.findOne(id);

    // Solo permitir actualizar estado y notas, no los detalles
    if (updateCompraDto.estado) {
      compra.estado = updateCompraDto.estado;
    }
    if (updateCompraDto.notas !== undefined) {
      compra.notas = updateCompraDto.notas;
    }

    await this.comprasRepository.save(compra);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const compra = await this.findOne(id);
    await this.comprasRepository.softRemove(compra);
  }
}
