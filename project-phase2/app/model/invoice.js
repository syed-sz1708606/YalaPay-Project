// Add mongoose model stuff here
import mongoose from "mongoose";

const Schema = mongoose.Schema;

const options = {
  toJSON: {
    virtuals: true
  }
}

const invoiceSchema = new Schema({
  customerId: {
    type: Schema.Types.ObjectId,
    ref: "Customer",
    required: [true, "Customer Id required"],
  },
  amount: {
    type: Number,
    required: [true, "Amount required"],
  },
  invoiceDate: {
    type: Date,
    required: [true, "Invoice Date required"],
  },
  dueDate: {
    type: Date,
    required: [true, "Due Date required"],
  },
}, options);

invoiceSchema.virtual('invoiceNo').get(function () {
  return this._id
})


export default mongoose.model("Invoice", invoiceSchema);
