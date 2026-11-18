import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ApiKeysService } from './api-keys.service.js';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private apiKeysService: ApiKeysService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const apiKeyHeader = request.headers['x-api-key'];

    if (!apiKeyHeader) {
      throw new UnauthorizedException('API Key no proporcionada en los headers');
    }

    const validKey = await this.apiKeysService.validateKey(apiKeyHeader);

    if (!validKey || !validKey.status) {
      throw new UnauthorizedException('API Key inválida o inactiva');
    }

    // MATCH DE ALLOWED IPS
    if (validKey.allowed_ips && validKey.allowed_ips.length > 0) {
      // Extraemos la IP (soporte para proxies/balanceadores como Nginx o Cloudflare)
      const forwardedIps = request.headers['x-forwarded-for'];
      const incomingIp = forwardedIps ? forwardedIps.split(',')[0].trim() : request.ip;

      if (!validKey.allowed_ips.includes(incomingIp)) {
        throw new UnauthorizedException(`Acceso denegado: La IP ${incomingIp} no está autorizada para usar esta llave.`);
      }
    }

    request.tenantId = validKey.tenant_id;

    return true;
  }
}