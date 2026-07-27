import { createHmac } from 'crypto';

export function verifyHmacSignature(
  body: string | Buffer,
  signature: string,
  secret: string,
): boolean {
  const expectedSignature = createHmac('sha256', secret)
    .update(body)
    .digest('hex');
  return signature === expectedSignature;
}

export function generateHmacSignature(
  body: string | Buffer,
  secret: string,
): string {
  return createHmac('sha256', secret).update(body).digest('hex');
}
