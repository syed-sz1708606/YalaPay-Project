class AccountRepo {
    constructor() {
        this.baseUrl = " /api/accounts";
    }

    async getAllAccounts() {
        const data = await fetch(this.baseUrl)
        const accounts = await data.json()
        return accounts
    }

    async getAccount(accountId) {
        const data = await fetch(`${this.baseUrl}?id=${accountId}`)
        const account = await data.json()
        return account
    }
}

export default new AccountRepo()
