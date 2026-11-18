import { Controller, Post, Body, Get } from '@nestjs/common';
import { TenantService } from './tenant.service.js';
import { CreateTenantDto } from './dto/create-tenant.dto.js';

@Controller('tenants')
export class TenantController {
  constructor(private readonly tenantService: TenantService) {}

  @Post()
  create(@Body() createTenantDto: CreateTenantDto) {
    return this.tenantService.createTenant(createTenantDto);
  }

  @Get()
  findAll() {
    return this.tenantService.findAllTenants();
  }
}