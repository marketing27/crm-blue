import { Module } from '@nestjs/common';
import { ApiKeysService } from './api-keys.service.js';
import { ApiKeysController } from './api-keys.controller.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [ PrismaModule ],
  providers: [ ApiKeysService ],
  controllers: [ ApiKeysController ],
  exports: [ ApiKeysService ]
})
export class ApiKeysModule {}
