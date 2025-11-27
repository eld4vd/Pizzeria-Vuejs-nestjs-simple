import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class CreateTamañoDto {
  @IsNotEmpty({ message: 'El campo nombre no debe ser vacío' })
  @IsString({ message: 'El campo nombre debe ser de tipo cadena' })
  @MaxLength(50, { message: 'El campo nombre no debe ser mayor a 50 caracteres' })
  readonly nombre: string;

  @IsOptional()
  @IsString({ message: 'El campo dimension debe ser de tipo cadena' })
  @MaxLength(50, { message: 'El campo dimension no debe ser mayor a 50 caracteres' })
  readonly dimension?: string;

  @IsOptional()
  @IsNumber({}, { message: 'El campo multiplicadorPrecio debe ser de tipo numérico' })
  @Min(0, { message: 'El campo multiplicadorPrecio no debe ser menor a 0' })
  readonly multiplicadorPrecio?: number;

  @IsOptional()
  @IsBoolean({ message: 'El campo activo debe ser de tipo booleano' })
  readonly activo?: boolean;
}
