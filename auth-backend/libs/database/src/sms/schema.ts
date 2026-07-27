import { pgTable, uuid, varchar, text, integer, timestamp } from 'drizzle-orm/pg-core';

export const smsLogs = pgTable('sms_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id'),
  phone: varchar('phone', { length: 20 }).notNull(),
  message: text('message').notNull(),
  otpCode: varchar('otp_code', { length: 10 }),
  status: varchar('status', { length: 20 }).default('pending').notNull(),
  provider: varchar('provider', { length: 50 }),
  providerMessageId: varchar('provider_message_id', { length: 255 }),
  errorMessage: text('error_message'),
  retryCount: integer('retry_count').default(0).notNull(),
  expiresAt: timestamp('expires_at'),
  sentAt: timestamp('sent_at'),
  deliveredAt: timestamp('delivered_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
