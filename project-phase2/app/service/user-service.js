import userRepo from "../repository/user-repo.js";

export default class UserServices {
  async getUserByEmail(req, res) {
    try {
      const id = req.params.email;
      if (id) {
        const user = await userRepo.getUserByEmail(id);
        res.json(user);
      } else {
        const users = await userRepo.getAllUsers();
        res.json(users);
      }
    } catch (e) {
      res.status(500).send(e);
    }
  }

  async getAllUsers(req, res) {
    try {
      const users = await userRepo.getAllUsers();
      res.json(users);
    } catch (e) {
      res.status(500).send(e);
    }
  }
}
