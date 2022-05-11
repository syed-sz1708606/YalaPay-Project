import Cheque from "../model/cheque.js";

class ChequeRepo {
  async addCheque(cheque) {
    return await Cheque.create(cheque);
  }

  async updateCheque(updatedCheque) {
    return await Cheque.findByIdAndUpdate(updatedCheque._id, updatedCheque);
  }

  async deleteCheque(chequeId) {
    return await Cheque.deleteOne({ _id: chequeId });
  }
  async deleteChequeByPaymentId(paymentId) {
    return Cheque.deleteOne({ paymentId });
  }
  async getCheque(chequeId) {
    return await Cheque.findOne({ _id: chequeId });
  }

  async getChequeByChequeNo(chequeNo) {
    return await Cheque.findOne({ chequeNo });
  }

  async getAllCheques() {
    return await Cheque.find();
  }

  async getAwaitingCheques() {
    return await Cheque.find({ status: "Awaiting" });
  }
  async getChequeByPaymentId(paymentId) {
    return await Cheque.findOne({ paymentId });
  }

  getChequeStats(status) {
    return Cheque.aggregate([
      {
        $match: {
          status: `${status}`,
        },
      },
      {
        $group: {
          _id: null,
          amountSum: {
            $sum: "$amount",
          },
        },
      },
    ]);
  }
}

export default new ChequeRepo();
