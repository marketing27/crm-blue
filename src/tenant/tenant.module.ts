import { Module } from '@nestjs/common';
import { TenantService } from './tenant.service.js';
import { TenantController } from './tenant.controller.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [ PrismaModule ],
  providers: [ TenantService ],
  controllers: [ TenantController ]
})
export class TenantModule {}
