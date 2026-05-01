import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema(
  {
    name: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true 
    },
    phone: { 
        type: String, 
        required: true 
    },
    department: { 
        type: String, 
        required: true 
    },
    occupation: { 
        type: String, 
        required: true 
    },
    type: { 
        type: String, 
        enum: ["staff", "non-staff"], 
        required: true 
    },
    nationality: {
      type: String,
      enum: ["rwandan", "foreigner"],
      required: true,
    },
    nationalId: {
      type: String,
      required: function () {
        return this.nationality === "rwandan";
      },
    },
    nationalIdPdf: {
      type: String,
      required: function () {
        return this.nationality === "rwandan";
      },
    },
    visaPdf: {
      type: String,
      required: function () {
        return this.nationality === "foreigner";
      },
    },
    passportPdf: {
      type: String,
      required: function () {
        return this.nationality === "foreigner";
      },
    },
    dateOfJoining: { type: Date, required: true },
    contractPdf: { type: String, required: true },
    netSalary: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    delete_status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
    },
    delete_reason: {
      type: String,
    },
    rejected_reason: {
      type: String,
    },
    transportAllowence:{
      type: Number,
      required : function(){
        return this.type === "staff";
      },
      default: 0,
    }
  },
  { timestamps: true }
);

export const Employee = mongoose.model("Employee", employeeSchema);
