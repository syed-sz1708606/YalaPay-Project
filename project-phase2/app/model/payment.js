import mongoose from "mongoose";

const Schema = mongoose.Schema;


const options = {
    toJSON: {
        virtuals: true
    }
}

const paymentSchema = new Schema({
    invoiceNo: {
        type: Schema.Types.ObjectId,
        ref: "Invoice",
        required: [true, "Invoice no required"],
    },
    amount: {
        type: Number,
        required: [true, "Payment Amount required"],
    },
    paymentDate: {
        type: Date,
        required: [true, "Payment Date required"],
    },
    paymentMode: {
        type: String,
        enum :  ['Bank transfer', 'Credit card' ,'Cheque'],
        required: [true, 'payment mode is a required field']
    },
    chequeNo : {
        type: String,
        index: {unique: true, dropDups: true}
    }
}, options);


paymentSchema.virtual('paymentId').get(function () {
    return this._id
})


export default mongoose.model("Payment", paymentSchema);
