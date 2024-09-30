declare const ORM: import('@mikro-orm/core').MikroORM<import('@mikro-orm/postgresql').PostgreSqlDriver, import('@mikro-orm/postgresql').EntityManager<import('@mikro-orm/postgresql').PostgreSqlDriver> & import('@mikro-orm/core').EntityManager<import('@mikro-orm/postgresql').IDatabaseDriver<import('@mikro-orm/postgresql').Connection>>>;
export { ORM };
