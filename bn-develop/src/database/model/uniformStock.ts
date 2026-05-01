import mongoose, { Schema, Document } from "mongoose";

interface IItemPrice {
  itemName: string;
  price: number;
  quantity: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface IUniform extends Document {
  item: string;
  category: mongoose.Schema.Types.ObjectId;
  description: string;
  quantity: number;
  minimumThreshold:number;
  supplierId: mongoose.Schema.Types.ObjectId;
  proofOfDelivery: string;
  date: Date;
  uniformTakenBy?: mongoose.Schema.Types.ObjectId;
  fullUniformPrice?: number;
  itemPrices: IItemPrice[];
  totalPrice?: number;
  reservedQuantity?: number;
  soldFullUniforms?: number;
  discount?: number;  // Optional discount field
}

const uniformSchema = new Schema<IUniform>( 
  {
    item: {
      type: String,
      enum: ['full uniform', 'partial uniform'], // Only allow "full uniform" or "partial uniform"
      required: true,
    },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    description: { type: String, required: true },
    supplierId: { type: Schema.Types.ObjectId, ref: "Supplier", required: true },
    proofOfDelivery: { type: String, required: true },
    minimumThreshold: { type: Number, required: true ,default: 5},
    quantity: { type: Number },
    fullUniformPrice: { type: Number, required: function () { return this.item === 'full uniform' } },
    itemPrices: {
      type: [
        {
          itemName: { type: String, required: true },
          price: { type: Number, required: true },
          quantity: { type: Number, required: true },
        },
      ],
      default: [],
    },
    reservedQuantity: { type: Number, default: 0 },  // For reserved stock
    soldFullUniforms: { type: Number, default: 0 },  // For tracking sold full uniforms
    discount: { type: Number, default: 0 },  // Discount handling (percentage)
    totalPrice: { type: Number },  // Total price for full or partial uniform
  },
  { timestamps: true }
);

// Pre-save hook to calculate total price (considering discount)
uniformSchema.pre("save", function (next) {
  if (this.item === "full uniform") {
    if (!this.fullUniformPrice) {
      return next(new Error("Full uniform price must be set for full uniforms."));
    }
    this.totalPrice = this.fullUniformPrice;
    this.quantity = this.itemPrices.reduce((total,item) => total + item.quantity, 0); // Calculate total quantity for full uniforms
  } else {
    // Calculate total price for partial uniforms
    this.totalPrice = this.itemPrices.reduce((total, item) => total + item.price * item.quantity, 0);
    this.quantity = this.itemPrices.reduce((total, item) => total + item.quantity, 0); // Calculate total quantity for partial uniforms
  }

  // Apply discount if any
  if (this.discount > 0) {
    this.totalPrice -= (this.totalPrice * this.discount / 100);
  }

  next();
});


const Uniform = mongoose.model<IUniform>("Uniform", uniformSchema);

export { Uniform };
