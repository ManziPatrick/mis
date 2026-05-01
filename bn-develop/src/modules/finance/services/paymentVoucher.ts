import { PaymentVoucher } from '../../../database/model/paymentVoucher';
import { ExpenseRequest } from '../../../database/model/expenseRequest';
import { PersonalRequest } from '../../../database/model/personalRequest'; // Import PersonalRequest model
import { uploadFile } from '../../../utils';
import { Supplier } from '../../../database/model/supplier';
import { Employee } from '../../../database/model/employee';

export const generatePaymentVoucher = async (request: any, currentUser: any) => {
    try {
        const voucherNumber = generateVoucherNumber();
        
        // Determine the type of request and fetch the complete request with prepared_by details
        let populatedRequest;
        let amountPaid;
        let description;
        let payeeName = '';

        if (request instanceof ExpenseRequest) {
            populatedRequest = await ExpenseRequest.findById(request._id)
                .populate('prepared_by', 'firstName lastName email')
                .lean();
            amountPaid = request.total_amount_paid;
            description = request.description || `Payment for ${request.requested_for}`;
            
            if (request.employeeId) {
                const employee = await Employee.findById(request.employeeId);
                if (employee) {
                    payeeName = employee.name;
                }
            } else if (request.supplierId) {
                const supplier = await Supplier.findById(request.supplierId);
                if (supplier) {
                    payeeName = supplier.name;
                }
            } else {
                payeeName = request.beneficiary;
            }
        } else if (request instanceof PersonalRequest) {
            populatedRequest = await PersonalRequest.findById(request._id)
                .populate('prepared_by', 'firstName lastName email')
                .lean();
            amountPaid = request.amount;
            description = request.request_description || `Payment for ${request.reason}`;
            payeeName = currentUser.firstName + " " + currentUser.lastName;
        } else {
            throw new Error('Invalid request type');
        }

        if (!populatedRequest) {
            throw new Error('Invalid request');
        }

        // Create the payment voucher
        const paymentVoucher = await PaymentVoucher.create({
            voucher_number: voucherNumber,
            expense_request_id: request._id,
            amount_paid: amountPaid,
            description: description,
            status: 'Generated',
            generated_date: new Date(),
            payment_mode: request.payment_mode,
            payment_account: request.payment_account,
            beneficiary: payeeName,
            prepared_by: populatedRequest.prepared_by._id,
            approved_by: currentUser._id
        });

        // Fetch the created payment voucher with populated fields
        const populatedPaymentVoucher = await PaymentVoucher.findById(paymentVoucher._id)
            .populate('prepared_by', 'firstName lastName email')
            .populate('approved_by', 'firstName lastName email')
            .lean();

        return populatedPaymentVoucher;
    } catch (error) {
        console.error('Payment voucher generation error:', error);
        throw new Error('Failed to generate payment voucher');
    }
};

const generateVoucherNumber = (): string => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    
    return `PV-${year}${month}${day}-${random}`;
};

export const uploadSignedVoucher = async (
    voucherId: string, 
    file: Express.Multer.File, 
    currentUser: any
) => {
    try {
        const paymentVoucher = await PaymentVoucher.findById(voucherId);
        
        if (!paymentVoucher) {
            throw new Error('Payment voucher not found');
        }

        // Use the existing uploadImages function
        const uploadResult = await uploadFile(file);

        const updatedVoucher = await PaymentVoucher.findByIdAndUpdate(
            voucherId,
            {
                signed_document: uploadResult.file.url,
                document_status: 'Signed',
                uploaded_by: currentUser._id,
                upload_date: new Date()
            },
            { new: true }
        )
        .populate('prepared_by', 'firstName lastName email')
        .populate('approved_by', 'firstName lastName email')
        .populate('uploaded_by', 'firstName lastName email')
        .lean();

        return updatedVoucher;
    } catch (error) {
        console.error('Signed voucher upload error:', error);
        throw new Error('Failed to upload signed voucher');
    }
};