import fastify, { FastifyInstance } from "fastify";
import { Knex } from "knex";
import api from './api/routes';
import db from './plugins/db';

declare module 'fastify' {
  export interface FastifyInstance {
    knex: Knex;
  }
}

function createServer(): FastifyInstance {
  const server = fastify({ logger: { prettyPrint: true } });

  server.register(db);
  server.register(api);

  return server;
}

export default createServer;