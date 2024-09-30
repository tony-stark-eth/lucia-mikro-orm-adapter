import { MikroORM } from '@mikro-orm/postgresql';
import process from 'node:process';

const ORM = await MikroORM.init({
  entities: ['./src'],
  dbName: process.env.DATABASE_NAME || 'lucia',
  user: process.env.DATABASE_USER || 'lucia',
  password: process.env.DATABASE_PASSWORD || 'lucia',
  schema: process.env.DATABASE_NAME || 'lucia',
});

await ORM.schema.refreshDatabase({ dropDb: true });

export { ORM };
