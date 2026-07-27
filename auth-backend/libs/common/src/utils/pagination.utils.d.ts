export interface PaginationMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}
export declare function buildPagination(page: number, limit: number, total: number): PaginationMeta;
export declare function getOffset(page: number, limit: number): number;
