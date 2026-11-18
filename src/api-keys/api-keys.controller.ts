import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiKeysService } from './api-keys.service.js';
import { ApiKeyGuard } from './api-keys.guard.js';

@Controller('api-keys')
export class ApiKeysController {
  constructor(private readonly apiKeysService: ApiKeysService) {}

    @Post('generate')
    @UseGuards(ApiKeyGuard)
    generate(@Body() body: { tenant_id: number; allowed_ips?: string[] }) {
        return this.apiKeysService.generateKeyForTenant(body.tenant_id, body.allowed_ips || []);
    }
}