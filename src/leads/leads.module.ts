import { Module } from '@nestjs/common';
import { LeadsService } from './leads.service.js';
import { LeadsController } from './leads.controller.js';
import { ApiKeysModule } from '../api-keys/api-keys.module.js';

@Module({
  providers: [ LeadsService ],
  controllers: [ LeadsController ],
  imports: [ ApiKeysModule ],
})
export class LeadsModule {}
