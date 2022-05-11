export class Deposit {
  constructor(depositId, depositDate, bankAccountNo, depositStatus = 'Deposited', chequeNos) {
    this.depositId = depositId;
    this.depositDate = depositDate;
    this.bankAccountNo = bankAccountNo;
    this.depositStatus = depositStatus;
    this.chequeNos = chequeNos;
  }
}
