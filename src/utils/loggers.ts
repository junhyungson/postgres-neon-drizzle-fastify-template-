import pino from 'pino';

export const logger = pino({
    redact: ["DATABASE_CONNECTION"], // DONT SHOW THIS 
    level: "debug",
    transport: {
        target: 'pino-pretty'
    }
})