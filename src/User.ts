import type { DatabaseUser } from 'lucia/dist/database';

import { OAuthProviderAttributes } from './embeddable/OAuthProviderAttributes';
import { Embedded, Entity, PrimaryKey, Property, types } from '@mikro-orm/core';
import { v4 } from 'uuid';

@Entity()
export class User implements DatabaseUser {
  @Embedded(() => OAuthProviderAttributes)
  attributes: OAuthProviderAttributes;

  @Property()
  createdAt = new Date();

  @PrimaryKey({ type: types.uuid })
  id: string = v4();

  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date();

  constructor(attributes: OAuthProviderAttributes) {
    this.attributes = attributes;
  }
}
