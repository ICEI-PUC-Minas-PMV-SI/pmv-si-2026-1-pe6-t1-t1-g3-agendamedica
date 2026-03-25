const timestamp = () => new Date().toISOString();

export const logger = {
    info: (message: string, meta?: unknown) => {
        console.log(
            JSON.stringify({
                level: "info",
                ts: timestamp(),
                message,
                ...(meta ? { meta } : {}),
            }),
        );
    },
    warn: (message: string, meta?: unknown) => {
        console.warn(
            JSON.stringify({
                level: "warn",
                ts: timestamp(),
                message,
                ...(meta ? { meta } : {}),
            }),
        );
    },
    error: (message: string, meta?: unknown) => {
        console.error(
            JSON.stringify({
                level: "error",
                ts: timestamp(),
                message,
                ...(meta ? { meta } : {}),
            }),
        );
    },
};
