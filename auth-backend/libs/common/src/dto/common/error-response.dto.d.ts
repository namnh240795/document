export declare class ErrorResponseDto {
    success: false;
    error: {
        code: string;
        message: string;
        details?: Record<string, unknown>;
    };
    constructor(code: string, message: string, details?: Record<string, unknown>);
}
