import Payment from "../model/payment.js"

class PaymentRepo {
    addPayment(payment) {
        return Payment.create(payment)
    }

    updatePayment(updatedPayment) {
        return Payment.findByIdAndUpdate(updatedPayment._id, updatedPayment);
    }

    deletePayment(paymentId) {
        return Payment.deleteOne({ _id: paymentId });
    }

    deletePaymentsByInvoice(invoiceNo) {
        return Payment.deleteMany({ invoiceNo });
    }

    getPaymentById(paymentId) {
        return Payment.findOne({ _id: paymentId });
    }

    getPaymentsByInvoice(invoiceNo) {
        return Payment.find({ invoiceNo });
    }

    getPaymentByAmount(amount) {
        return Payment.find({ amount });
    }

    getPaymentByDate(paymentDate) {
        return Payment.find({ paymentDate });
    }

    getPaymentByMode(paymentMode) {
        return Payment.find({ paymentMode });
    }

    getAllPayments() {
        return Payment.find();
    }

    getLastNoOfPayments(limit){
        //if(limit == 1)
              //  return Payment.findOne().sort({_id:-1}).limit(limit)
       // else
             return Payment.find().sort({_id:-1}).limit(limit)
        /*return Payment.aggregate ( [
            {
                '$sort': {
                    '_id': -1
                }
            }, {
                '$limit': 1
            }
        ])*/
    }
}

export default new PaymentRepo()
