import mongoose from "mongoose";
import BankAccount from "../model/bank-accounts.js";
import fs from "fs-extra";

class AccountRepo {
  async addAccount(account) {
    return await BankAccount.create(account);
  }

  async getAccount(accountId) {
    return await BankAccount.findOne({ _id: accountId });
  }

  async getAllAccounts() {
    return await BankAccount.find();
  }

  async init() {
    try {
      const flag = await BankAccount.countDocuments({});

      if (!flag) {
        const data = await fs.readJson("./app/data/bank-accounts.json");
        data.forEach(async (ele) => {
          await BankAccount.create(ele);
        });
      }
    } catch (e) {
      console.error(e);
    }
  }
}

export default new AccountRepo();
