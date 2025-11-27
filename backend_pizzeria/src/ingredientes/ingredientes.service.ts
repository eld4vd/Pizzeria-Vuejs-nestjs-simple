import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateIngredienteDto } from './dto/create-ingrediente.dto';
import { UpdateIngredienteDto } from './dto/update-ingrediente.dto';
import { Ingrediente } from './entities/ingrediente.entity';

@Injectable()
export class IngredientesService {
  constructor(
    @InjectRepository(Ingrediente)
    private ingredientesRepository: Repository<Ingrediente>,
  ) {}

  async create(
    createIngredienteDto: CreateIngredienteDto,
  ): Promise<Ingrediente> {
    const existe = await this.ingredientesRepository.findOneBy({
      nombre: createIngredienteDto.nombre.trim(),
    });

    if (existe) {
      throw new ConflictException(
        `El ingrediente ${createIngredienteDto.nombre} ya existe`,
      );
    }

    const ingrediente = new Ingrediente();
    ingrediente.nombre = createIngredienteDto.nombre.trim();
    ingrediente.descripcion = createIngredienteDto.descripcion?.trim() || null;
    ingrediente.unidadMedida = createIngredienteDto.unidadMedida?.trim() || null;
    ingrediente.stock = createIngredienteDto.stock || 0;
    ingrediente.imagenUrl = createIngredienteDto.imagenUrl?.trim() || null;
    ingrediente.disponible = createIngredienteDto.disponible ?? true;
    ingrediente.esAlergeno = createIngredienteDto.esAlergeno ?? false;

    return this.ingredientesRepository.save(ingrediente);
  }

  async findAll(): Promise<Ingrediente[]> {
    return this.ingredientesRepository.find({ order: { nombre: 'ASC' } });
  }

  async findOne(id: number): Promise<Ingrediente> {
    const ingrediente = await this.ingredientesRepository.findOneBy({ id });
    if (!ingrediente) {
      throw new NotFoundException(
        `El ingrediente con id ${id} no fue encontrado`,
      );
    }
    return ingrediente;
  }

  async update(
    id: number,
    updateIngredienteDto: UpdateIngredienteDto,
  ): Promise<Ingrediente> {
    const ingrediente = await this.findOne(id);

    if (updateIngredienteDto.nombre) {
      const existeNombre = await this.ingredientesRepository.findOneBy({
        nombre: updateIngredienteDto.nombre.trim(),
      });
      if (existeNombre && existeNombre.id !== id) {
        throw new ConflictException(
          `El ingrediente ${updateIngredienteDto.nombre} ya existe`,
        );
      }
      ingrediente.nombre = updateIngredienteDto.nombre.trim();
    }

    if (updateIngredienteDto.descripcion !== undefined) {
      ingrediente.descripcion = updateIngredienteDto.descripcion?.trim();
    }

    if (updateIngredienteDto.unidadMedida !== undefined) {
      ingrediente.unidadMedida = updateIngredienteDto.unidadMedida?.trim();
    }

    if (updateIngredienteDto.stock !== undefined) {
      ingrediente.stock = updateIngredienteDto.stock;
    }

    if (updateIngredienteDto.imagenUrl !== undefined) {
      ingrediente.imagenUrl = updateIngredienteDto.imagenUrl?.trim();
    }

    if (updateIngredienteDto.disponible !== undefined) {
      ingrediente.disponible = updateIngredienteDto.disponible;
    }

    if (updateIngredienteDto.esAlergeno !== undefined) {
      ingrediente.esAlergeno = updateIngredienteDto.esAlergeno;
    }

    return this.ingredientesRepository.save(ingrediente);
  }

  async remove(id: number): Promise<void> {
    const ingrediente = await this.findOne(id);
    await this.ingredientesRepository.softRemove(ingrediente);
  }
}
