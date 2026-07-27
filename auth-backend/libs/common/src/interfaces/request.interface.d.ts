export interface JwtPayload {
    sub: string;
    email?: string;
    phone?: string;
    role: string;
    roles: string[];
    iat: number;
    exp: number;
}
export interface AuthRequest {
    user: JwtPayload;
    ip: string;
    headers: {
        'user-agent'?: string;
        'content-type'?: string;
        'origin'?: string;
        'authorization'?: string;
    };
}
export interface SmsLog {
    id: string;
    userId?: string | null;
    phone: string;
    message: string;
    otpCode?: string;
    status: 'pending' | 'sent' | 'delivered' | 'failed';
    provider?: string;
    providerMessageId?: string | null;
    errorMessage?: string | null;
    retryCount: number;
    expiresAt?: Date;
    sentAt?: Date | null;
    deliveredAt?: Date | null;
    createdAt: Date;
}
export interface EmailLog {
    id: string;
    userId?: string;
    email: string;
    subject?: string;
    templateId?: string;
    status: 'pending' | 'sent' | 'delivered' | 'failed';
    provider?: string;
    providerMessageId?: string | null;
    errorMessage?: string | null;
    retryCount: number;
    metadata?: Record<string, unknown>;
    sentAt?: Date | null;
    deliveredAt?: Date | null;
    createdAt: Date;
}
