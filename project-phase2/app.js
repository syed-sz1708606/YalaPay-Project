import express from "express";
import morgan from "morgan";
import mongoose from "mongoose";
import userRouter from "./app/router/user-router.js";
import customerRouter from "./app/router/customer-router.js";
import invoiceRouter from "./app/router/invoice-router.js";
import paymentRouter from "./app/router/payment-router.js";
import accountRouter from "./app/router/bankAccount-router.js";
import depositRouter from "./app/router/deposit-router.js";
import chequeRouter from "./app/router/cheque-router.js";
import bankRouter from "./app/router/bank-router.js";

import account from "./app/repository/bankAccount-repo.js";
import customer from "./app/repository/customer-repo.js";
import user from "./app/repository/user-repo.js";
import bank from "./app/repository/bank-repo.js";

const port = process.env.PORT || 9090;
const app = express();

const uri = "mongodb://127.0.0.1:27017/YalaPay";
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  autoIndex: true, //make this true
};

mongoose.connect(uri, options, () => {
  console.log(`Connected to database.`);
});

app.use(express.static("public"));
app.use(express.json());
app.use(morgan("tiny"));

app.use("/api/users", userRouter);
app.use("/api/customers", customerRouter);
app.use("/api/invoices", invoiceRouter);
app.use("/api/payments", paymentRouter);
app.use("/api/deposits", depositRouter);
app.use("/api/accounts", accountRouter);
app.use("/api/cheques", chequeRouter);
app.use("/api/banks", bankRouter);

app.listen(port, () => {
  console.log(`server listening on http://localhost:${port}`);

  user.init(); // works
  account.init(); // works
  customer.init(); // works
  bank.init(); // works
});
