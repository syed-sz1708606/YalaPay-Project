const db = new Localbase('yalapay.db')

export class ChequeRepo {
    addCheque(cheque) {
        try {
            return db.collection('cheque').add(cheque)
        } catch (e) {
            console.log(e)
        }
    }

    updateCheque(updatedCheque) {
        try {
            return db.collection('cheque').doc({ chequeNo: updatedCheque.chequeNo }).update(updatedCheque)
        } catch (e) {
            console.log(e)
        }
    }

    deleteCheque(chequeNo) {
        try {
            return db.collection('cheque').doc({ chequeNo }).delete()
        } catch (e) {
            console.log(e)
        }
    }

    async getChequeById(chequeNo) {
        try {
            const cheques = await this.getAllCheques()
            for (const cheque of cheques) {
                if (cheque.chequeNo == chequeNo) return cheque;
            }
            return undefined;
        } catch (e) {
            console.log(e)
        }
    }

    getAllCheques() {
        try {
            return db
                .collection('cheque')
                .get()
        } catch (e) {
            console.log(e)
        }
    }

    async getAwaitingCheques() {
        try {
           // const awaitingCheques = [];
            const cheques = await this.getAllCheques()
            const awaitingCheques = cheques.filter(cheque => cheque.status == "Awaiting");
            return awaitingCheques;
        } catch (e) {
            console.log(e)
        }
    }
    
}
