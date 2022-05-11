import accountRepo from "../repository/bankAccount-repo.js";

class AccountService {
    async getAccounts(req, res) {
        try {
            const id = req.query.id;
            if (id) {
                const account = await accountRepo.getAccount(id);
                res.json(account);
            } else {
                const accounts = await accountRepo.getAllAccounts();
                res.json(accounts);
            }
        } catch (e) {
            res.status(500).send(e);
        }
    }

    async addAccount(req, res) {
        try {
            const response = await accountRepo.addAccount(req.body);
            res.json(response);
        } catch (e) {
            res.status(500).send(e);
        }
    }
}

export default new AccountService()