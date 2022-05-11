class InvoiceRepo {
    constructor() {
        this.baseUrl = " /api/invoices";
    }

    async addInvoice(invoice) {
        return await fetch(this.baseUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(invoice)
        });
    }

    async getAllInvoices() {
        const data = await fetch(this.baseUrl)
        const invoices = await data.json()
        return invoices
    }

    async getInvoiceReport() {
        const data = await fetch(`${this.baseUrl}/report`)
        const invoices = await data.json()
        return invoices
    }

    async getInvoice(invoiceId) {
        const data = await fetch(`${this.baseUrl}?invoiceId=${invoiceId}`)
        const invoice = await data.json()
        return invoice
    }

    async updateInvoice(updatedInvoice) {
        return await fetch(this.baseUrl, {
            method: 'Put',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedInvoice)
        });
    }

    async deleteInvoice(invoiceId) {
        return await fetch(`${this.baseUrl}/${invoiceId}`, {
            method: 'Delete'
        });
    }

    async getInvoicesByCustomerId(customerId) {
        const data = await fetch(`${this.baseUrl}/customer/${customerId}`)
        const invoices = await data.json()
        return invoices
    }

    async getInvoicesByAmount(amount) {
        const data = await fetch(`${this.baseUrl}/amount/${amount}`)
        const invoices = await data.json()
        return invoices
    }
    async getTotalAmountOfInvoices() {
        const data = await fetch(`${this.baseUrl}/totalAmount`)
        const trimmedInvoice = await data.json()
        if(trimmedInvoice.length > 0) {
            return trimmedInvoice[0].totalAmount
        }
        return 0
    }

    async getInvoiceDueDates(condition) {
        const data = await fetch(`${this.baseUrl}/dueDates/${condition}`)
        const invoices = await data.json()
        if(condition == "less" || condition == "greatEqual") {
            if (invoices.length > 0) {
                // if()
                return invoices[0].totalAmount
            }
        }
        return 0
    }
}

export default new InvoiceRepo()
