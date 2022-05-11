import chequeRepo from "../repository/cheque-repo.js";

class ChequeService {
    async getCheques(req, res) {
        try {
            const chequeNo = req.query.chequeNo;
            const id = req.query.id;
            if (chequeNo) {
                const cheque = await chequeRepo.getChequeByChequeNo(chequeNo);
                console.log("called")
                res.json(cheque);
            } else if (id) {
                const cheque = await chequeRepo.getCheque(id);
                res.json(cheque);
            } else {
                const cheques = await chequeRepo.getAllCheques();
                res.json(cheques);
            }
        } catch (e) {
            res.status(500).send(e);
        }
    }

    async addCheque(req, res) {
        try {
            const response = await chequeRepo.addCheque(req.body);
            res.json(response);
        } catch (e) {
            console.log(e);
            res.status(500).send(e);
        }
    }

    async deleteCheque(req, res) {
        try {
            const response = await chequeRepo.deleteCheque(req.params.chequeNo);
            res.json(response);
        } catch (e) {
            res.status(500).send(e);
        }
    }

    async updateCheque(req, res) {
        try {
            const response = await chequeRepo.updateCheque(req.body);
            res.json(response);
        } catch (e) {
            res.status(500).send(e);
        }
    }

    async getAwaitingCheques(req, res) {
        try {
            const response = await chequeRepo.getAwaitingCheques();
            res.json(response);
        } catch (e) {
            res.status(500).send(e);
        }
    }
    async getChequeByPaymentId(req, res) {
        try {
            const id = req.params.paymentId
            const response = await chequeRepo.getChequeByPaymentId(id);
            res.json(response);
        } catch (e) {
            res.status(500).send(e);
        }
    }
    async deleteChequeByPaymentId(req, res) {
        try {
            const id = req.params.paymentId
            const response = await chequeRepo.deleteChequeByPaymentId(id);
            res.json(response);
        } catch (e) {
            res.status(500).send(e);
        }
    }
    async getChequeStats(req, res) {
        try {
            const status = req.params.status
            const response = await chequeRepo.getChequeStats(status);
            res.json(response);
        } catch (e) {
            res.status(500).send(e);
        }
    }

}

export default new ChequeService()