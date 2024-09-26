import { Embeddable, Property, types } from '@mikro-orm/core';

@Embeddable()
export class OAuthProviderAttributes {
  @Property({ type: types.string })
  providerId: string;

  @Property({ type: types.string })
  providerUserId: string;

  constructor(providerId: string, providerUserId: string) {
    this.providerId = providerId;
    this.providerUserId = providerUserId;
  }
}
