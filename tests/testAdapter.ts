import { Adapter, DatabaseSession, DatabaseUser } from 'lucia';
import assert from 'node:assert';
import { v4 } from 'uuid';
import console from 'node:console';

export const databaseUser: DatabaseUser = {
  id: v4(),
  attributes: {
    providerId: 'test-provider',
    providerUserId: 'test-provider-user',
  },
};

export async function testAdapter(adapter: Adapter) {
  console.log(`\n\x1B[38;5;63;1m[start]  \x1B[0mRunning adapter tests\x1B[0m\n`);
  const databaseSession: DatabaseSession = {
    userId: databaseUser.id,
    id: v4(),
    // get random date with 0ms
    expiresAt: new Date(Math.floor(Date.now() / 1000) * 1000 + 10_000),
    attributes: {
      country: 'us',
    },
  };

  await test('getSessionAndUser() returns [null, null] on invalid session id', async () => {
    const result = await adapter.getSessionAndUser(databaseSession.id);
    assert.deepStrictEqual(result, [null, null]);
  });

  await test('getUserSessions() returns empty array on invalid user id', async () => {
    const result = await adapter.getUserSessions(databaseUser.id);
    assert.deepStrictEqual(result, []);
  });

  await test('setSession() creates session and getSessionAndUser() returns created session and associated user', async () => {
    await adapter.setSession(databaseSession);
    const [adapterSession] = await adapter.getSessionAndUser(databaseSession.id);

    assert.equal(adapterSession.id, databaseSession.id);
    assert.equal(adapterSession.userId, databaseSession.userId);
    assert.equal(adapterSession.expiresAt.valueOf(), databaseSession.expiresAt.valueOf());
    assert.equal(adapterSession.attributes.country, databaseSession.attributes.country);
  });

  await test('deleteSession() deletes session', async () => {
    await adapter.deleteSession(databaseSession.id);
    const result = await adapter.getUserSessions(databaseSession.userId);
    assert.deepStrictEqual(result, []);
  });

  await test('updateSessionExpiration() updates session', async () => {
    await adapter.setSession(databaseSession);
    databaseSession.expiresAt = new Date(databaseSession.expiresAt.getTime() + 10_000);
    await adapter.updateSessionExpiration(databaseSession.id, databaseSession.expiresAt);
    const [adapterSession] = await adapter.getSessionAndUser(databaseSession.id);

    assert.equal(adapterSession.id, databaseSession.id);
    assert.equal(adapterSession.expiresAt.valueOf(), databaseSession.expiresAt.valueOf());
  });

  await test('deleteExpiredSessions() deletes all expired sessions', async () => {
    const expiredSession: DatabaseSession = {
      userId: databaseUser.id,
      id: v4(),
      expiresAt: new Date(Math.floor(Date.now() / 1000) * 1000 - 10_000),
      attributes: {
        country: 'us',
      },
    };
    await adapter.setSession(expiredSession);
    await adapter.deleteExpiredSessions();
    const [adapterSession] = await adapter.getUserSessions(databaseSession.userId);

    assert.equal(adapterSession.id, databaseSession.id);
  });

  await test('deleteUserSessions() deletes all user sessions', async () => {
    await adapter.deleteUserSessions(databaseSession.userId);
    const result = await adapter.getUserSessions(databaseSession.userId);
    assert.deepStrictEqual(result, []);
  });

  console.log(`\n\x1B[32;1m[success]  \x1B[0mAdapter passed all tests\n`);
}

async function test(name: string, runTest: () => Promise<void>): Promise<void> {
  console.log(`\x1B[38;5;63;1m► \x1B[0m${name}\x1B[0m`);
  try {
    await runTest();
    console.log('  \x1B[32m✓ Passed\x1B[0m\n');
  }
  catch (error) {
    console.log('  \x1B[31m✓ Failed\x1B[0m\n');
    throw error;
  }
}
