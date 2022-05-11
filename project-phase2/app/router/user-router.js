import express from "express";

import UserService from "../service/user-service.js";

const userRouter = express.Router();

const userService = new UserService();

userRouter
    .route("/")
    .get(userService.getAllUsers)


userRouter.route("/email/:email")
    .get(userService.getUserByEmail)

export default userRouter;
