import fastify from "fastify";
import { logger } from "./loggers";
export async function buildServer() {
    const app = fastify({
        logger,
    })

    // register plugins

    // register routes

    return app
}