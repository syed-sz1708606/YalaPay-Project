import mongoose from "mongoose";

const Schema = mongoose.Schema;

const chequeSchema = new Schema({
    chequeNo: {
        type: Number,
        required: [true, "Cheque Number required"],
        index: { unique: true, dropDups: true }
    },
    amount: {
        type: Number,
        required: [true, "Cheque Amount required"],
    },
    drawer: {
        type: String,
        required: [true, "Cheque Drawer required"],
    },
    bankName: {
        type: String,
        enum: [
            "Qatar National Bank",
            "Doha Bank",
            "Commercial Bank",
            "Qatar International Islamic Bank",
            "Qatar Islamic Bank",
            "Qatar Development Bank",
            "Arab Bank",
            "Al Ahli Bank",
            "Mashreq Bank",
            "HSBC Bank Middle East",
            "BNP Paribas",
            "Bank Saderat Iran",
            "United Bank ltd.",
            "Standard Chartered Bank",
            "Masraf Al Rayan",
            "Al khaliji Commercial Bank",
            "International Bank of Qatar",
            "Barwa Bank"
        ],
        required: [true, "Bank Name required"],
    },
    status: {
        type: String,
        required: [true, "Cheque status required"],
    },
    receivedDate: {
        type: Date,
        required: [true, "Cheque Recieved Date required"],
    },
    dueDate: {
        type: Date,
        required: [true, "Cheque Due Date required"],
    },
    depositedDate: {
        type: Date
    },
    chequeImageUri: {
        type: String,
        required: [true, "Cheque image required"],
    },
    paymentId: {
        type: Schema.Types.ObjectId,
        ref: "Payment",
    }
});

export default mongoose.model("Cheque", chequeSchema);
