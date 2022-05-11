// Add mongoose model stuff here
import mongoose from "mongoose";

const Schema = mongoose.Schema;

const options = {
  toJSON: {
    virtuals: true
  }
};

const chequeDepositSchema = new Schema({
  depositDate: {
    type: Date,
    required: [true, "Deposit Date required"],
  },
  bankAccountId: {
    type: Schema.Types.ObjectId,
    ref: "bankAccount",
    required: [true, "Bank Account Id required"],
  },
  depositStatus: {
    type: String,
    required: [true, "Status required"],
  },
  chequeNos: {
    type: [Schema.Types.ObjectId],
    ref: "cheque",
    required: [true, "Cheque No(s) required"],
  },
}, options);

chequeDepositSchema.virtual('depositId').get(function () {
  return this._id
})

export default mongoose.model("ChequeDeposit", chequeDepositSchema);
