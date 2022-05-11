import depositRepo from "../repository/deposit-repo.js";


export default class DepositService {
  async getDeposits(req, res) {
    try {
      const depositId = req.query.depositId;
      if (depositId) {
        const deposit = await depositRepo.getDepositById(depositId);
        res.json(deposit);
      } else {
        const deposits = await depositRepo.getAllDeposits();
        res.json(deposits);
      }
    } catch (e) {
      res.json(null)
      //res.status(500).send(e);
    }
  }

  async getAllDeposits(req, res) {
    try {
      const response = await depositRepo.getAllDeposits();
      res.json(response);
    } catch (e) {
      res.status(500).send(e);
      console.log(e);
    }
  }

  async addDeposit(req, res) {
    try {
      const response = await depositRepo.addDeposit(req.body);
      res.json(response);
    } catch (e) {
      res.status(500).send(e);
    }
  }

  async deleteDeposit(req, res) {
    try {
      const response = await depositRepo.deleteDeposit(req.params.depositId);
      res.json(response);
    } catch (e) {
      res.status(500).send(e);
    }
  }

  async updateDeposit(req, res) {
    try {
      const response = await depositRepo.updateDeposit(req.body);
      res.json(response);
    } catch (e) {
      res.status(500).send(e);
    }
  }

  async deleteAllDeposits(req, res) {
    try {
      const response = await depositRepo.deleteAllDeposits();
      res.json(response);
    } catch (e) {
      res.status(500).send(e);
    }
  }

  async getDepositByDepositDate(req, res) {
    try {
      const Deposits = await depositRepo.getDepositByDepositDate(
        req.query.date
      );
      res.json(Deposits);
    } catch (e) {
      res.status(500).send(e);
    }
  }

  async getDepositByStatus(req, res) {
    try {
      const Deposits = await depositRepo.getDepositByStatus(req.query.status);
      res.json(Deposits);
    } catch (e) {
      res.status(500).send(e);
    }
  }
}
