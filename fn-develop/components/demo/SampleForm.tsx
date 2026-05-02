"use client";

import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { Calendar } from 'primereact/calendar';
import { toast } from 'sonner';

// 1. Process: Define the Schema first
const demoSchema = Yup.object().shape({
    title: Yup.string()
        .min(3, "Title too short")
        .required("Title is required"),
    type: Yup.string()
        .required("Type is required"),
    amount: Yup.number()
        .min(1, "Amount must be at least 1")
        .required("Amount is required"),
    date: Yup.date()
        .required("Date is required"),
});

const SampleForm = () => {
    const [isLoading, setIsLoading] = useState(false);

    const assetTypes = [
        { label: 'Electronics', value: 'electronics' },
        { label: 'Furniture', value: 'furniture' },
        { label: 'Vehicles', value: 'vehicles' },
    ];

    // 2. Process: Initialize Formik
    const formik = useFormik({
        initialValues: {
            title: '',
            type: '',
            amount: 0,
            date: null,
        },
        validationSchema: demoSchema,
        onSubmit: async (values) => {
            setIsLoading(true);
            try {
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 2000));
                console.log("Form Submitted:", values);
                toast.success("Form submitted successfully!");
                formik.resetForm();
            } catch (error) {
                toast.error("An error occurred during submission.");
            } finally {
                setIsLoading(false);
            }
        },
    });

    return (
        <div className="w-full max-w-2xl mx-auto p-8 bg-white rounded-2xl shadow-xl border border-gray-100">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800">Create New Asset</h2>
                <p className="text-gray-500 text-sm">Please fill in the details below to register a new system asset.</p>
            </div>

            <form onSubmit={formik.handleSubmit} className="flex flex-col gap-6">
                {/* Title Field */}
                <div className="flex flex-col gap-2">
                    <label htmlFor="title" className="text-sm font-semibold text-gray-700">Asset Title</label>
                    <InputText
                        id="title"
                        name="title"
                        value={formik.values.title}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="e.g. MacBook Pro 16\"
                        className={`p-3 rounded-lg border ${formik.touched.title && formik.errors.title ? 'border-red-500' : 'border-gray-200'}`}
                    />
                    {formik.touched.title && formik.errors.title && (
                        <span className="text-red-500 text-xs italic">{formik.errors.title}</span>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Type Field */}
                    <div className="flex flex-col gap-2">
                        <label htmlFor="type" className="text-sm font-semibold text-gray-700">Asset Type</label>
                        <Dropdown
                            id="type"
                            name="type"
                            value={formik.values.type}
                            options={assetTypes}
                            onChange={(e) => formik.setFieldValue('type', e.value)}
                            onBlur={formik.handleBlur}
                            placeholder="Select Type"
                            className={`rounded-lg border ${formik.touched.type && formik.errors.type ? 'border-red-500' : 'border-gray-200'}`}
                        />
                        {formik.touched.type && formik.errors.type && (
                            <span className="text-red-500 text-xs italic">{formik.errors.type}</span>
                        )}
                    </div>

                    {/* Amount Field */}
                    <div className="flex flex-col gap-2">
                        <label htmlFor="amount" className="text-sm font-semibold text-gray-700">Purchase Amount</label>
                        <InputNumber
                            id="amount"
                            name="amount"
                            value={formik.values.amount}
                            onValueChange={(e) => formik.setFieldValue('amount', e.value)}
                            mode="currency"
                            currency="USD"
                            locale="en-US"
                            className={`rounded-lg border ${formik.touched.amount && formik.errors.amount ? 'border-red-500' : 'border-gray-200'}`}
                        />
                        {formik.touched.amount && formik.errors.amount && (
                            <span className="text-red-500 text-xs italic">{formik.errors.amount}</span>
                        )}
                    </div>
                </div>

                {/* Date Field */}
                <div className="flex flex-col gap-2">
                    <label htmlFor="date" className="text-sm font-semibold text-gray-700">Purchase Date</label>
                    <Calendar
                        id="date"
                        name="date"
                        value={formik.values.date}
                        onChange={(e) => formik.setFieldValue('date', e.value)}
                        showIcon
                        placeholder="Select Date"
                        className={`rounded-lg border ${formik.touched.date && formik.errors.date ? 'border-red-500' : 'border-gray-200'}`}
                    />
                    {formik.touched.date && formik.errors.date && (
                        <span className="text-red-500 text-xs italic">{formik.errors.date}</span>
                    )}
                </div>

                {/* Submit Button */}
                <div className="mt-4">
                    <Button
                        type="submit"
                        label="Register Asset"
                        loading={isLoading}
                        className="w-full bg-[#2E3487] hover:bg-[#252a6d] text-white font-bold py-3 rounded-xl transition duration-200 shadow-lg shadow-blue-100"
                    />
                </div>
            </form>
        </div>
    );
};

export default SampleForm;
