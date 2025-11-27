import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ProductoIngredientesService } from './producto-ingredientes.service';
import { CreateProductoIngredienteDto } from './dto/create-producto-ingrediente.dto';
import { UpdateProductoIngredienteDto } from './dto/update-producto-ingrediente.dto';
import { Public } from 'src/auth/decorators/auth-public.decorator';

@ApiTags('producto-ingredientes')
@Controller('producto-ingredientes')
export class ProductoIngredientesController {
  constructor(
    private readonly productoIngredientesService: ProductoIngredientesService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Asignar un ingrediente a un producto' })
  @ApiResponse({ status: 201, description: 'Ingrediente asignado exitosamente' })
  @ApiResponse({ status: 409, description: 'El ingrediente ya está asignado a este producto' })
  create(@Body() createProductoIngredienteDto: CreateProductoIngredienteDto) {
    return this.productoIngredientesService.create(createProductoIngredienteDto);
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'Obtener todas las relaciones producto-ingrediente' })
  @ApiResponse({ status: 200, description: 'Lista de relaciones obtenida' })
  findAll() {
    return this.productoIngredientesService.findAll();
  }

  @Public()
  @Get('producto/:idProducto')
  @ApiOperation({ summary: 'Obtener todos los ingredientes de un producto' })
  @ApiResponse({ status: 200, description: 'Ingredientes del producto obtenidos' })
  findByProducto(@Param('idProducto', ParseIntPipe) idProducto: number) {
    return this.productoIngredientesService.findByProducto(idProducto);
  }

  @Public()
  @Get('ingrediente/:idIngrediente')
  @ApiOperation({ summary: 'Obtener todos los productos que usan un ingrediente' })
  @ApiResponse({ status: 200, description: 'Productos que usan el ingrediente obtenidos' })
  findByIngrediente(@Param('idIngrediente', ParseIntPipe) idIngrediente: number) {
    return this.productoIngredientesService.findByIngrediente(idIngrediente);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Obtener una relación producto-ingrediente por ID' })
  @ApiResponse({ status: 200, description: 'Relación obtenida' })
  @ApiResponse({ status: 404, description: 'Relación no encontrada' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productoIngredientesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una relación producto-ingrediente' })
  @ApiResponse({ status: 200, description: 'Relación actualizada' })
  @ApiResponse({ status: 404, description: 'Relación no encontrada' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductoIngredienteDto: UpdateProductoIngredienteDto,
  ) {
    return this.productoIngredientesService.update(id, updateProductoIngredienteDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una relación producto-ingrediente' })
  @ApiResponse({ status: 200, description: 'Relación eliminada' })
  @ApiResponse({ status: 404, description: 'Relación no encontrada' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productoIngredientesService.remove(id);
  }

  @Delete('producto/:idProducto/ingrediente/:idIngrediente')
  @ApiOperation({ summary: 'Eliminar un ingrediente específico de un producto' })
  @ApiResponse({ status: 200, description: 'Ingrediente removido del producto' })
  @ApiResponse({ status: 404, description: 'Relación no encontrada' })
  removeByProductoAndIngrediente(
    @Param('idProducto', ParseIntPipe) idProducto: number,
    @Param('idIngrediente', ParseIntPipe) idIngrediente: number,
  ) {
    return this.productoIngredientesService.removeByProductoAndIngrediente(
      idProducto,
      idIngrediente,
    );
  }
}
