import { FastifyPluginCallback } from "fastify";
import { deleteFoo, foo, insertFoo, trxInsert, UpdateFoo } from "./foo";

const handler: FastifyPluginCallback = (server, opts, next) => {

  server.get('/foo/:uid', async (req: any, res) => foo(server, req, res));

  server.post('/foo', async (req: any, res) => insertFoo(server, req, res));

  server.put('/foo', async (req: any, res) => UpdateFoo(server, req, res));

  server.delete('/foo', async (req: any, res) => deleteFoo(server, req, res))

  server.post('/footrx', async (req: any, res) => trxInsert(server, req, res));
  next();
}

export default handler;