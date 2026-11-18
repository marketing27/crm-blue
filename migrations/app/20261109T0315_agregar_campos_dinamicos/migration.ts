#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/6d2fb33f9b6c2e27bd1d0cbde94783caa38846d0d49238f03aca88e52882f1ae/contract';
import startContract from '../../snapshots/6d2fb33f9b6c2e27bd1d0cbde94783caa38846d0d49238f03aca88e52882f1ae/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/73413f19e92fd7e4467e5b42b53546e9c96f281fac08660948386192643db488/contract';
import endContract from '../../snapshots/73413f19e92fd7e4467e5b42b53546e9c96f281fac08660948386192643db488/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.addColumn({
        schema: 'public',
        table: 'companion',
        column: col('datos_adicionales', 'json', { codecRef: { codecId: 'pg/json@1' } }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'lead',
        column: col('datos_adicionales', 'json', { codecRef: { codecId: 'pg/json@1' } }),
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
