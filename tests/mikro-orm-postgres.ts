// Use MikroORM for testing MikroORM Adapter
import { ORM } from './db';
import { User } from '../src';
import { testAdapter, databaseUser } from './testAdapter';
import { MikroOrmAdapter } from '../src';
import process from 'node:process';

const entityManager = ORM.em.fork();

const user = new User({ providerId: 'test-provider', providerUserId: 'test-provider-user' });
const entity = entityManager.create(User, user);
entity.id = databaseUser.id;

await entityManager.persistAndFlush(user);
entityManager.clear();

const adapter = new MikroOrmAdapter(entityManager);

await testAdapter(adapter);

process.exit();
