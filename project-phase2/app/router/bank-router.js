import bankService from "../service/banks-service.js";
import express from "express"

const bankRouter = express.Router();

bankRouter.route("/")
    .get(bankService.getBanks)

export default bankRouter;