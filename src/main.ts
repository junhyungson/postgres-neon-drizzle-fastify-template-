import { migrate } from 'drizzle-orm/node-postgres/migrator'
import { buildServer } from "./utils/server"
import { logger } from './utils/loggers';
import { env } from "./config/env";
import { db } from './db';

async function gracefulShutdown({ app }: {
  app: Awaited<ReturnType<typeof buildServer>>
}) {
  await app.close()
}



async function main() {

  const app = await buildServer();

  await app.listen({
    port: env.PORT,
    host: env.HOST
  })

  await migrate(db, {
    migrationsFolder: "./migrations",
  });

  logger.debug(env, "using env") // make sure to set level logger to debug

  // console.log(`server is running`) we use logger isntead of console log
  // logger.info("Server is running at http://localhost:3000")
  // we no longer need default fastify logger = true as we are using pino as our logger

  const signals = ["SIGINT", "SIGTERM"];

  // logger.debug(env, "using env");

  for (const signal of signals) {
    process.on(signal, async () => {
      console.log('Received signal:', signal);
      logger.info(`Received ${signal} signal. Shutting down gracefully...`); // not working
      await gracefulShutdown({ app });
      process.exit(0); // Optional: Terminate the process after shutdown
    });
  }
}

main().catch((error) => {
  logger.error('An error occurred:', error);
  process.exit(1);
});