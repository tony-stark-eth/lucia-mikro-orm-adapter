import { EntityManager } from '@mikro-orm/core';
import { Session } from './Session.js';
import { User } from './User.js';
import { type Adapter, type UserId } from 'lucia';

export class MikroOrmAdapter implements Adapter {
  entityManager: EntityManager;

  constructor(entityManager: EntityManager) {
    this.entityManager = entityManager;
  }

  async deleteExpiredSessions(): Promise<void> {
    await this.entityManager.nativeDelete(Session, { expiresAt: { $lte: new Date() } });
    this.entityManager.clear();

    return;
  }

  async deleteSession(sessionId: string): Promise<void> {
    const session = await this.entityManager.findOne(Session, { id: sessionId });
    if (session === null) {
      return;
    }
    return this.entityManager.removeAndFlush(session);
  }

  async deleteUserSessions(userId: UserId): Promise<void> {
    await this.entityManager.nativeDelete(Session, { userId: userId });
    this.entityManager.clear();

    return;
  }

  async getSessionAndUser(sessionId: string): Promise<[session: null | Session, user: null | User]> {
    const session = await this.entityManager.findOne(Session, { id: sessionId });
    const user = await this.entityManager.findOne(User, { id: session?.userId });

    return structuredClone([session, user]);
  }

  async getUserSessions(userId: UserId): Promise<Session[]> {
    return structuredClone(await this.entityManager.find(Session, { userId: userId }));
  }

  async setSession(session: Session): Promise<void> {
    const sessionEntity = this.entityManager.create(Session, session);

    return await this.entityManager.persistAndFlush(sessionEntity);
  }

  async updateSessionExpiration(sessionId: string, expiresAt: Date): Promise<void> {
    const session = await this.entityManager.findOne(Session, { id: sessionId });

    if (session === null) {
      return;
    }

    session.expiresAt = expiresAt;

    return await this.entityManager.flush();
  }
}
