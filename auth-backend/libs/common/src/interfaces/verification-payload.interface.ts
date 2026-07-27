export interface VerificationPayload {
  user_id: string;
  phone: string;
  channel: 'sms' | 'email';
  otp: string;
  verification_id: string;
}

export interface EmailVerificationPayload {
  user_id: string;
  email: string;
  channel: 'email';
  otp: string;
  verification_id: string;
}
