const db = new Localbase('yalapay.db')

export class PaymentRepo {
    addPayment(payment) {
        try {
            return db.collection('payment').add(payment)
        } catch (e) {
            console.log(e)
        }
    }

    updatePayment(updatedPayment) {
        try {
            return db.collection('payment').doc({ paymentId: updatedPayment.paymentId }).update(updatedPayment)
        } catch (e) {
            console.log(e)
        }
    }

    deletePayment(paymentId) {
        try {
            return db.collection('payment').doc({ paymentId }).delete()
        } catch (e) {
            console.log(e)
        }
    }

    async getPaymentById(paymentId, invoiceId) {
        try {
            let payments;
            if (invoiceId) payments = await this.getPaymentsByInvoice(invoiceId)
            else payments = await this.getAllPayments()
            for (const payment of payments) {
                if (payment.paymentId == paymentId) return payment
            }
            return undefined;
        } catch (e) {
            console.log(e)
        }
    }

    async getPaymentsByInvoice(invoiceNo) {
        try {
            const invoicePayments = [];
            const payments = await this.getAllPayments()
            for (const payment of payments) {
                if (payment.invoiceNo == invoiceNo) invoicePayments.push(payment)
            }
            return invoicePayments;
        } catch (e) {
            console.log(e)
        }
    }

    async getPaymentByAmount(amount, invoiceId) {
        const resultPayments = [];
        try {
            let payments;
            if (invoiceId) payments = await this.getPaymentsByInvoice(invoiceId)
            else payments = await this.getAllPayments()

            for (const payment of payments) {
                if (payment.amount == amount)
                    resultPayments.push(payment)
            }
            return resultPayments;
        } catch (e) {
            console.log(e)
        }
    }

    async getPaymentByDate(date, invoiceId) {
        const resultPayments = [];
        try {
            let payments;
            if (invoiceId) payments = await this.getPaymentsByInvoice(invoiceId)
            else payments = await this.getAllPayments()

            for (const payment of payments) {
                console.log(`${new Date(payment.paymentDate).getTime()} == ${date.getTime()}`)
                if (new Date(payment.paymentDate).getTime() == date.getTime())
                    resultPayments.push(payment)
            }
            return resultPayments;
        } catch (e) {
            console.log(e)
        }
    }

    async getPaymentByMode(mode, invoiceId) {
        const resultPayments = [];
        try {
            let payments;
            if (invoiceId) payments = await this.getPaymentsByInvoice(invoiceId)
            else payments = await this.getAllPayments()

            for (const payment of payments) {
                if (payment.paymentMode == mode)
                    resultPayments.push(payment)
            }
            return resultPayments;
        } catch (e) {
            console.log(e)
        }
    }

    getAllPayments() {
        try {
            return db
                .collection('payment')
                .get()
        } catch (e) {
            console.log(e)
        }
    }
}
