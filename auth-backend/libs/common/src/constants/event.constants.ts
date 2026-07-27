export const EVENTS = {
  VERIFICATION_REQUESTED: 'verification.requested',
  VERIFICATION_RESENT: 'verification.resent',
  VERIFICATION_DELIVERED: 'verification.delivered',
  EMAIL_VERIFICATION_REQUESTED: 'verification.email.requested',
  EMAIL_VERIFICATION_RESENT: 'verification.email.resent',
  EMAIL_VERIFICATION_DELIVERED: 'verification.email.delivered',
  EVENT_LOGGED: 'event.logged',
  AUTH_EVENT_LOGGED: 'auth.event.logged',
  SMS_EVENT_LOGGED: 'sms.event.logged',
  EMAIL_EVENT_LOGGED: 'email.event.logged',
} as const;
