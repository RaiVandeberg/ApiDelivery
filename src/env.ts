import { z } from "zod";
import dotenv from "dotenv";

dotenv.config(); // Carrega as variáveis do .env

const envSchema = z.object({
    DATABASE_URL: z.string().url(),
    JWT_SECRET: z.string()
});

export const env = envSchema.parse(process.env);