export interface LogEvent {
    eventId: string;
    source: string;
    level: 'debug' | 'info' | 'warn' | 'error';
    action: string;
    message: string;
    input?: string;
    output?: string;
    error?: string;
    exception?: string;
    metadata?: Record<string, unknown>;
    traceId?: string;
    userId?: string;
    timestamp: string;
}
