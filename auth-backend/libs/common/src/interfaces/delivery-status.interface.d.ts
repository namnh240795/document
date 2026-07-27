export interface DeliveryStatus {
    verification_id: string;
    status: 'delivered' | 'failed';
    provider_message_id: string;
    error_message?: string;
}
