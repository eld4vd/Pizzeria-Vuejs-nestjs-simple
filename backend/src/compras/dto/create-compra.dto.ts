import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { EstadoCompra } from '../entities/compra.entity';

export class DetalleCompraDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'El ID del ingrediente es obligatorio' })
  @IsInt({ message: 'El ID del ingrediente debe ser un entero' })
  idIngrediente: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'El nombre del ingrediente es obligatorio' })
  @IsString({ message: 'El nombre debe ser texto' })
  @MaxLength(100, { message: 'El nombre no debe exceder 100 caracteres' })
  nombreIngrediente: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'El precio unitario es obligatorio' })
  @IsNumber({}, { message: 'El precio debe ser un número' })
  @IsPositive({ message: 'El precio debe ser positivo' })
  precioUnitario: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'La cantidad es obligatoria' })
  @IsNumber({}, { message: 'La cantidad debe ser un número' })
  @IsPositive({ message: 'La cantidad debe ser positiva' })
  cantidad: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString({ message: 'La unidad de medida debe ser texto' })
  @MaxLength(50, { message: 'La unidad no debe exceder 50 caracteres' })
  unidadMedida?: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'El subtotal es obligatorio' })
  @IsNumber({}, { message: 'El subtotal debe ser un número' })
  @IsPositive({ message: 'El subtotal debe ser positivo' })
  subtotal: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString({ message: 'Las notas deben ser texto' })
  notas?: string;
}

export class CreateCompraDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'El ID del proveedor es obligatorio' })
  @IsInt({ message: 'El ID del proveedor debe ser un entero' })
  idProveedor: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString({ message: 'La fecha de compra debe ser una fecha válida' })
  fechaCompra?: string;

  @ApiProperty({ enum: EstadoCompra, required: false, default: EstadoCompra.PENDIENTE })
  @IsOptional()
  @IsEnum(EstadoCompra, { message: 'Estado debe ser: pendiente, recibida o cancelada' })
  estado?: EstadoCompra;

  @ApiProperty()
  @IsNotEmpty({ message: 'El total es obligatorio' })
  @IsNumber({}, { message: 'El total debe ser un número' })
  @IsPositive({ message: 'El total debe ser positivo' })
  total: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString({ message: 'Las notas deben ser texto' })
  notas?: string;

  @ApiProperty({ type: [DetalleCompraDto] })
  @IsNotEmpty({ message: 'Los detalles son obligatorios' })
  @IsArray({ message: 'Los detalles deben ser un array' })
  @ValidateNested({ each: true })
  @Type(() => DetalleCompraDto)
  detalles: DetalleCompraDto[];
}
