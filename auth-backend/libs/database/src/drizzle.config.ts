import type { Config } from 'drizzle-kit';

// For auth_db
export default {
  schema: './libs/database/src/auth/schema.ts',
  out: './libs/database/src/auth/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.AUTH_DB_URL || 'postgresql://postgres:postgres@localhost:5432/auth_db',
  },
} satisfies Config;
