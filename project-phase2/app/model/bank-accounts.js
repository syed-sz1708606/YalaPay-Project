// Add mongoose model stuff here
import mongoose from "mongoose";

const Schema = mongoose.Schema;

const bankAccountSchema = new Schema({
    accountNo: {
        type: String,
        required: [true, "Account required"]
    },
    bank: {
        type: String,
        required: [true, "Bank required"]
    }
});

export default mongoose.model("BankAccount", bankAccountSchema);
