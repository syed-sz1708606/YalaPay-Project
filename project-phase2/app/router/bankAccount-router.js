import express from "express";
import accountService from "../service/bankAccount-service.js"

const accountRouter = express.Router();

accountRouter
    .route("/")
    .get(accountService.getAccounts)
    .post(accountService.addAccount)

export default accountRouter;
