import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateProveedorDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @IsString({ message: 'El nombre debe ser texto' })
  @MaxLength(150, { message: 'El nombre no debe exceder 150 caracteres' })
  readonly nombre: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString({ message: 'La empresa debe ser texto' })
  @MaxLength(200, { message: 'La empresa no debe exceder 200 caracteres' })
  readonly empresa?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString({ message: 'El teléfono debe ser texto' })
  @MaxLength(20, { message: 'El teléfono no debe exceder 20 caracteres' })
  readonly telefono?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEmail({}, { message: 'El email debe ser válido' })
  @MaxLength(100, { message: 'El email no debe exceder 100 caracteres' })
  readonly email?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString({ message: 'La dirección debe ser texto' })
  readonly direccion?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString({ message: 'La ciudad debe ser texto' })
  @MaxLength(50, { message: 'La ciudad no debe exceder 50 caracteres' })
  readonly ciudad?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString({ message: 'El NIT debe ser texto' })
  @MaxLength(20, { message: 'El NIT no debe exceder 20 caracteres' })
  readonly nit?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString({ message: 'Las notas deben ser texto' })
  readonly notas?: string;

  @ApiProperty({ required: false, default: true })
  @IsOptional()
  @IsBoolean({ message: 'Activo debe ser verdadero o falso' })
  readonly activo?: boolean;
}
