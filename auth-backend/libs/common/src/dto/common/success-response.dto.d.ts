export declare class SuccessResponseDto<T = unknown> {
    success: true;
    data: T;
    meta?: {
        requestId: string;
        timestamp: string;
    };
    constructor(data: T);
}
