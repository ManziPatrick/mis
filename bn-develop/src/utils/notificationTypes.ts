export enum NotificationType {
    // Finance related
    EXPENSE_REQUEST = 'expense-request',
    EXPENSE_APPROVED = 'expense-approved',
    EXPENSE_REJECTED = 'expense-rejected',
    
    // Library related
    BOOK_DELETION_REQUEST = 'book-deletion-request',
    BOOK_DELETION_APPROVED = 'book-deletion-approved',
    BOOK_DELETION_REJECTED = 'book-deletion-rejected',
    
    // Procurement related
    SUPPLIER_CREATED = 'supplier-created',
    SUPPLIER_APPROVED = 'supplier-approved',
    SUPPLIER_REJECTED = 'supplier-rejected',
    
    // HR related
    EMPLOYEE_CREATED = 'employee-created',
    EMPLOYEE_APPROVED = 'employee-approved',
    EMPLOYEE_REJECTED = 'employee-rejected',
    EMPLOYEE_DELETION_REQUEST = 'employee-deletion-request',
    EMPLOYEE_DELETION_APPROVED = 'employee-deletion-approved',
    EMPLOYEE_DELETION_REJECTED = 'employee-deletion-rejected',
    
    // Uniform related
    UNIFORM_PURCHASE = 'uniform-purchase',
    UNIFORM_UPDATE_REQUEST = 'uniform-update-request',
    UNIFORM_UPDATE_APPROVED = 'uniform-update-approved',
    UNIFORM_UPDATE_REJECTED = 'uniform-update-rejected',
    
    // User related
    USER_WELCOME = 'user-welcome',
    PASSWORD_RESET = 'password-reset',
    OTP = 'otp'
}