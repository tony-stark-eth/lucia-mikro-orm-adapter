import type { DatabaseSession } from 'lucia/dist/database';

import { Entity, PrimaryKey, Property, types } from '@mikro-orm/core';
import { v4 } from 'uuid';

@Entity()
export class Session implements DatabaseSession {
  @Property({ type: types.json })
  attributes: { [key: string]: null | number | string };

  @Property()
  createdAt = new Date();

  @Property({ type: types.datetime })
  expiresAt: Date;

  @PrimaryKey({ type: types.uuid })
  id: string = v4();

  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date();

  @Property({ type: types.uuid })
  userId: string;

  constructor(userId: string, expiresAt: Date, attributes: { [key: string]: null | number | string }) {
    this.userId = userId;
    this.expiresAt = expiresAt;
    this.attributes = attributes;
  }
}
