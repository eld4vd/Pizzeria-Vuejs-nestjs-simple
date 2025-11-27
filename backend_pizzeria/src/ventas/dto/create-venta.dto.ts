import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, MaxLength, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { TipoVenta, MetodoPago, EstadoVenta } from '../entities/venta.entity';

export class CreateDetalleVentaDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'El idProducto es obligatorio' })
  @IsInt({ message: 'El idProducto debe ser un número entero' })
  readonly idProducto: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'El nombreProducto es obligatorio' })
  @IsString({ message: 'El nombreProducto debe ser una cadena' })
  readonly nombreProducto: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'El precioUnitario es obligatorio' })
  @IsNumber({}, { message: 'El precioUnitario debe ser un número' })
  @IsPositive({ message: 'El precioUnitario debe ser positivo' })
  readonly precioUnitario: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'La cantidad es obligatoria' })
  @IsInt({ message: 'La cantidad debe ser un número entero' })
  @IsPositive({ message: 'La cantidad debe ser positiva' })
  readonly cantidad: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'El subtotal es obligatorio' })
  @IsNumber({}, { message: 'El subtotal debe ser un número' })
  @IsPositive({ message: 'El subtotal debe ser positivo' })
  readonly subtotal: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString({ message: 'Las notas deben ser una cadena' })
  readonly notas?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString({ message: 'El tamaño debe ser una cadena' })
  @MaxLength(50, { message: 'El tamaño no debe ser mayor a 50 caracteres' })
  readonly tamaño?: string;
}

export class CreateVentaDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString({ message: 'El campo numeroVenta debe ser de tipo cadena' })
  @MaxLength(50, { message: 'El campo numeroVenta no debe ser mayor a 50 caracteres' })
  readonly numeroVenta?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt({ message: 'El campo idEmpleado debe ser un número entero' })
  readonly idEmpleado?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt({ message: 'El campo idCliente debe ser un número entero' })
  readonly idCliente?: number;

  @ApiProperty({ enum: TipoVenta })
  @IsNotEmpty({ message: 'El campo tipoVenta es obligatorio' })
  @IsEnum(TipoVenta, { message: 'El campo tipoVenta debe ser online o presencial' })
  readonly tipoVenta: TipoVenta;

  @ApiProperty({ enum: MetodoPago })
  @IsNotEmpty({ message: 'El campo metodoPago es obligatorio' })
  @IsEnum(MetodoPago, { message: 'El campo metodoPago debe ser qr, debito, efectivo o tarjeta' })
  readonly metodoPago: MetodoPago;

  @ApiProperty()
  @IsNotEmpty({ message: 'El campo clienteNombre es obligatorio' })
  @IsString({ message: 'El campo clienteNombre debe ser de tipo cadena' })
  @MaxLength(100, { message: 'El campo clienteNombre no debe ser mayor a 100 caracteres' })
  readonly clienteNombre: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'El campo clienteTelefono es obligatorio' })
  @IsString({ message: 'El campo clienteTelefono debe ser de tipo cadena' })
  @MaxLength(20, { message: 'El campo clienteTelefono no debe ser mayor a 20 caracteres' })
  readonly clienteTelefono: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString({ message: 'El campo clienteEmail debe ser de tipo cadena' })
  @MaxLength(100, { message: 'El campo clienteEmail no debe ser mayor a 100 caracteres' })
  readonly clienteEmail?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString({ message: 'El campo clienteNotas debe ser de tipo cadena' })
  readonly clienteNotas?: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'El campo subtotal es obligatorio' })
  @IsNumber({}, { message: 'El campo subtotal debe ser un número' })
  @IsPositive({ message: 'El campo subtotal debe ser un número positivo' })
  readonly subtotal: number;

  @ApiProperty({ default: 0 })
  @IsOptional()
  @IsNumber({}, { message: 'El campo descuento debe ser un número' })
  readonly descuento?: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'El campo total es obligatorio' })
  @IsNumber({}, { message: 'El campo total debe ser un número' })
  @IsPositive({ message: 'El campo total debe ser un número positivo' })
  readonly total: number;

  @ApiProperty({ enum: EstadoVenta, default: EstadoVenta.PENDIENTE })
  @IsOptional()
  @IsEnum(EstadoVenta, { message: 'El campo estado debe ser pendiente, confirmada, preparando, lista, entregada o cancelada' })
  readonly estado?: EstadoVenta;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString({ message: 'El campo notasInternas debe ser de tipo cadena' })
  readonly notasInternas?: string;

  @ApiProperty({ type: [CreateDetalleVentaDto], required: false })
  @IsOptional()
  @IsArray({ message: 'Los detalles deben ser un array' })
  @ValidateNested({ each: true })
  @Type(() => CreateDetalleVentaDto)
  readonly detalles?: CreateDetalleVentaDto[];
}
