const REQUIRED_ENV_VARS = [
    "DATABASE_URL",
    "JWT_SECRET",
    "SMTP_HOST",
    "SMTP_PORT",
    "SMTP_USER",
    "SMTP_PASS",
    "EMAIL_FROM",
] as const;

const missing = REQUIRED_ENV_VARS.filter((key) => !process.env[key]);
if (missing.length > 0) {
    throw new Error(`Variáveis de ambiente obrigatórias não definidas: ${missing.join(", ")}`);
}

export const env = {
    DATABASE_URL: process.env.DATABASE_URL as string,
    JWT_SECRET: process.env.JWT_SECRET as string,
    SMTP_HOST: process.env.SMTP_HOST as string,
    SMTP_PORT: Number(process.env.SMTP_PORT),
    SMTP_USER: process.env.SMTP_USER as string,
    SMTP_PASS: process.env.SMTP_PASS as string,
    EMAIL_FROM: process.env.EMAIL_FROM as string,
    EXPO_ACCESS_TOKEN: process.env.EXPO_ACCESS_TOKEN,
    PORT: Number(process.env.PORT) || 3000,
    NODE_ENV: process.env.NODE_ENV ?? "development",
};
