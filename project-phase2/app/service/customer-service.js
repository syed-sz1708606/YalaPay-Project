import customerRepo from "../repository/customer-repo.js";
import invoiceRepo from "../repository/invoice-repo.js";
import paymentRepo from "../repository/payment-repo.js";

export default class CustomerService {
  async getCustomers(req, res) {
    try {
      const id = req.query.customerId;
      if (id) {
        const Customer = await customerRepo.getCustomer(id);
        res.json(Customer);
      } else {
        const Customers = await customerRepo.getCustomers();
        res.json(Customers);
      }
    } catch (e) {
      res.status(500).send(e);
    }
  }

  async addCustomer(req, res) {
    try {
      const response = await customerRepo.addCustomer(req.body);
      res.json(response);
    } catch (e) {
      console.log(e);
      res.status(500).send(e);
    }
  }

  async deleteCustomer(req, res) {
    try {
      const response = await customerRepo.deleteCustomer(req.params.customerId);
      const invoices = await invoiceRepo.getAllInvoices()
      for (const invoice of invoices) {
        //TODO: Delete cheque associated with payment
        await paymentRepo.deletePaymentsByInvoice(invoice._id)
      }
      await invoiceRepo.deleteInvoicesByCustomer(req.params.customerId)
      res.json(response);
    } catch (e) {
      res.status(500).send(e);
    }
  }

  async updateCustomer(req, res) {
    try {
      const response = await customerRepo.updateCustomer(req.body);
      res.json(response);
    } catch (e) {
      res.status(500).send(e);
    }
  }

  async deleteAllCustomers(req, res) {
    try {
      const response = await customerRepo.deleteAllCustomers();
      res.json(response);
    } catch (e) {
      res.status(500).send(e);
    }
  }

  async getCustomerByCompanyName(req, res) {
    try {
      const companyName = req.params.companyName;
      console.log(companyName);
      const response = await customerRepo.getCustomerByCompanyName(companyName);
      res.json(response);
    } catch (e) {
      res.status(500).send(e);
      console.log(e);
    }
  }

  async getCustomerByCity(req, res) {
    try {
      const city = req.params.city;
      const response = await customerRepo.getCustomerByCity(city);
      res.json(response);
    } catch (e) {
      res.status(500).send(e);
      console.log(e);
    }
  }
  async getLastNoOfCustomers(req, res) {
    try {
      const limit = req.params.limit;
      const response = await customerRepo.getLastNoOfCustomers(limit)
      res.json(response);
    } catch (e) {
      console.log(e)
      res.status(500).send(e);
    }
  }
}
