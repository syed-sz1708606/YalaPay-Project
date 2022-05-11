export class Cheque {
    constructor(chequeNo,amount, drawer, bankName, status, receivedDate, dueDate, chequeImageUri, paymentId) {
        this.chequeNo = chequeNo;
        this.amount = amount;
        this.drawer = drawer;
        this.bankName = bankName;
        this.status = status;
        this.receivedDate = receivedDate;
        this.dueDate = dueDate;
        this.chequeImageUri = chequeImageUri;
        this.paymentId = paymentId;
    }
}