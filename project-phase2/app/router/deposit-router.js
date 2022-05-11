import express from "express";
import DepositService from "../service/deposit-service.js";

const depositRouter = express.Router();
const depositService = new DepositService();

depositRouter
    .route("/")
    .get(depositService.getDeposits)
    .post(depositService.addDeposit)
    .put(depositService.updateDeposit)
    .delete(depositService.deleteAllDeposits);

depositRouter.route("/:depositId")
    .delete(depositService.deleteDeposit);

depositRouter.route("/date/:date")
    .get(depositService.getDepositByDepositDate);

depositRouter.route("/status/:status")
    .get(depositService.getDepositByStatus);

export default depositRouter;
