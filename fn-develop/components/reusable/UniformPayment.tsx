import { useFormik } from 'formik';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import React, { useState } from 'react';
import { toast, Toaster } from 'sonner';
import { newUniformPaymentFormikSchema } from '@/utlis/validation/validation';
import { IoMdDocument } from 'react-icons/io';
import { Plus, Trash2 } from 'lucide-react';
import { useCreateUniformStock, userCreateUniformPaymentMutation } from '@/utlis/hooks/payment.hook';

interface NewUniformType {
    isOpen: boolean;
    setIsOpen: any;
    categories?: any[];
    reFetch: any;
    suppliers?: any[];
}

interface UniformItem {
    itemName: string;
    itemPrice: number;
    itemQuantity: number;
}

const NewUniformPayment = ({ isOpen, setIsOpen, reFetch, categories, suppliers }: NewUniformType) => {
    const { mutate: createUniformStock } = useCreateUniformStock();
    const [isLoading, setIsLoading] = useState(false);

    const newUniformPaymentFormik = useFormik({
        initialValues: {
            item: "",
            category: "",
            description: "",
            proofOfDelivery: null,
            fullUniformPrice: 0,
            supplierId: "",
            uniforms: [] as UniformItem[]
        },
        validationSchema: newUniformPaymentFormikSchema,
        onSubmit: async (values) => {
            setIsLoading(true);
            try {
                createUniformStock(values, {
                    onSuccess: () => {
                        toast.success("New Uniform created successfully");
                        reFetch();
                        setIsOpen(false);
                        setIsLoading(false);
                        newUniformPaymentFormik.resetForm();
                    },
                    onError: (error: any) => {
                        const errorMessage = error?.response?.data?.message;
                        toast.error(errorMessage || "Something went wrong");
                        setIsLoading(false);
                    },
                });
            } catch (error: any) {
                setIsOpen(false);
                setIsLoading(false);
            }
        },
    });

    const addUniformItem = () => {
        const uniforms = [...newUniformPaymentFormik.values.uniforms];
        uniforms.push({ itemName: '', itemPrice: 0, itemQuantity: 1 });
        newUniformPaymentFormik.setFieldValue('uniforms', uniforms);
    };

    const removeUniformItem = (index: number) => {
        const uniforms = [...newUniformPaymentFormik.values.uniforms];
        uniforms.splice(index, 1);
        newUniformPaymentFormik.setFieldValue('uniforms', uniforms);
    };

    const handleUniformItemChange = (index: number, field: keyof UniformItem, value: string | number) => {
        const uniforms = [...newUniformPaymentFormik.values.uniforms];
        uniforms[index] = {
            ...uniforms[index],
            [field]: value
        };
        newUniformPaymentFormik.setFieldValue('uniforms', uniforms);
    };

    return (
        <>
            <Toaster position="top-right" />
            <Dialog
                header="New Uniform"
                headerStyle={{ fontSize: 10, color: "black" }}
                className="w-1/2"
                visible={isOpen}
                onHide={() => { newUniformPaymentFormik.resetForm(); setIsOpen(false) }}
            >
                <form
                    onSubmit={newUniformPaymentFormik.handleSubmit}
                    className="w-full p-3 flex flex-col gap-[10px]"
                >
                    <div className="grid grid-cols-2 gap-[5px]">
                        <div className="flex flex-col gap-[4px] w-full">
                            <span className="text-[12px] text-black">Item</span>
                            <select
                                value={newUniformPaymentFormik.values.item}
                                name="item"
                                onChange={newUniformPaymentFormik.handleChange}
                                className="border p-3 text-[12px] rounded-[12px]"
                            >
                                <option value="">Select Item</option>
                                <option value="full uniform">full uniform</option>
                                <option value="partial uniform">partial uniform</option>
                            </select>
                            {newUniformPaymentFormik.touched.item && newUniformPaymentFormik.errors.item && (
                                <div className="text-red-500 text-[12px]">{newUniformPaymentFormik.errors.item}</div>
                            )}
                        </div>
                        {newUniformPaymentFormik.values.item == "full uniform" && (
                            <div className="flex flex-col gap-[4px] w-full">
                                <span className="text-[12px] text-black">Full Uniform Price</span>
                                <input
                                    value={newUniformPaymentFormik.values.fullUniformPrice}
                                    name="fullUniformPrice"
                                    type='number'
                                    onChange={newUniformPaymentFormik.handleChange}
                                    className="border p-3 text-[12px] rounded-[12px]"
                                />
                                 
                                {newUniformPaymentFormik.touched.fullUniformPrice && newUniformPaymentFormik.errors.fullUniformPrice && (
                                    <div className="text-red-500 text-[12px]">{newUniformPaymentFormik.errors.fullUniformPrice}</div>
                                )}
                            </div>
                        )}
                        <div className="flex flex-col gap-[4px] w-full">
                            <span className="text-[12px] text-black">category</span>
                            <select
                                value={newUniformPaymentFormik.values.category}
                                name="category"
                                onChange={newUniformPaymentFormik.handleChange}
                                className="border p-3 text-[12px] rounded-[6px]"
                            >
                                <option value="" className='text-gray-200'>Select Category</option>
                                {categories?.map((category, index) => (
                                    <option key={index} value={category._id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                            {newUniformPaymentFormik.touched.category && newUniformPaymentFormik.errors.category && (
                                <div className="text-red-500 text-[12px]">{newUniformPaymentFormik.errors.category}</div>
                            )}
                        </div>
                        <div className="flex flex-col gap-[4px] w-full">
                            <span className="text-[12px] text-black">Supplier</span>
                            <select
                                value={newUniformPaymentFormik.values.supplierId}
                                name="supplierId"
                                onChange={newUniformPaymentFormik.handleChange}
                                className="border p-3 text-[12px] rounded-[12px]"

                            >

                                <option value="" disabled>Select supplier</option>
                                {suppliers?.map((supply: any, index: number) => {
                                    return (
                                        <option value={supply._id} key={index}>{supply.name}</option>
                                    )
                                })}
                            </select>
                            {newUniformPaymentFormik.touched.supplierId && newUniformPaymentFormik.errors.supplierId && (
                                <div className="text-red-500 text-[12px]">{newUniformPaymentFormik.errors.supplierId}</div>
                            )}
                        </div>
                        <div className="flex flex-col gap-[4px] w-full">
                            <span className="text-[12px] text-black">Description</span>
                            <textarea
                                value={newUniformPaymentFormik.values.description}
                                name="description"
                                onChange={newUniformPaymentFormik.handleChange}
                                className="border p-3 text-[12px] rounded-[12px]"
                                placeholder='Enter Description'
                            />
                   
                            {newUniformPaymentFormik.touched.description && newUniformPaymentFormik.errors.description && (
                                <div className="text-red-500 text-[12px]">{newUniformPaymentFormik.errors.description}</div>
                            )}
                        </div>
                        <div className="flex flex-col gap-[4px] w-full">
                            <span className="text-[12px] text-black">Proof of Payment</span>
                            <label
                                htmlFor="proofOfDelivery"
                                className={`cursor-pointer border flex flex-row gap-[4px] p-3 rounded-[12px] ${newUniformPaymentFormik.values.proofOfDelivery !== null ? "text-white bg-[#2E3487]" : ""} items-center justify-center`}
                            >
                                <IoMdDocument size={20} />
                                <span className="text-[13px] font-[500]">Assign document (PDF)</span>
                            </label>
                            <input
                                type="file"
                                name="proofOfDelivery"
                                id="proofOfDelivery"
                                accept="application/pdf"
                                className="hidden"
                                onChange={(event: any) => {
                                    const file = event.currentTarget.files[0];
                                    newUniformPaymentFormik.setFieldValue("proofOfDelivery", file);
                                }}
                            />
                            {newUniformPaymentFormik.touched.proofOfDelivery && newUniformPaymentFormik.errors.proofOfDelivery && (
                                <div className="text-red-500 text-[12px]">{newUniformPaymentFormik.errors.proofOfDelivery}</div>
                            )}
                        </div>

                    </div>
                    <div className="mt-4">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">Uniform Items</h3>
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
                                <div key={index} className="flex gap-4 items-start bg-gray-50 p-4 rounded-lg">
                                    <div className="flex-1">
                                        <input
                                            type="text"
                                            placeholder="Item Name"
                                            value={item.itemName}
                                            onChange={(e) => handleUniformItemChange(index, 'itemName', e.target.value)}
                                            className="border p-2 text-sm rounded-lg w-full"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <input
                                            type="number"
                                            placeholder="Price"
                                            onChange={(e) => handleUniformItemChange(index, 'itemPrice', parseFloat(e.target.value))}
                                            className="border p-2 text-sm rounded-lg w-full"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <input
                                            type="number"
                                            placeholder="Quantity"
                                            value={item.itemQuantity}
                                            onChange={(e) => handleUniformItemChange(index, 'itemQuantity', parseInt(e.target.value))}
                                            className="border p-2 text-sm rounded-lg w-full"
                                        />
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
                        {newUniformPaymentFormik.touched.uniforms && newUniformPaymentFormik.errors.uniforms && (
                            <div className="text-red-500 text-[12px]">
                                {
                                    Array.isArray(newUniformPaymentFormik.errors.uniforms)
                                        ? newUniformPaymentFormik.errors.uniforms.join(', ')
                                        : newUniformPaymentFormik.errors.uniforms
                                }
                            </div>
                        )}

                    </div>
                    <Button
                        loading={isLoading}
                        className="flex flex-row gap-[30px] items-center p-3 px-4 bg-[#2E3487] text-white justify-center"
                    >
                        Save
                    </Button>
                </form>
            </Dialog>
        </>
    );
};

export default NewUniformPayment;
