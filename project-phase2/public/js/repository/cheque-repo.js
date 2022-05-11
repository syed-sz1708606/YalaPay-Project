class ChequeRepo {
    constructor() {
        this.baseUrl = " /api/cheques";
    }

    async addCheque(cheque) {
        return await fetch(this.baseUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(cheque)
        });
    }

    async getAllCheques() {
        const data = await fetch(this.baseUrl)
        const cheques = await data.json()
        return cheques
    }

    async getCheque(chequeId) {
        const data = await fetch(`${this.baseUrl}?id=${chequeId}`)
        const cheque = await data.json()
        return cheque
    }

    async getChequeByChequeNo(chequeNo) {
        const data = await fetch(`${this.baseUrl}?chequeNo=${chequeNo}`)
        const cheque = await data.json()
        return cheque
    }

    async getChequeByPaymentId(paymentId) {
        const data = await fetch(`${this.baseUrl}/payments/${paymentId}`)
        const cheques = await data.json()
        return cheques
    }
    async deleteChequeByPaymentId(paymentId) {
        return await fetch(`${this.baseUrl}/payments/${paymentId}`, {
            method: 'Delete'
        });
    }

    async updateCheque(updatedCheque) {
        return await fetch(this.baseUrl, {
            method: 'Put',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedCheque)
        });
    }

    async deleteCheque(chequeNo) {
        return await fetch(`${this.baseUrl}/${chequeNo}`, {
            method: 'Delete'
        });
    }

    async getAwaitingCheques() {
        const data = await fetch(`${this.baseUrl}/awaitingCheques`)
        const cheques = await data.json()
        return cheques
    }

    async getChequeStats(status) {
        const data = await fetch(`${this.baseUrl}/status/${status}`)
        const cheque = await data.json()
        if (cheque.length != 0)
            return cheque[0].amountSum
        return 0
    }
}

export default new ChequeRepo()
