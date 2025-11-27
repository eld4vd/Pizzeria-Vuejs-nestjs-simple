import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  Min,
  Validate,
  ValidateNested,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { EstadoCompra } from '../entities/compra.entity';

// Validador personalizado para fecha no futura
@ValidatorConstraint({ name: 'isNotFutureDate', async: false })
export class IsNotFutureDateConstraint implements ValidatorConstraintInterface {
  validate(dateString: string, args: ValidationArguments) {
    if (!dateString) return true; // Si no hay fecha, se usa la actual
    
    const inputDate = new Date(dateString);
    const now = new Date();
    
    // Agregar un margen de 1 día para el futuro (por diferencias de zona horaria)
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(23, 59, 59, 999);
    
    return inputDate <= tomorrow;
  }

  defaultMessage(args: ValidationArguments) {
    return 'La fecha de compra no puede ser una fecha futura';
  }
}

// Validador para fecha no muy antigua (máximo 1 año)
@ValidatorConstraint({ name: 'isNotTooOld', async: false })
export class IsNotTooOldConstraint implements ValidatorConstraintInterface {
  validate(dateString: string, args: ValidationArguments) {
    if (!dateString) return true;
    
    const inputDate = new Date(dateString);
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    
    return inputDate >= oneYearAgo;
  }

  defaultMessage(args: ValidationArguments) {
    return 'La fecha de compra no puede ser mayor a 1 año de antigüedad';
  }
}

// Validador para fecha válida
@ValidatorConstraint({ name: 'isValidDate', async: false })
export class IsValidDateConstraint implements ValidatorConstraintInterface {
  validate(dateString: string, args: ValidationArguments) {
    if (!dateString) return true;
    
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  }

  defaultMessage(args: ValidationArguments) {
    return 'La fecha de compra debe ser una fecha válida';
  }
}

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

  @ApiProperty({ required: false, description: 'Fecha de la compra (no puede ser futura ni mayor a 1 año)' })
  @IsOptional()
  @IsString({ message: 'La fecha de compra debe ser una cadena de texto' })
  @Validate(IsValidDateConstraint)
  @Validate(IsNotFutureDateConstraint)
  @Validate(IsNotTooOldConstraint)
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
