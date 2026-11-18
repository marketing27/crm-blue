#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/73413f19e92fd7e4467e5b42b53546e9c96f281fac08660948386192643db488/contract';
import startContract from '../../snapshots/73413f19e92fd7e4467e5b42b53546e9c96f281fac08660948386192643db488/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/eb2138ff43b66c8e9293be0720fa7ef3f575e973c59a31a5c31f4f3da87f0fbd/contract';
import endContract from '../../snapshots/eb2138ff43b66c8e9293be0720fa7ef3f575e973c59a31a5c31f4f3da87f0fbd/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, sql } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.addColumnWithTemporaryDefault({
        schema: 'public',
        table: 'user',
        column: 'password',
        type: 'text',
        temporaryDefault: sql`''`,
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
