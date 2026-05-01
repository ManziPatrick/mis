export interface InputType {
    label: string;
    type: string;
    onChange: any;
    placeholder: string
}

export interface NewUserModalType {
    isOpen: boolean;
    setIsOpen: any;
    roles: any;
    reFetch?: any

}

export interface NewUser {
    firstName: string,
    lastName: string,
    email: string,
    role_id: string,
    phoneNumber: string
}

export interface RequestExpense {
    requested_for?: string,
    beneficiary?: string,
    total_amount_paid?: number,
    total_amount_to_be_paid?: number,
    expected_payment_date?: string,
    payment_mode?: string,
    payment_account?: string,
    date?: Date,
    reason: string,
    employeeId?: string | null,
    supplierId?: string | null,
    description: string,
    selectedSupplies?: string[]
}


export interface ReceivedMoney {
    amount: number;
    received_from: string;
    reason: string;
    account: string;
    signed_document: any;
    date: string
}


export interface NewSupplierType {
    name: string;
    tin: string;
    phone: string;
    email: string;
    commodity: string;
    address: string;
    contract: any;
    id?: string
}

export interface createEmployeeType {
    name: string;
    email: string;
    department: string;
    occupation: string;
    netSalary: string;
    type: string;
    phone: string;
    nationalId?: string;
    nationality: string;
    nationalIdPdf?: any;
    contractPdf?: any;
    visaPdf?: any;
    passportPdf?: any;
    dateOfJoing: string
}
export interface updateEmployeeType {
    id: string;
    name: string;
    email: string;
    department: string;
    occupation: string;
    netSalary: string;
    type: string;
    phone: string;
    nationalId?: string;
    nationality: string;
    nationalIdPdf?: any;
    contractPdf?: any;
    visaPdf?: any;
    passportPdf?: any;
    dateOfJoing: string
}