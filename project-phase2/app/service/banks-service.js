import bankRepo from "../repository/bank-repo.js";

class BankService {
  async getBanks(req, res) {
    try {
      const banks = await bankRepo.getBanks();
      res.json(banks);
    } catch (e) {
      res.status(500).send(e);
    }
  }
}

export default new BankService()
