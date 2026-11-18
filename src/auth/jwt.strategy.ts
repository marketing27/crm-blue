import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET ?? 'CRM_BLUE_SECRET_MVP_2026', // En prod irá a un .env
    });
  }

  // Si el token es válido, desencripta estos datos y los inyecta en "req.user"
  async validate(payload: any) {
    return { 
      userId: payload.sub, 
      email: payload.email, 
      tenantId: payload.tenantId, 
      roleId: payload.roleId 
    };
  }
}