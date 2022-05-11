export class Payment {
    constructor(invoiceNo, amount, paymentDate, paymentMode, chequeNo) {
        this.invoiceNo = invoiceNo;
        this.amount = amount;
        this.paymentDate = paymentDate;
        this.paymentMode = paymentMode;
        this.chequeNo = chequeNo;
    }
}