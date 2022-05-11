export class Invoice {
    constructor(customerId, amount, invoiceDate, dueDate) {
        this.customerId = customerId;
        this.amount = amount;
        this.invoiceDate = invoiceDate;
        this.dueDate = dueDate;
    }
}