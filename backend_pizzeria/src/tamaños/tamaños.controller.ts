import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TamañosService } from './tamaños.service';
import { CreateTamañoDto } from './dto/create-tamaño.dto';
import { UpdateTamañoDto } from './dto/update-tamaño.dto';
import { Public } from 'src/auth/decorators/auth-public.decorator';

@Controller('tamanos')
export class TamañosController {
  constructor(private readonly tamañosService: TamañosService) {}

  @Post()
  create(@Body() createTamañoDto: CreateTamañoDto) {
    return this.tamañosService.create(createTamañoDto);
  }

  @Public()
  @Get()
  findAll() {
    return this.tamañosService.findAll();
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tamañosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTamañoDto: UpdateTamañoDto) {
    return this.tamañosService.update(+id, updateTamañoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tamañosService.remove(+id);
  }
}
