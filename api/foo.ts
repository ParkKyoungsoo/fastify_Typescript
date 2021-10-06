import { resolveCaa } from "dns";
import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { userInfo } from "os";

interface IFoo {
  Params: {
    uid: number;
  }
}

interface Users {
  uid: number;
  user_name: string;
}

export async function foo(
  server: FastifyInstance,
  req: FastifyRequest<IFoo>,
  res: FastifyReply
): Promise<void> {

  const { uid } = req.params;

  console.log(server.knex<Users>('users').column('user_name').select()
    .modify(query => {
      if (uid !== null) {
        query.where('uid', uid)
      }
    }).toString());

  server.knex<Users>('users').column('user_name').select()
    .modify(query => {
      if (uid.toString() !== '') {
        query.where('uid', uid)
      }
    })
    .then(result => {
      res.code(200).send({
        result: "OK",
        data: result,
      })
    }).catch(error => {
      res.code(400).send({
        result: "Error",
        data: error
      })
    })
}

interface IInsertFoo {
  Body: {
    data: Array<Users>;
  }
}

export async function insertFoo(
  server: FastifyInstance,
  req: FastifyRequest<IInsertFoo>,
  res: FastifyReply
): Promise<void> {

  let { data } = req.body;
  let userData = data.map(data => (
    {
      user_name: data.user_name,
    }
  ))

  server.knex<Users>('users').insert(userData)
    .then(result => {
      console.log(result);
      res.code(200).send({
        result: "OK",
        data: result,
      })
    }).catch(error => {
      console.log(error);
      res.code(400).send({
        result: "Error",
        data: error
      });
    });
}

interface IUpdateFoo {
  Body: {
    data: Users;
  }
}

export async function UpdateFoo(
  server: FastifyInstance,
  req: FastifyRequest<IUpdateFoo>,
  res: FastifyReply
): Promise<void> {
  await server.knex<Users>('users').update({
    'user_name': req.body.data.user_name,
  }).where('uid', req.body.data.uid)
    .then(result => {
      res.code(200).send({
        result: "OK",
        data: result
      })
    }).catch(error => {
      console.log(error);
      res.code(400).send({
        result: "Error",
        data: error,
      })
    })
}


interface IDeleteFoo {
  Body: {
    data: Users;
  }
}

export async function deleteFoo(
  server: FastifyInstance,
  req: FastifyRequest<IDeleteFoo>,
  res: FastifyReply
): Promise<void> {
  server.knex<Users>('users').del()
    .where('uid', req.body.data.uid)
    .then(result => {
      res.code(200).send({
        result: "OK",
        data: result,
      })
    }).catch(error => {
      res.code(400).send({
        result: "Error",
        data: error
      })
    })
}

interface Students {
  sid: number;
  student_name: string;
}


interface ITrxInsert {
  Body: {
    user: Users,
    student: Students
  }
}

export async function trxInsert(
  server: FastifyInstance,
  req: FastifyRequest<ITrxInsert>,
  res: FastifyReply
): Promise<void> {

  const trx = await server.knex.transaction();

  try {
    await trx('users').insert({ user_name: req.body.user.user_name });
    await trx('students').insert(req.body.student);
    await trx.commit();
    res.code(200).send({
      result: "OK"
    })
  } catch (err) {
    await trx.rollback(err);
    res.code(400).send({
      result: "Error",
      data: err,
    })
  }
}
