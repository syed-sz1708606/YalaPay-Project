import { ChequeRepo } from "../repository/cheque-repo.js";
import { PaymentRepo } from "../repository/payment-repo.js";

export class Invoice {
    constructor(invoiceNo, customerId, customerName, amount, invoiceDate, dueDate) {
        this.invoiceNo = invoiceNo;
        this.customerId = customerId;
        this.customerName = customerName;
        this.amount = amount;
        this.invoiceDate = invoiceDate;
        this.dueDate = dueDate;
    }

    async getBalance() {
        const paymentRepo = new PaymentRepo();
        const chequeRepo = new ChequeRepo();

        let balance = this.amount

        const payments = await paymentRepo.getPaymentsByInvoice(this.invoiceNo)
        for (const payment of payments) {
            if (payment.paymentMode == "Cheque") {
                const cheque = await chequeRepo.getChequeById(payment.chequeNo)
                const chequeStatus = cheque.status.split(" ")[0] //Since returned cheques have return reason in their status
                if (chequeStatus == "Returned")
                    continue
            }
            balance -= payment.amount
        }

        return balance;
    }
}