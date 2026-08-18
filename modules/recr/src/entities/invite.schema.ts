import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  index,
  uniqueIndex,
} from 'drizzle-orm/pg-core';

export const recrInvitations = pgTable(
  'recr_invitations',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    email: varchar('email', { length: 255 }).notNull(),
    tokenHash: varchar('token_hash', { length: 64 }).notNull(),
    role: varchar('role', { length: 50 }).notNull(),
    inviterId: uuid('inviter_id').notNull(),
    employerId: uuid('employer_id'),
    status: varchar('status', { length: 20 }).notNull().default('PENDING'),
    expiredAt: timestamp('expired_at').notNull(),
    acceptedAt: timestamp('accepted_at'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex('idx_recr_invitations_token_hash').on(table.tokenHash),
    index('idx_recr_invitations_email').on(table.email),
    index('idx_recr_invitations_inviter_id').on(table.inviterId),
    index('idx_recr_invitations_status').on(table.status),
    index('idx_recr_invitations_employer_id').on(table.employerId),
  ],
);

export type RecrInvitation = typeof recrInvitations.$inferSelect;
export type NewRecrInvitation = typeof recrInvitations.$inferInsert;
