import express from "express";
import InvoiceService from "../service/invoice-service.js"

const invoiceRouter = express.Router();
const invoiceService = new InvoiceService();

invoiceRouter
    .route("/")
    .get(invoiceService.getInvoices)
    .post(invoiceService.addInvoice)
    .put(invoiceService.updateInvoice)

invoiceRouter
    .route("/:invoiceId")
    .delete(invoiceService.deleteInvoice);

invoiceRouter.route("/customer/:customerId")
    .get(invoiceService.getInvoicesByCustomerId)

invoiceRouter.route("/amount/:amount")
    .get(invoiceService.getInvoicesByAmount)

invoiceRouter.route("/report")
    .get(invoiceService.getInvoiceReport)

invoiceRouter.route("/totalAmount")
    .get(invoiceService.getTotalAmountOfInvoices)


invoiceRouter.route("/dueDates/:condition")
    .get(invoiceService.getInvoiceDueDates)

export default invoiceRouter;
