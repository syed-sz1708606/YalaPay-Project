import ChequeDeposit from "../model/cheque-deposits.js";

class DepositRepo {
  async addDeposit(deposit) {
    return await ChequeDeposit.create(deposit);
  }

  async updateDeposit(updatedDeposit) {
    return await ChequeDeposit.findByIdAndUpdate(updatedDeposit._id, updatedDeposit);
  }

  async deleteDeposit(depositId) {
    return await ChequeDeposit.deleteOne({ _id: depositId });
  }

  async getDepositById(depositId) {
    return await ChequeDeposit.findOne({ _id: depositId });
  }

  async getDepositByDepositDate(date) {
    return await ChequeDeposit.find({ depositDate: date });
  }

  async getDepositByStatus(status) {
    return await ChequeDeposit.find({ depositStatus: status });
  }

  async getAllDeposits() {
    return await ChequeDeposit.find({});
  }
}


export default new DepositRepo(); 