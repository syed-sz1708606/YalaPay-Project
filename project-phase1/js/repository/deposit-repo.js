const db = new Localbase('yalapay.db')

export class DepositRepo {
    addDeposit(deposit) {
        try {
            return db.collection('deposit').add(deposit)
        } catch (e) {
            console.log(e)
        }
    }

    updateDeposit(updatedDeposit) {
        try {
            return db.collection('deposit').doc({ depositId: updatedDeposit.depositId }).update(updatedDeposit)
        } catch (e) {
            console.log(e)
        }
    }

    deleteDeposit(depositId) {
        try {
            return db.collection('deposit').doc({ depositId }).delete()
        } catch (e) {
            console.log(e)
        }
    }

    async getDepositById(depositId) {
        try {
            const deposits = await this.getAllDeposits()
            for (const deposit of deposits) {
                if (deposit.depositId == depositId) return deposit
            }
            return undefined;
        } catch (e) {
            console.log(e)
        }
    }

    async getDepositByDepositDate(date) {
        const resultDeposits = [];
        try {
            const deposits = await this.getAllDeposits()
            for (const deposit of deposits) {
                if (new Date(deposit.depositDate).getTime() == date.getTime()) resultDeposits.push(deposit);
            }
            return resultDeposits;
        } catch (e) {
            console.log(e)
        }
    }

    async getDepositByStatus(status) {
        const resultDeposits = [];
        try {
            const deposits = await this.getAllDeposits()
            for (const deposit of deposits) {
                if (deposit.depositStatus.toLowerCase() == status.toLowerCase()) resultDeposits.push(deposit);
            }
            return resultDeposits;
        } catch (e) {
            console.log(e)
        }
    }

    getAllDeposits() {
        try {
            return db
                .collection('deposit')
                .get()
        } catch (e) {
            console.log(e)
        }
    }

    async getNewId() {
        try {
            const depositsList = await this.getAllDeposits();
            const newId = (depositsList[depositsList.length - 1].depositId) + 1;
            return newId;
        } catch (e) {
            console.log(e)
        }
    }
}
