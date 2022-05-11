const db = new Localbase('yalapay.db')

export class InvoiceRepo {
    addInvoice(invoice) {
        try {
            return db.collection('invoice').add(invoice)
        } catch (e) {
            console.log(e)
        }
    }
    updateInvoice(updatedInvoice) {
        try {
            return db.collection('invoice').doc({ invoiceNo: updatedInvoice.invoiceNo }).update(updatedInvoice)
        } catch (e) {
            console.log(e)
        }
    }

    deleteInvoice(invoiceNo) {
        try {
            return db.collection('invoice').doc({ invoiceNo }).delete()
        } catch (e) {
            console.log(e)
        }
    }

    async getInvoiceById(invoiceNo) {
        try {
            const invoices = await this.getAllInvoices()
            for (const invoice of invoices) {
                if (invoice.invoiceNo == invoiceNo) return invoice
            }
            return undefined;
        } catch (e) {
            console.log(e)
        }
    }

    async getInvoiceByCustomerId(customerId) {
        const resultInvoices = [];
        try {
            const invoices = await this.getAllInvoices()
            for (const invoice of invoices) {
                if (invoice.customerId == customerId) resultInvoices.push(invoice);
            }
            return resultInvoices;
        } catch (e) {
            console.log(e)
        }
    }

    async getInvoiceByAmount(amount) {
        const resultInvoices = [];
        try {
            const invoices = await this.getAllInvoices()
            for (const invoice of invoices) {
                if (invoice.amount == amount) resultInvoices.push(invoice);
            }
            return resultInvoices;
        } catch (e) {
            console.log(e)
        }
    }

    getAllInvoices() {
        try {
            return db
                .collection('invoice')
                .get()
        } catch (e) {
            console.log(e)
        }
    }
}
