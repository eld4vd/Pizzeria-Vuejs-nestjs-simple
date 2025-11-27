import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { EmpleadosService } from 'src/empleados/empleados.service';
import { AuthLoginDto } from './dto/auth-login.dto';
import { AuthRegisterDto } from './dto/auth-register.dto';
import { AuthRegisterClienteDto } from './dto/auth-register-cliente.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { Empleado } from 'src/empleados/entities/empleado.entity';

@Injectable()
export class AuthService {
  constructor(
    private empleadosService: EmpleadosService,
    private jwtService: JwtService,
  ) {}

  async login(authLoginDto: AuthLoginDto): Promise<any> {
    const { usuario, clave } = authLoginDto;
    const empleado = await this.empleadosService.validate(usuario, clave);

    // Verificar si está activo
    if (!empleado.activo) {
      throw new UnauthorizedException('Usuario desactivado. Contacte al administrador.');
    }

    const payload: JwtPayload = { sub: empleado.id };
    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
      empleado: {
        id: empleado.id,
        usuario: empleado.usuario,
        nombre: empleado.nombre,
        email: empleado.email,
        telefono: empleado.telefono,
        rol: empleado.rol,
      },
    };
  }

  async register(authRegisterDto: AuthRegisterDto): Promise<any> {
    const { usuario, clave, nombres, primerApellido, segundoApellido, email, telefono, direccion } = authRegisterDto;

    // Verificar si el usuario ya existe
    const usuarioExiste = await this.empleadosService.findByUsuario(usuario);
    if (usuarioExiste) {
      throw new ConflictException('El nombre de usuario ya está en uso');
    }

    // Construir nombre completo
    const nombreCompleto = segundoApellido 
      ? `${nombres} ${primerApellido} ${segundoApellido}`
      : `${nombres} ${primerApellido}`;

    // Crear el empleado con rol admin
    const nuevoEmpleado = await this.empleadosService.create({
      usuario: usuario.trim(),
      clave,
      nombre: nombreCompleto.trim(),
      email: email?.trim() || 'admin@default.com',
      telefono: telefono?.trim(),
      rol: 'admin',
      activo: true,
    });

    return {
      message: 'Administrador registrado exitosamente',
      empleado: {
        id: nuevoEmpleado.id,
        usuario: nuevoEmpleado.usuario,
        nombre: nuevoEmpleado.nombre,
        email: nuevoEmpleado.email,
        rol: nuevoEmpleado.rol,
      },
    };
  }

  async registerCliente(authRegisterClienteDto: AuthRegisterClienteDto): Promise<any> {
    const { usuario, clave, nombre, email, telefono, direccion } = authRegisterClienteDto;

    // Verificar si el usuario ya existe
    const usuarioExiste = await this.empleadosService.findByUsuario(usuario);
    if (usuarioExiste) {
      throw new ConflictException('El nombre de usuario ya está en uso');
    }

    // Verificar si el email ya existe
    const emailExiste = await this.empleadosService.findByEmail(email);
    if (emailExiste) {
      throw new ConflictException('El email ya está registrado');
    }

    // Verificar si el teléfono ya existe
    const telefonoExiste = await this.empleadosService.findByTelefono(telefono);
    if (telefonoExiste) {
      throw new ConflictException('El teléfono ya está registrado');
    }

    // Crear el cliente
    const nuevoCliente = await this.empleadosService.create({
      usuario: usuario.trim(),
      clave,
      nombre: nombre.trim(),
      email: email.trim(),
      telefono: telefono.trim(),
      rol: 'cliente',
      activo: true,
    });

    // Generar token automáticamente para el cliente
    const payload: JwtPayload = { sub: nuevoCliente.id };
    const access_token = this.jwtService.sign(payload);

    return {
      message: 'Registro exitoso. ¡Bienvenido!',
      access_token,
      cliente: {
        id: nuevoCliente.id,
        usuario: nuevoCliente.usuario,
        nombre: nuevoCliente.nombre,
        email: nuevoCliente.email,
        telefono: nuevoCliente.telefono,
        rol: nuevoCliente.rol,
      },
    };
  }

  async verifyPayload(payload: JwtPayload): Promise<Empleado> {
    let empleado: Empleado;

    try {
      empleado = await this.empleadosService.findOne(payload.sub);
    } catch {
      throw new UnauthorizedException(`Empleado inválido: ${payload.sub}`);
    }

    return empleado;
  }
}
