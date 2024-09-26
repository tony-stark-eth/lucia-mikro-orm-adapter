# @tony-stark-eth/lucia-mikro-orm-adapter
[Mikro ORM v6](https://mikro-orm.io/) adapter for [Lucia auth v3 library](https://lucia-auth.com/).

## Installation
```bash
npm i -S @tony-stark-eth/lucia-mikro-orm-adapter
```

## Usage
```js
import { lucia } from "lucia";
import { MikroOrmAdapter, User, Session, OAuthProviderAttributes } from "@tony-stark-eth/lucia-mikro-orm-adapter";

export const orm = await MikroORM.init({
  // register auth entities
  entities: [User, Session, OAuthProviderAttributes],
  // ...
});

export const auth = lucia({
  adapter: MikroOrmAdapter(orm.em),
  // ...
});
```
