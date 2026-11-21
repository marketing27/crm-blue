import { Controller, Post, Get, Body, Req, UseGuards, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { LeadsService } from './leads.service.js';
import { CreateLeadDto } from './dto/create-lead.dto.js';
import { ApiKeyGuard } from '../api-keys/api-keys.guard.js';
import { AuthGuard } from '@nestjs/passport';

@Controller('leads')
export class LeadsController {
    constructor(private readonly leadsService: LeadsService) {}

    @Post()
    @UseGuards(ApiKeyGuard) 
    create(@Req() request:any, @Body() createLeadDto: CreateLeadDto) {
        // request.tenantId fue inyectado de forma segura por el ApiKeyGuard
        return this.leadsService.createLead(request.tenantId, createLeadDto);
    }

    @Get()
    @UseGuards(AuthGuard('jwt'))
    findAll(@Req() request:any) {
        return this.leadsService.getLeadsByTenant(request.user.tenantId);
    }

    @Delete(':id')
    @UseGuards(AuthGuard('jwt'))
    remove(@Req() request: any, @Param('id', ParseIntPipe) id: number) {
        return this.leadsService.deleteLead(request.user.tenantId, id);
    }

}