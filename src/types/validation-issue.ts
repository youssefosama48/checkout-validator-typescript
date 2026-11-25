export type ValidationIssueType =
    | "PRODUCT_NOT_FOUND"
    | "INSUFFICIENT_STOCK"
    | "INVALID_QUANTITY"
    | "OUT_OF_STOCK" ;

export interface ValidationIssue {
    type: ValidationIssueType;
    message: string;
}