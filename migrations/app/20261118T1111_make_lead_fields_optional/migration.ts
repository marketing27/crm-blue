#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/00b93daece936d338393b453b056a133a5b5f9e3c8dc28986665061c37c26a59/contract';
import endContract from '../../snapshots/00b93daece936d338393b453b056a133a5b5f9e3c8dc28986665061c37c26a59/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/eb2138ff43b66c8e9293be0720fa7ef3f575e973c59a31a5c31f4f3da87f0fbd/contract';
import startContract from '../../snapshots/eb2138ff43b66c8e9293be0720fa7ef3f575e973c59a31a5c31f4f3da87f0fbd/contract.json' with { type: 'json' };
import { Migration, MigrationCLI } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.dropNotNull({ schema: 'public', table: 'lead', column: 'apellido_paterno' }),
      this.dropNotNull({ schema: 'public', table: 'lead', column: 'numero_documento' }),
      this.dropNotNull({ schema: 'public', table: 'lead', column: 'tipo_documento' }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
