import { AUTH_CONSTANTS } from '../constants';

export function generateOtp(length = AUTH_CONSTANTS.OTP_LENGTH): string {
  let otp = '';
  for (let i = 0; i < length; i++) {
    otp += Math.floor(Math.random() * 10).toString();
  }
  return otp;
}

export function isOtpExpired(expiresAt: Date): boolean {
  return new Date() > expiresAt;
}
