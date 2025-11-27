import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, MaxLength } from 'class-validator';

export class CreateDetalleVentaDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'El campo idVenta es obligatorio' })
  @IsInt({ message: 'El campo idVenta debe ser un número entero' })
  readonly idVenta: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'El campo idProducto es obligatorio' })
  @IsInt({ message: 'El campo idProducto debe ser un número entero' })
  readonly idProducto: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'El campo nombreProducto es obligatorio' })
  @IsString({ message: 'El campo nombreProducto debe ser de tipo cadena' })
  @MaxLength(100, { message: 'El campo nombreProducto no debe ser mayor a 100 caracteres' })
  readonly nombreProducto: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'El campo precioUnitario es obligatorio' })
  @IsNumber({}, { message: 'El campo precioUnitario debe ser un número' })
  @IsPositive({ message: 'El campo precioUnitario debe ser un número positivo' })
  readonly precioUnitario: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'El campo cantidad es obligatorio' })
  @IsInt({ message: 'El campo cantidad debe ser un número entero' })
  @IsPositive({ message: 'El campo cantidad debe ser un número positivo' })
  readonly cantidad: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'El campo subtotal es obligatorio' })
  @IsNumber({}, { message: 'El campo subtotal debe ser un número' })
  @IsPositive({ message: 'El campo subtotal debe ser un número positivo' })
  readonly subtotal: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString({ message: 'El campo notas debe ser de tipo cadena' })
  readonly notas?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString({ message: 'El campo tamaño debe ser de tipo cadena' })
  @MaxLength(50, { message: 'El campo tamaño no debe ser mayor a 50 caracteres' })
  readonly tamaño?: string;
}
