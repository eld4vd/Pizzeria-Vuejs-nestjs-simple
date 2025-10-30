import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { Producto } from './entities/producto.entity';

@Injectable()
export class ProductosService {
  constructor(
    @InjectRepository(Producto)
    private productosRepository: Repository<Producto>,
  ) {}

  async create(createProductoDto: CreateProductoDto): Promise<Producto> {
    const existe = await this.productosRepository.findOneBy({
      nombre: createProductoDto.nombre.trim(),
      categoriaId: createProductoDto.categoriaId,
    });

    if (existe) throw new ConflictException('El producto ya existe');

    const producto = new Producto();
    producto.categoriaId = createProductoDto.categoriaId;
    producto.nombre = createProductoDto.nombre.trim();
    producto.descripcion = (createProductoDto.descripcion ?? '').trim();
    producto.precio = createProductoDto.precio;
    producto.imagenUrl = (createProductoDto.imagenUrl ?? '').trim();
    producto.disponible = createProductoDto.disponible ?? true;
    producto.destacado = createProductoDto.destacado ?? false;
    
    return this.productosRepository.save(producto);
  }

  async findAll(): Promise<Producto[]> {
    return this.productosRepository.find({ 
      relations: ['categoria'],
      order: { nombre: 'ASC' } 
    });
  }

  async findOne(id: number): Promise<Producto> {
    const producto = await this.productosRepository.findOne({
      where: { id },
      relations: ['categoria'],
    });
    if (!producto) throw new NotFoundException('El producto no existe');
    return producto;
  }

  async update(id: number, updateProductoDto: UpdateProductoDto): Promise<Producto> {
    const producto = await this.findOne(id);
    const productoUpdate = Object.assign(producto, updateProductoDto);
    return this.productosRepository.save(productoUpdate);
  }

  async remove(id: number) {
    const producto = await this.findOne(id);
    return this.productosRepository.softRemove(producto);
  }
}
