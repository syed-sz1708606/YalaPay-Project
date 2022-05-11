import User from "../model/user.js";
import fs from "fs-extra";

class UserRepo {
  getUserByEmail(email) {
    return User.findOne({ email });
  }

  getAllUsers() {
    return User.find();
  }

  async init() {
    const flag = await User.countDocuments({});

    if (!flag) {
      const data = await fs.readJson("./app/data/users.json");
      data.forEach(async (ele) => {
        await User.create(ele);
      });
    }
  }
}

export default new UserRepo();
