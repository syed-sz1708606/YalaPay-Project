import express from "express";
import chequeService from "../service/cheque-service.js"

const chequeRouter = express.Router();

chequeRouter
    .route("/")
    .get(chequeService.getCheques)
    .post(chequeService.addCheque)
    .put(chequeService.updateCheque)

chequeRouter
    .route("/:chequeId")
    .delete(chequeService.deleteCheque);

chequeRouter.route("/awaitingCheques")
    .get(chequeService.getAwaitingCheques)

chequeRouter.route("/payments/:paymentId")
    .get(chequeService.getChequeByPaymentId)
    .delete(chequeService.deleteChequeByPaymentId);

chequeRouter.route("/status/:status")
    .get(chequeService.getChequeStats)

export default chequeRouter;

