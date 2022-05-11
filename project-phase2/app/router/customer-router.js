import express from "express";
import CustomerService from "../service/customer-service.js";
import paymentRouter from "./payment-router.js";

const customerRouter = express.Router();
const customerService = new CustomerService();

customerRouter
    .route("/")
    .get(customerService.getCustomers)
    .post(customerService.addCustomer)
    .put(customerService.updateCustomer)
    .delete(customerService.deleteAllCustomers);

customerRouter
    .route("/:customerId")
    .delete(customerService.deleteCustomer);

customerRouter.route("/companyName/:companyName")
    .get(customerService.getCustomerByCompanyName)

customerRouter.route("/city/:city")
    .get(customerService.getCustomerByCity)

customerRouter.route("/last/:limit")
    .get(customerService.getLastNoOfCustomers)


export default customerRouter;
