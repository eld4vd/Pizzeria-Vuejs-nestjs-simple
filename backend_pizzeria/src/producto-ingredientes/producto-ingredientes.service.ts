import {
  ConflictException,
  Injectable,
  NotFoundException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductoIngredienteDto } from './dto/create-producto-ingrediente.dto';
import { UpdateProductoIngredienteDto } from './dto/update-producto-ingrediente.dto';
import { ProductoIngrediente } from './entities/producto-ingrediente.entity';
import { ProductosService } from 'src/productos/productos.service';

@Injectable()
export class ProductoIngredientesService {
  constructor(
    @InjectRepository(ProductoIngrediente)
    private productoIngredientesRepository: Repository<ProductoIngrediente>,
    @Inject(forwardRef(() => ProductosService))
    private productosService: ProductosService,
  ) {}

  async create(
    createProductoIngredienteDto: CreateProductoIngredienteDto,
  ): Promise<ProductoIngrediente> {
    const existe = await this.productoIngredientesRepository.findOne({
      where: {
        idProducto: createProductoIngredienteDto.idProducto,
        idIngrediente: createProductoIngredienteDto.idIngrediente,
      },
    });

    if (existe) {
      throw new ConflictException(
        'Este ingrediente ya está asignado a este producto',
      );
    }

    const productoIngrediente = this.productoIngredientesRepository.create(
      createProductoIngredienteDto,
    );
    const resultado = await this.productoIngredientesRepository.save(productoIngrediente);
    
    // Recalcular precio del producto después de agregar ingrediente
    await this.productosService.recalcularPrecio(createProductoIngredienteDto.idProducto);
    
    return resultado;
  }

  async findAll(): Promise<ProductoIngrediente[]> {
    return this.productoIngredientesRepository.find({
      relations: ['producto', 'ingrediente'],
      order: { idProducto: 'ASC', idIngrediente: 'ASC' },
    });
  }

  async findByProducto(idProducto: number): Promise<ProductoIngrediente[]> {
    return this.productoIngredientesRepository.find({
      where: { idProducto },
      relations: ['ingrediente'],
      order: { ingrediente: { nombre: 'ASC' } },
    });
  }

  async findByIngrediente(idIngrediente: number): Promise<ProductoIngrediente[]> {
    return this.productoIngredientesRepository.find({
      where: { idIngrediente },
      relations: ['producto'],
      order: { producto: { nombre: 'ASC' } },
    });
  }

  async findOne(id: number): Promise<ProductoIngrediente> {
    const productoIngrediente = await this.productoIngredientesRepository.findOne({
      where: { id },
      relations: ['producto', 'ingrediente'],
    });

    if (!productoIngrediente) {
      throw new NotFoundException(
        `Relación producto-ingrediente con ID ${id} no encontrada`,
      );
    }

    return productoIngrediente;
  }

  async update(
    id: number,
    updateProductoIngredienteDto: UpdateProductoIngredienteDto,
  ): Promise<ProductoIngrediente> {
    const productoIngrediente = await this.findOne(id);
    const idProductoOriginal = productoIngrediente.idProducto;

    if (
      updateProductoIngredienteDto.idProducto &&
      updateProductoIngredienteDto.idIngrediente
    ) {
      const existe = await this.productoIngredientesRepository.findOne({
        where: {
          idProducto: updateProductoIngredienteDto.idProducto,
          idIngrediente: updateProductoIngredienteDto.idIngrediente,
        },
      });

      if (existe && existe.id !== id) {
        throw new ConflictException(
          'Este ingrediente ya está asignado a este producto',
        );
      }
    }

    Object.assign(productoIngrediente, updateProductoIngredienteDto);
    const resultado = await this.productoIngredientesRepository.save(productoIngrediente);
    
    // Recalcular precio del producto afectado
    const idProductoFinal = updateProductoIngredienteDto.idProducto || idProductoOriginal;
    await this.productosService.recalcularPrecio(idProductoFinal);
    
    return resultado;
  }

  async remove(id: number): Promise<{ success: boolean; message: string }> {
    const productoIngrediente = await this.findOne(id);
    const idProducto = productoIngrediente.idProducto;
    
    await this.productoIngredientesRepository.remove(productoIngrediente);
    
    // Recalcular precio del producto después de eliminar ingrediente
    await this.productosService.recalcularPrecio(idProducto);
    
    return {
      success: true,
      message: 'Ingrediente removido del producto exitosamente',
    };
  }

  async removeByProductoAndIngrediente(
    idProducto: number,
    idIngrediente: number,
  ): Promise<{ success: boolean; message: string }> {
    const productoIngrediente = await this.productoIngredientesRepository.findOne({
      where: { idProducto, idIngrediente },
    });

    if (!productoIngrediente) {
      throw new NotFoundException(
        'Relación producto-ingrediente no encontrada',
      );
    }

    await this.productoIngredientesRepository.remove(productoIngrediente);
    
    // Recalcular precio del producto después de eliminar ingrediente
    await this.productosService.recalcularPrecio(idProducto);
    
    return {
      success: true,
      message: 'Ingrediente removido del producto exitosamente',
    };
  }
}
