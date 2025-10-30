import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class AuthLoginDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'El campo Email no debe ser vacío' })
  @IsString({ message: 'El campo Email debe ser de tipo cadena' })
  @MaxLength(100, { message: 'El campo Email excede los 100 caracteres' })
  email: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'El campo Contraseña no debe ser vacío' })
  @IsString({ message: 'El campo Contraseña debe ser de tipo cadena' })
  password: string;
}
