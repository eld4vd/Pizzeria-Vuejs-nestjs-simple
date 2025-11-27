import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTamañoDto } from './dto/create-tamaño.dto';
import { UpdateTamañoDto } from './dto/update-tamaño.dto';
import { Tamaño } from './entities/tamaño.entity';

@Injectable()
export class TamañosService {
  constructor(
    @InjectRepository(Tamaño)
    private tamañosRepository: Repository<Tamaño>,
  ) {}

  async create(createTamañoDto: CreateTamañoDto): Promise<Tamaño> {
    const tamaño = this.tamañosRepository.create(createTamañoDto);
    return await this.tamañosRepository.save(tamaño);
  }

  async findAll(): Promise<Tamaño[]> {
    return await this.tamañosRepository.find({
      where: { activo: true },
      order: { multiplicadorPrecio: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Tamaño> {
    return await this.tamañosRepository.findOneBy({ id }) as Tamaño;
  }

  async update(id: number, updateTamañoDto: UpdateTamañoDto): Promise<Tamaño> {
    const tamaño = await this.findOne(id);
    const tamañoUpdate = Object.assign(tamaño, updateTamañoDto);
    return await this.tamañosRepository.save(tamañoUpdate);
  }

  async remove(id: number) {
    return await this.tamañosRepository.softDelete(id);
  }
}
