import * as Yup from "yup"

export const loginFormikSchema = Yup.object().shape({
    email: Yup.string().required("Email is required").email("Enter valid email"),
    password: Yup.string().required("Password is required")
})

export const newUserFormikSchema = Yup.object().shape({
    email: Yup.string().required("Email is required").email("Enter valid email"),
    firstName: Yup.string().required("Fist name is required"),
    lastName: Yup.string().required("Last name is required"),
    role: Yup.string().required("Role is required"),
    phoneNumber: Yup.string().required("Phone number is required").min(10, "Phone number must be at least 10 digits").max(10, "Phone number must be at most 15 digits")
})


export const requestExpenseFormikSchema = Yup.object().shape({
    requested_for: Yup.string().required("This Input Is required"),
    beneficiary: Yup.string().when('requested_for', {
        is: 'other',
        then: (schema) => schema.required('Beneficiary is required when requested for others'),
        otherwise: (schema) => schema
    }),
    reason: Yup.string().required("This Input Is Required"),
    total_amount_paid: Yup.number()
        .required("This Input Is Required")
        .when('requested_for', {
            is: 'supplier',
            then: (schema) => schema.test(
                'not-greater-than-total',
                'Amount paid cannot be greater than total amount to be paid for suppliers',
                function (value) {
                    const total = this.parent.total_amount_to_be_paid;
                    return !value || !total || value <= total;
                }
            )
        }),
    total_amount_to_be_paid: Yup.number().required("This Input Is Required").min(1, "Minimum is 1"),
    expected_payment_date: Yup.string().required("This Input Is Required"),
    payment_mode: Yup.string().required("This Input Is Required"),
    payment_account: Yup.string().required("This Input Is Required"),
    description: Yup.string().required("Description is required"),
    selectedSupplies: Yup.array().when('requested_for', {
        is: 'supplier',
        then: (schema) => schema
            .min(1, 'At least one supply must be selected')
            .required('Selected supplies is required for supplier requests'),
        otherwise: (schema) => schema
    })
})


export const RecordMoneyFormikSchema = Yup.object().shape({
    received_from: Yup.string().required("This Input is Required"),
    date: Yup.string().required("This Input Is Required"),
    amount: Yup.number().required("This Input is required"),
    account: Yup.string().required("This Input is required"),
    reason: Yup.string().required("This input is required"),
    signed_document: Yup.mixed()
        .required("This Input is required")
        .test("fileType", "Only PDF files are allowed", (value: any) => {
            return value && value.type === "application/pdf";
        }),
});


export const newAssetFormikSchema = Yup.object().shape({
    item: Yup.string()
        .min(2, 'Item must be at least 2 characters long')
        .required('Item is required'),
    purchaseDate: Yup.date()
        .required('Purchase Date is required')
        .typeError('Invalid date format'),
    category: Yup.string()
        .required('Category is required'),
    description: Yup.string()
        .max(500, 'Description cannot exceed 500 characters'),
    location: Yup.string()
        .required('Location is required'),
    totalNumber: Yup.number()
        .integer('Total Number must be an integer')
        .min(0, 'Total Number cannot be negative')
        .required('Total Number is required'),
    totalNumberInGoodCondition: Yup.number()
        .integer('Total Number in Good Condition must be an integer')
        .min(1, 'Total Number in Good Condition cannot be negative')
        .max(Yup.ref('totalNumber'), 'Cannot exceed Total Number')
        .test(
            'good-plus-critical',
            'Sum of good and critical condition items cannot exceed total number',
            function (value) {
                const critical = this.parent.totalNumberInCriticalCondition;
                const total = this.parent.totalNumber;
                return !value || !critical || !total || (value + critical <= total);
            }
        )
        .required('Total Number in Good Condition is required'),
    totalNumberInCriticalCondition: Yup.number()
        .integer('Total Number in Critical Condition must be an integer')
        .min(0, 'Total Number in Critical Condition cannot be negative')
        .max(Yup.ref('totalNumber'), 'Cannot exceed Total Number')
        .test(
            'good-plus-critical',
            'Sum of good and critical condition items cannot exceed total number',
            function (value) {
                const good = this.parent.totalNumberInGoodCondition;
                const total = this.parent.totalNumber;
                return !value || !good || !total || (value + good <= total);
            }
        )
        .required('Total Number in Critical Condition is required'),
    values: Yup.number()
        .min(0, 'Values cannot be negative')
        .required('Values are required'),
    criticalCondition: Yup.string()
        .when('totalNumberInCriticalCondition', {
            is: (value: any) => value > 0,
            then: (schema) => schema.required('Critical Condition Description is required'),
            otherwise: (schema) => schema.notRequired(),
        }),
});



export const newStockFormikSchema = Yup.object().shape({
    item: Yup.string()
        .min(2, 'Item must be at least 2 characters long')
        .required('Item is required'),
    category: Yup.string()
        .required('Category is required'),
    description: Yup.string()
        .max(500, 'Description cannot exceed 500 characters')
        .required('Description is required'),
    quantity: Yup.number()
        .integer('Quantity must be an integer')
        .min(1, 'Quantity must be at least 1')
        .required('Quantity is required'),
    supplierId: Yup.string()
        .required('Supplier ID is required'),
    proofOfDelivery: Yup.mixed()
        .nullable()
        .required('Proof of Delivery is required')
        .test('fileType', 'Only PDF files are allowed', (value: any) => {
            return value && value.type === 'application/pdf';
        }),
    date: Yup.date()
        .required('Date is required')
        .typeError('Invalid date format'),
    totalPrice: Yup.number().required("Total Price is required").min(1, "Please add total price"),
    unityPrice: Yup.number().required("Unity Price is required").min(1, "Please add unity price"),
    unity: Yup.string().required("Unity measurement is required")
});

export const updateStockFormikSchema = Yup.object().shape({
    item: Yup.string()
        .min(2, 'Item must be at least 2 characters long')
        .required('Item is required'),
    category: Yup.string()
        .required('Category is required'),
    description: Yup.string()
        .max(500, 'Description cannot exceed 500 characters')
        .required('Description is required'),
    quantity: Yup.number()
        .integer('Quantity must be an integer')
        .min(1, 'Quantity must be at least 1')
        .required('Quantity is required'),

    totalPrice: Yup.number().required("Total Price is required").min(1, "Please add total price"),
    unityPrice: Yup.number().required("Unity Price is required").min(1, "Please add unity price"),
    unity: Yup.string().required("Unity measurement is required")
});


export const newSupplierFormikSchema = Yup.object().shape({
    name: Yup.string()
        .required('Name is required')
        .min(3, 'Name must be at least 3 characters')
        .max(100, 'Name must be less than 100 characters'),
    tin: Yup.string()
        .required('TIN is required'),
    phone: Yup.string()
        .required('Phone number is required')
        .matches(/^\+?\d{10,15}$/, 'Phone number must be valid and between 10-15 digits'),
    email: Yup.string()
        .required('Email is required')
        .email('Invalid email format'),
    commodity: Yup.string()
        .required('Commodity is required')
        .max(50, 'Commodity must be less than 50 characters'),
    address: Yup.string()
        .required('Address is required')
        .max(200, 'Address must be less than 200 characters'),
    contract: Yup.mixed()
        .required('Contract document is required')
        .test('fileType', 'Only PDF files are allowed', (value: any) => {
            return value && value.type === 'application/pdf';
        })
        .test('fileSize', 'File size should not exceed 5MB', (value: any) => {
            return value && value.size <= 5 * 1024 * 1024;
        }),
});
export const UpdateSupplierFormikSchema = Yup.object().shape({
    name: Yup.string()
        .required('Name is required')
        .min(3, 'Name must be at least 3 characters')
        .max(100, 'Name must be less than 100 characters'),
    tin: Yup.string()
        .required('TIN is required'),
    phone: Yup.string()
        .required('Phone number is required')
        .matches(/^\+?\d{10,15}$/, 'Phone number must be valid and between 10-15 digits'),
    email: Yup.string()
        .required('Email is required')
        .email('Invalid email format'),
    commodity: Yup.string()
        .required('Commodity is required')
        .max(50, 'Commodity must be less than 50 characters'),
    address: Yup.string()
        .required('Address is required')
        .max(200, 'Address must be less than 200 characters'),
});




export const newUniformPaymentFormikSchema = Yup.object().shape({
    item: Yup.string()
        .required('Item is required')
        .min(2, 'Item must be at least 2 characters')
        .max(50, 'Item must not exceed 50 characters'),
    supplierId: Yup.string().required('Item is required'),
    category: Yup.string()
        .required('Category is required')
        .min(2, 'Category must be at least 2 characters')
        .max(50, 'Category must not exceed 50 characters'),
    description: Yup.string()
        .required('Description is required'),
    proofOfDelivery: Yup.mixed()
        .required('Proof of delivery is required')
        .test('fileFormat', 'Only PDF files are allowed', (value: any) => {
            if (!value) return true;
            return value && ['application/pdf'].includes(value.type);
        })
        .test('fileSize', 'File size must be less than 5MB', (value: any) => {
            if (!value) return true;
            return value && value.size <= 5 * 1024 * 1024;
        }),

    fullUniformPrice: Yup.number()
        .when('item', {
            is: 'full uniform',
            then: (schema) => schema
                .required('Number of full uniforms is required')
                .min(1, 'Must order at least 1 full uniform'),
            otherwise: (schema) => schema.notRequired()
        }),
    uniforms: Yup.array().of(
        Yup.object().shape({
            itemName: Yup.string()
                .required('Item name is required')
                .min(2, 'Item name must be at least 2 characters')
                .max(50, 'Item name must not exceed 50 characters'),
            itemPrice: Yup.number()
                .required('Item price is required')
                .min(0, 'Price cannot be negative')
                .test('decimals', 'Price cannot have more than 2 decimal places',
                    (value) => !value || Number.isInteger(value * 100)),
            itemQuantity: Yup.number()
                .required('Quantity is required')
                .integer('Quantity must be a whole number')
                .min(1, 'Quantity must be at least 1')
        })
    ).min(1, 'At least one uniform item is required')
});


export const newBookSchema = Yup.object().shape({
    book_name: Yup.string().required('Book Name is required'),
    isbn: Yup.string().required('ISBN is required'),
    quantity: Yup.number().required('Quantity is required').min(1, "Minimumn quantity is 1"),
    author: Yup.string().required('Author is required'),
    shelf_number: Yup.string().required('Shelf number is required'),
});