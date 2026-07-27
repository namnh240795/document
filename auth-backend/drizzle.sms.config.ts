import type { Config } from 'drizzle-kit';

// For sms_db
export default {
  schema: './libs/database/src/sms/schema.ts',
  out: './libs/database/src/sms/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.SMS_DB_URL || 'postgresql://postgres:postgres@localhost:5433/sms_db',
  },
} satisfies Config;
