import Bank from "../model/banks.js";
import fs from "fs-extra";

class BankRepo {

  async getBanks() {
    return await Bank.find();
  }

  async init() {
    try {
      const flag = await Bank.countDocuments({});

      if (!flag) {
        const data = await fs.readJson("./app/data/banks.json");
        data.forEach(async (ele) => {
          await Bank.create(ele);
        });
      }
    } catch (e) {
      console.error(e);
    }
  }
}

export default new BankRepo();
