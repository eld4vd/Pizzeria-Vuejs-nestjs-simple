import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateProductoIngredienteDto {
  @ApiProperty({ example: 1, description: 'ID del producto' })
  @IsNotEmpty({ message: 'El ID del producto es obligatorio' })
  @IsInt({ message: 'El ID del producto debe ser un número entero' })
  readonly idProducto: number;

  @ApiProperty({ example: 1, description: 'ID del ingrediente' })
  @IsNotEmpty({ message: 'El ID del ingrediente es obligatorio' })
  @IsInt({ message: 'El ID del ingrediente debe ser un número entero' })
  readonly idIngrediente: number;

  @ApiProperty({ example: 200, description: 'Cantidad del ingrediente (en la unidad de medida del ingrediente)' })
  @IsNotEmpty({ message: 'La cantidad es obligatoria' })
  @IsNumber({}, { message: 'La cantidad debe ser un número' })
  @Min(0, { message: 'La cantidad no puede ser negativa' })
  readonly cantidad: number;

  @ApiProperty({ 
    example: 'Extra en la pizza grande', 
    description: 'Notas sobre el ingrediente en el producto',
    required: false 
  })
  @IsOptional()
  @IsString({ message: 'Las notas deben ser texto' })
  readonly notas?: string;
}
