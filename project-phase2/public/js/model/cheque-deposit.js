export default class Deposit {
  constructor(depositDate, bankAccountId, depositStatus = 'Deposited', chequeNos) {
    this.depositDate = depositDate;
    this.bankAccountId = bankAccountId;
    this.depositStatus = depositStatus;
    this.chequeNos = chequeNos;
  }
}