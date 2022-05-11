import paymentRepo from "../repository/payment-repo.js";
import chequeRepo from "../repository/cheque-repo.js";

export default class PaymentService {
    async getPayments(req, res) {
        try {
            const id = req.query.paymentId;
            if (id) {
                const invoice = await paymentRepo.getPaymentById(id);
                res.json(invoice);
            } else {
                const invoices = await paymentRepo.getAllPayments();
                res.json(invoices);
            }
        } catch (e) {
            res.status(500).send(e);
        }
    }

    async addPayment(req, res) {
        try { console.log(req.body)
            const response = await paymentRepo.addPayment(req.body);
             res.json(response);
        } catch (e) {
            console.log(e)
            res.status(500).send(e);
        }
    }

    async deletePayment(req, res) {
        try {
            const response = await paymentRepo.deletePayment(req.params.paymentId);
            res.json(response);
        } catch (e) {
            res.status(500).send(e);
        }
    }

    async updatePayment(req, res) {
        try {
            console.log(req.query)
            const response = await paymentRepo.updatePayment(req.body);
            res.json(response);
        } catch (e) {
            res.status(500).send(e);
        }
    }

    async getAllPayments(req, res) {
        try {
            const response = await paymentRepo.getAllPayments();
            res.json(response);
        } catch (e) {
            res.status(500).send(e);
        }
    }

    async getPaymentsByInvoice(req, res) {
        try {
            const response = await paymentRepo.getPaymentsByInvoice(req.params.invoiceNo);
            res.json(response);
        } catch (e) {
            res.status(500).send(e);
        }
    }

    async getPaymentByAmount(req, res) {
        try {
            const response = await paymentRepo.getPaymentByAmount(req.params.amount);
            res.json(response);
        } catch (e) {
            res.status(500).send(e);
        }
    }
    async getPaymentByDate(req, res) {
        try {
            const response = await paymentRepo.getPaymentByDate(req.params.date);
            res.json(response);
        } catch (e) {
            res.status(500).send(e);
        }
    }
    async getPaymentByMode(req, res) {
        try {
            const response = await paymentRepo.getPaymentByMode(req.params.mode);
            res.json(response);
        } catch (e) {
            res.status(500).send(e);
        }
    }
    async getLastNoOfPayments(req, res) {
        try {
            const limit = req.params.limit;
            const response = await paymentRepo.getLastNoOfPayments(limit)
            res.json(response);
        } catch (e) {
            console.log(e)
            res.status(500).send(e);
        }
    }



}
