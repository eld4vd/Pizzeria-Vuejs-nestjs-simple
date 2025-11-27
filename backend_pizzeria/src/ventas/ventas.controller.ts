import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { VentasService } from './ventas.service';
import { CreateVentaDto } from './dto/create-venta.dto';
import { UpdateVentaDto } from './dto/update-venta.dto';
import { Public } from 'src/auth/decorators/auth-public.decorator';

@ApiTags('ventas')
@Controller('ventas')
export class VentasController {
  constructor(private readonly ventasService: VentasService) {}

  @Public()
  @Post()
  create(@Body() createVentaDto: CreateVentaDto) {
    return this.ventasService.create(createVentaDto);
  }

  @Get()
  findAll() {
    return this.ventasService.findAll();
  }

  @Public()
  @Get('cliente/telefono/:telefono')
  @ApiOperation({ summary: 'Obtener pedidos activos de un cliente por teléfono' })
  findByTelefono(@Param('telefono') telefono: string) {
    return this.ventasService.findByTelefono(telefono);
  }

  @Public()
  @Get('cliente/:idCliente')
  @ApiOperation({ summary: 'Obtener todos los pedidos de un cliente autenticado' })
  findByCliente(@Param('idCliente') idCliente: string) {
    return this.ventasService.findByCliente(+idCliente);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ventasService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVentaDto: UpdateVentaDto) {
    return this.ventasService.update(+id, updateVentaDto);
  }

  @Public()
  @Patch(':id/cancelar')
  @ApiOperation({ summary: 'Cancelar un pedido (solo si está pendiente o confirmada)' })
  cancelarPedido(@Param('id') id: string) {
    return this.ventasService.cancelarPedido(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ventasService.remove(+id);
  }
}
