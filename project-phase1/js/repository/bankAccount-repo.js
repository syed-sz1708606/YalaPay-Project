const db = new Localbase('yalapay.db')

export class AccountRepo {
    addAccount(bankAccount) {
        try {
            return db.collection('accounts').add(bankAccount)
        } catch (e) {
            console.log(e)
        }
    }

    async getAccountById(accountNo) {
        try {
            const accounts = await this.getAllAccounts()
            for (const account of accounts) {
                if (account.accountNo == accountNo) return account
            }
            return undefined;
        } catch (e) {
            console.log(e)
        }
    }

    getAllAccounts() {
        try {
            return db
                .collection('accounts')
                .get()
        } catch (e) {
            console.log(e)
        }
    }
}
