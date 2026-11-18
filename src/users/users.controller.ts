import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service.js';
import { CreateUsersDto } from './dto/create-user.dto.js';
import { CurrentUser } from '../auth/current-user.decorator.js';

@Controller('users')
@UseGuards(AuthGuard('jwt')) // <--- Protege todas las rutas de este controlador
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUsersDto, @CurrentUser() user: any) {
    // Delegamos la creación al servicio pasando el DTO validado
    // y el tenantId seguro que viene dentro del Token JWT.
    return this.usersService.createEmployee(createUserDto, user.tenantId);
  }

  @Get()
  findAll(@CurrentUser() user: any) {
    // El administrador solo verá los usuarios de su propia agencia.
    return this.usersService.getEmployeesByTenant(user.tenantId);
  }
}