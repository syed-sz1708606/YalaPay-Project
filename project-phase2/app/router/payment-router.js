import express from "express";

import PaymentService from "../service/payment-service.js";

const paymentRouter = express.Router();

const paymentService = new PaymentService();

paymentRouter
    .route("/")
    .get(paymentService.getPayments)
    .post(paymentService.addPayment)
    .put(paymentService.updatePayment)

// .delete(paymentService.dele);

paymentRouter
    .route("/:paymentId")
    .delete(paymentService.deletePayment);

paymentRouter.route("/invoices/:invoiceNo")
    .get(paymentService.getPaymentsByInvoice)

paymentRouter.route("/amount/:amount")
    .get(paymentService.getPaymentByAmount)

paymentRouter.route("/date/:date")
    .get(paymentService.getPaymentByDate)

paymentRouter.route("/mode/:mode")
    .get(paymentService.getPaymentByMode)

paymentRouter.route("/last/:limit")
    .get(paymentService.getLastNoOfPayments)


export default paymentRouter;
