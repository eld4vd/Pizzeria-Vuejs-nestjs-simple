import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthLoginDto } from './dto/auth-login.dto';
import { AuthRegisterDto } from './dto/auth-register.dto';
import { AuthRegisterClienteDto } from './dto/auth-register-cliente.dto';
import { Public } from './decorators/auth-public.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Iniciar sesión (Admin, Empleado o Cliente)' })
  @ApiResponse({ status: 200, description: 'Login exitoso' })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas' })
  async login(@Body() authLoginDto: AuthLoginDto): Promise<any> {
    return this.authService.login(authLoginDto);
  }

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Registrar administrador' })
  @ApiResponse({ status: 201, description: 'Admin registrado exitosamente' })
  async register(@Body() authRegisterDto: AuthRegisterDto): Promise<any> {
    return this.authService.register(authRegisterDto);
  }

  @Public()
  @Post('register/cliente')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Registrar cliente' })
  @ApiResponse({ status: 201, description: 'Cliente registrado exitosamente' })
  @ApiResponse({ status: 409, description: 'Usuario, email o teléfono ya registrado' })
  async registerCliente(@Body() authRegisterClienteDto: AuthRegisterClienteDto): Promise<any> {
    return this.authService.registerCliente(authRegisterClienteDto);
  }
}
