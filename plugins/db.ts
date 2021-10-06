import fp from 'fastify-plugin';
import { Knex, knex } from 'knex';

export default fp(async server => {
  try {
    const config: Knex.Config = {
      client: 'mysql2',
      connection: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: Number(process.env.DB_PORT),
      },
    };
    const kenxInstace = knex(config);
    server.decorate('knex', kenxInstace);
  } catch (err) {
    server.log.error(err);
  }
});