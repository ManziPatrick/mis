import { useFormik } from 'formik';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import React, { useState } from 'react';
import { toast, Toaster } from 'sonner';
import { newUniformPaymentFormikSchema } from '@/utlis/validation/validation';
import { IoMdDocument } from 'react-icons/io';
import { Plus, Trash2 } from 'lucide-react';
import { useCreateUniformStock, userCreateUniformPaymentMutation } from '@/utlis/hooks/payment.hook';

interface UniformItem {
    itemName: string;
    quantity: number;
    price: number;
    _id: string;
}

interface UniformStock {
    _id: string;
    fullUniformPrice: number;
    itemPrices: {
        itemName: string;
        price: number;
        quantity: number;
        _id: string;
    }[];
    supplierId: {
        _id: string;
    };
}

interface NewUniformType {
    isOpen: boolean;
    setIsOpen: any;
    reFetch: any;
    uniforms?: UniformStock;
}

const FinanceNewUniformPayment = ({ isOpen, setIsOpen, reFetch, uniforms }: NewUniformType) => {
    const [isLoading, setIsLoading] = useState(false);
    const { mutate: createUniformPayment } = userCreateUniformPaymentMutation();

    const newUniformPaymentFormik = useFormik({
        initialValues: {
            studentId: "",
            name: "",
            faculty: "",
            level: "",
            amountPaid: 0,
            numberOfFullUniforms: 0,
            modeOfPayment: "",
            proofOfPayment: null,
            fullUniform: false,
            fullUniformPrice: uniforms?.fullUniformPrice || 0,
            supplierId: uniforms?.supplierId?._id || "",
            uniforms: [] as UniformItem[],

        },
        // validationSchema: newUniformPaymentFormikSchema,
        onSubmit: async (values) => {
            const totalAmount = values.fullUniform
                ? values.fullUniformPrice
                : values.uniforms.reduce((sum: any, item: any) => sum + (item.price * item.quantity), 0);

            const submitData = {
                ...values,
                amountPaid: totalAmount,
            };

            setIsLoading(true);
            try {
                createUniformPayment(submitData, {
                    onSuccess: () => {
                        toast.success("Uniform payment processed successfully");
                        reFetch();
                        setIsOpen(false);
                        newUniformPaymentFormik.resetForm();
                        setIsLoading(false);
                    },
                    onError: (error: any) => {
                        const errorMessage = error?.response?.data?.message;
                        toast.error(errorMessage);
                        setIsLoading(false);
                    },
                });
            } catch (error: any) {
                toast.error(error.message);
                setIsLoading(false);
            }
        },
    });

    // Handle uniform type selection
    const handleUniformTypeChange = (isFullUniform: boolean) => {
        newUniformPaymentFormik.setFieldValue('fullUniform', isFullUniform);
        newUniformPaymentFormik.setFieldValue('uniforms', []);
    };

    const addUniformItem = () => {
        if (!uniforms) return;

        const currentUniforms = [...newUniformPaymentFormik.values.uniforms];
        const availableItems = uniforms.itemPrices.filter(item =>
            !currentUniforms.some(existing => existing?._id === item._id)
        );

        if (availableItems.length > 0) {
            const newItem = availableItems[0];
            currentUniforms.push({
                itemName: newItem.itemName,
                quantity: 1,
                price: newItem.price,
                _id: newItem._id
            });
            newUniformPaymentFormik.setFieldValue('uniforms', currentUniforms);
        }
    };

    const removeUniformItem = (index: number) => {
        const currentUniforms = [...newUniformPaymentFormik.values.uniforms];
        currentUniforms.splice(index, 1);
        newUniformPaymentFormik.setFieldValue('uniforms', currentUniforms);
    };

    const handleUniformItemChange = (index: number, updatedItem: UniformItem) => {
        const currentUniforms = [...newUniformPaymentFormik.values.uniforms];
        currentUniforms[index] = updatedItem;
        newUniformPaymentFormik.setFieldValue('uniforms', currentUniforms);
    };

    return (
        <>
            <Toaster position="top-right" />
            <Dialog
                header="New Uniform Payment"
                headerStyle={{ fontSize: 10, color: "black" }}
                className="w-1/2"
                visible={isOpen}
                onHide={() => { newUniformPaymentFormik.resetForm(); setIsOpen(false) }}
            >
                <form
                    onSubmit={newUniformPaymentFormik.handleSubmit}
                    className="w-full p-3 flex flex-col gap-[10px]"
                >
                    {/* Student Information Fields */}
                    <div className="grid grid-cols-2 gap-[5px]">
                        <div className="flex flex-col gap-[4px]">
                            <span className="text-[12px] text-black">Student ID</span>
                            <input
                                type="text"
                                name="studentId"
                                value={newUniformPaymentFormik.values.studentId}
                                onChange={newUniformPaymentFormik.handleChange}
                                className="border p-2 rounded-lg"
                                placeholder="Enter Student ID"
                            />
                            {newUniformPaymentFormik.touched.studentId && newUniformPaymentFormik.errors.studentId && (
                                <div className="text-red-500 text-[12px]">{newUniformPaymentFormik.errors.studentId}</div>
                            )}
                        </div>
                        <div className="flex flex-col gap-[4px]">
                            <span className="text-[12px] text-black">Student Name</span>
                            <input
                                type="text"
                                name="name"
                                value={newUniformPaymentFormik.values.name}
                                onChange={newUniformPaymentFormik.handleChange}
                                className="border p-2 rounded-lg"
                                placeholder="Enter Student Name"
                            />
                            {newUniformPaymentFormik.touched.name && newUniformPaymentFormik.errors.name && (
                                <div className="text-red-500 text-[12px]">{newUniformPaymentFormik.errors.name}</div>
                            )}
                        </div>
                        <div className="flex flex-col gap-[4px]">
                            <span className="text-[12px] text-black">Faculty</span>
                            <input
                                type="text"
                                name="faculty"
                                value={newUniformPaymentFormik.values.faculty}
                                onChange={newUniformPaymentFormik.handleChange}
                                className="border p-2 rounded-lg"
                                placeholder="Enter Faculty"
                            />
                            {newUniformPaymentFormik.touched.faculty && newUniformPaymentFormik.errors.faculty && (
                                <div className="text-red-500 text-[12px]">{newUniformPaymentFormik.errors.faculty}</div>
                            )}
                        </div>
                        <div className="flex flex-col gap-[4px]">
                            <span className="text-[12px] text-black">Mode Of Payment</span>
                            <select
                                name="modeOfPayment"
                                value={newUniformPaymentFormik.values.modeOfPayment}
                                onChange={newUniformPaymentFormik.handleChange}
                                className="border p-2 rounded-lg"
                            >

                                <option value="">Select Mode Of Payment</option>
                                <option value="Bank">Bank</option>
                                <option value="Petty Cash">Petty Cash</option>

                            </select>
                            {newUniformPaymentFormik.touched.modeOfPayment && newUniformPaymentFormik.errors.modeOfPayment && (
                                <div className="text-red-500 text-[12px]">{newUniformPaymentFormik.errors.modeOfPayment}</div>
                            )}
                        </div>
                        <div className="flex flex-col gap-[4px]">
                            <span className="text-[12px] text-black">Level</span>
                            <select
                                name="level"
                                value={newUniformPaymentFormik.values.level}
                                onChange={newUniformPaymentFormik.handleChange}
                                className="border p-2 rounded-lg"
                            >
                                <option value="">Select Level</option>
                                <option value="Level 3">Level 3</option>
                                <option value="Level 4">Level 4</option>
                                <option value="Level 5">Level 5</option>
                            </select>
                            {newUniformPaymentFormik.touched.level && newUniformPaymentFormik.errors.level && (
                                <div className="text-red-500 text-[12px]">{newUniformPaymentFormik.errors.level}</div>
                            )}
                        </div>
                        {newUniformPaymentFormik.values.fullUniform && (
                            <div className="flex flex-col gap-[4px]">
                                <span className="text-[12px] text-black">NUmber Of Uniform</span>
                                <input
                                    type="text"
                                    name="numberOfFullUniforms"
                                    value={newUniformPaymentFormik.values.numberOfFullUniforms}
                                    onChange={newUniformPaymentFormik.handleChange}
                                    className="border p-2 rounded-lg"
                                    placeholder="Enter Number Of Uniform"
                                />
                                {newUniformPaymentFormik.touched.numberOfFullUniforms && newUniformPaymentFormik.errors.numberOfFullUniforms && (
                                    <div className="text-red-500 text-[12px]">{newUniformPaymentFormik.errors.numberOfFullUniforms}</div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Uniform Type Selection */}
                    <div className="mt-4">
                        <h3 className="text-lg font-semibold mb-2">Uniform Type</h3>
                        <div className="flex gap-4">
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="uniformType"
                                    checked={newUniformPaymentFormik.values.fullUniform}
                                    onChange={() => handleUniformTypeChange(true)}
                                    className="mr-2"
                                />
                                Full Uniform ({uniforms?.fullUniformPrice} RWF)
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="uniformType"
                                    checked={!newUniformPaymentFormik.values.fullUniform}
                                    onChange={() => handleUniformTypeChange(false)}
                                    className="mr-2"
                                />
                                Partial Items
                            </label>
                        </div>
                    </div>

                    {/* Partial Items Selection */}
                    {!newUniformPaymentFormik.values.fullUniform && (
                        <div className="mt-4">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold">Selected Items</h3>
                                <Button
                                    type="button"
                                    className="flex items-center gap-2 bg-blue-800 p-2 text-white rounded-lg"
                                    onClick={addUniformItem}
                                >
                                    <Plus size={16} />
                                    <span className="text-sm">Add Item</span>
                                </Button>
                            </div>

                            <div className="space-y-4">
                                {newUniformPaymentFormik.values.uniforms.map((item, index) => (
                                    <div key={index} className="flex gap-4 items-center bg-gray-50 p-4 rounded-lg">
                                        <div className="flex-1">
                                            <select
                                                value={item?._id}
                                                onChange={(e) => {
                                                    const selectedItem = uniforms?.itemPrices.find(
                                                        i => i._id === e.target.value
                                                    );
                                                    if (selectedItem) {
                                                        handleUniformItemChange(index, {
                                                            itemName: selectedItem.itemName,
                                                            price: selectedItem.price,
                                                            _id: selectedItem._id,
                                                            quantity: item.quantity
                                                        });
                                                    }
                                                }}
                                                className="border p-2 rounded-lg w-full"
                                            >
                                                {uniforms?.itemPrices.map(price => (
                                                    <option key={price._id} value={price._id}>
                                                        {price.itemName} - {price.price} RWF
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="w-24">
                                            <input
                                                type="number"
                                                min="1"
                                                value={item.quantity}
                                                onChange={(e) => handleUniformItemChange(index, {
                                                    ...item,
                                                    quantity: parseInt(e.target.value) || 1
                                                })}
                                                className="border p-2 rounded-lg w-full"
                                            />
                                        </div>
                                        <div className="w-24 text-right">
                                            {item.price * item.quantity} RWF
                                        </div>
                                        <Button
                                            type="button"
                                            className="bg-red-500 p-2 text-white rounded-lg"
                                            onClick={() => removeUniformItem(index)}
                                        >
                                            <Trash2 size={16} />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Total Amount Display */}
                    <div className="mt-4 text-right text-lg font-semibold">
                        Total: {newUniformPaymentFormik.values.fullUniform
                            ? uniforms?.fullUniformPrice
                            : newUniformPaymentFormik.values.uniforms.reduce((sum, item) => sum + (item.price * item.quantity), 0)
                        } RWF
                    </div>

                    {/* Proof of Payment Section */}
                    <div className="flex flex-col gap-[4px] w-full">
                        <span className="text-[12px] text-black">Proof of Payment</span>
                        <label
                            htmlFor="proofOfPayment"
                            className={`cursor-pointer border flex flex-row gap-[4px] p-3 rounded-[12px] ${newUniformPaymentFormik.values.proofOfPayment !== null ? "text-white bg-[#2E3487]" : ""} items-center justify-center`}
                        >
                            <IoMdDocument size={20} />
                            <span className="text-[13px] font-[500]">Assign document (PDF)</span>
                        </label>
                        <input
                            type="file"
                            name="proofOfPayment"
                            id="proofOfPayment"
                            accept="application/pdf"
                            className="hidden"
                            onChange={(event: any) => {
                                const file = event.currentTarget.files[0];
                                newUniformPaymentFormik.setFieldValue("proofOfPayment", file);
                            }}
                        />
                        {newUniformPaymentFormik.touched.proofOfPayment && newUniformPaymentFormik.errors.proofOfPayment && (
                            <div className="text-red-500 text-[12px]">{newUniformPaymentFormik.errors.proofOfPayment}</div>
                        )}
                    </div>

                    <Button
                        loading={isLoading}
                        className="flex flex-row gap-[30px] items-center p-3 px-4 bg-[#2E3487] text-white justify-center"
                    >
                        Save Payment
                    </Button>
                </form>
            </Dialog>
        </>
    );
};

export default FinanceNewUniformPayment;
