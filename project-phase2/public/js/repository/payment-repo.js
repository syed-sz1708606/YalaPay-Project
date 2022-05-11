class PaymentRepo {

    constructor() {
        this.baseUrl = "/api/payments";
    }

    async addPayment(payment) {
        return await fetch(this.baseUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payment)
        });
    }

    async getAllPayments() {
        const data = await fetch(this.baseUrl)
        const payments = await data.json()
        return payments
    }

    async getPayment(paymentId) {
        const data = await fetch(`${this.baseUrl}?paymentId=${paymentId}`)
        console.log(paymentId)
        const payments = await data.json()
        return payments
    }

    async updatePayment(updatedPayment) {
        return await fetch(this.baseUrl, {
            method: 'Put',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedPayment)
        });
    }

    async deletePayment(paymentId) {
        return await fetch(`${this.baseUrl}/${paymentId}`, {
            method: 'Delete'
        });
    }

    async getPaymentsByInvoice(invoiceId) {
        const data = await fetch(`${this.baseUrl}/invoices/${invoiceId}`)
        const payments = await data.json()
        return payments
    }

    async getPaymentByAmount(amount) {
        const data = await fetch(`${this.baseUrl}/amount/${amount}`)
        const payments = await data.json()
        return payments
    }
    async getPaymentByDate(date) {
        const data = await fetch(`${this.baseUrl}/date/${date}`)
        const payments = await data.json()
        return payments
    }
    async getPaymentByMode(mode) {
        const data = await fetch(`${this.baseUrl}/mode/${mode}`)
        const payments = await data.json()
        return payments
    }
    async getLastNoOfPayments(limit) {
        const data = await fetch(`${this.baseUrl}/last/${limit}`)
        const payments = await data.json()
        console.log(payments)
        if(payments.length > 0) {
            console.log("inside if statment")
            console.log(payments)
            return payments
        }
        return null
    }
}

export default new PaymentRepo()
