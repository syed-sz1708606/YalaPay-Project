import invoiceRepo from "../repository/invoice-repo.js";
import paymentRepo from "../repository/payment-repo.js";

export default class InvoiceService {
    async getInvoices(req, res) {
        try {
            const id = req.query.invoiceId;
            if (id) {
                const invoice = await invoiceRepo.getInvoiceById(id);
                res.json(invoice);
            } else {
                const invoices = await invoiceRepo.getAllInvoices();
                res.json(invoices);
            }
        } catch (e) {
            res.status(500).send(e);
        }
    }

    async addInvoice(req, res) {
        try {
            const response = await invoiceRepo.addInvoice(req.body);
            res.json(response);
        } catch (e) {
            res.status(500).send(e);
        }
    }

    async deleteInvoice(req, res) {
        try {
            const response = await invoiceRepo.deleteInvoice(req.params.invoiceId);
            res.json(response);
        } catch (e) {
            res.status(500).send(e);
        }
    }

    async updateInvoice(req, res) {
        try {
            const response = await invoiceRepo.updateInvoice(req.body);
            res.json(response);
        } catch (e) {
            res.status(500).send(e);
        }
    }

    async getAllInvoices(req, res) {
        try {
            const response = await invoiceRepo.getAllInvoices();
            res.json(response);
        } catch (e) {
            res.status(500).send(e);
        }
    }

    async getInvoicesByCustomerId(req, res) {
        try {
            const response = await invoiceRepo.getInvoicesByCustomerId(req.params.customerId);
            res.json(response);
        } catch (e) {
            res.status(500).send(e);
        }
    }

    async getInvoicesByAmount(req, res) {
        try {
            const response = await invoiceRepo.getInvoicesByAmount(req.params.amount);
            res.json(response);
        } catch (e) {
            res.status(500).send(e);
        }
    }

    async getInvoiceReport(req, res) {
        try {
            const response = await invoiceRepo.getInvoiceReport();
            res.json(response);
        } catch (e) {
            res.status(500).send(e);
        }
    }

    async getTotalAmountOfInvoices(req, res) {
        try {
            const response = await invoiceRepo.getTotalAmountOfInvoices()
            res.json(response);
        } catch (e) {
            console.log(e)
            res.status(500).send(e);
        }
    }

    async getInvoiceDueDates(req, res) {
        try {
            const condition = req.params.condition
            const response = await invoiceRepo.getInvoiceDueDates(condition)
            res.json(response);
        } catch (e) {
            console.log(e)
            res.status(500).send(e);
        }
    }
}
