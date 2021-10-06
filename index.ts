import dotenv from 'dotenv';
dotenv.config();
import createServer from "./server";

const PORT = process.env.SERVER_PORT || "8080";
const server = createServer();

const start = async () => {
  try {
    await server.listen(+PORT, '127.0.0.1');
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();