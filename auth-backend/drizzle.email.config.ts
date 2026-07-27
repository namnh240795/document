import type { Config } from 'drizzle-kit';

// For email_db
export default {
  schema: './libs/database/src/email/schema.ts',
  out: './libs/database/src/email/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.EMAIL_DB_URL || 'postgresql://postgres:postgres@localhost:5434/email_db',
  },
} satisfies Config;
