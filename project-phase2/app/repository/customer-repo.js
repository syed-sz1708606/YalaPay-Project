import Customer from "../model/customer.js";
import fs from "fs-extra";

class CustomerRepo {

  async addCustomer(customer) {
    return await Customer.create(customer);
  }

  async getCustomers() {
    return await Customer.find({});
  }

  async getCustomer(customerId) {
    return await Customer.findOne({ _id: customerId });
  }

  async updateCustomer(updatedCustomer) {
    return await Customer.findByIdAndUpdate(updatedCustomer.customerId, updatedCustomer);
  }

  async deleteCustomer(customerId) {
    return await Customer.deleteOne({ _id: customerId });
  }

  async deleteAllCustomers() {
    return await Customer.deleteMany({});
  }

  async getCustomerByCompanyName(companyName) {
    return await Customer.findOne({ companyName: companyName });
  }

  async getCustomerByCity(city) {
    return await Customer.find({ "address.city": city });
  }

  getLastNoOfCustomers(limit){
    return Customer.find().sort({_id:-1}).limit(limit)
  }

  async init() {
    const flag = await Customer.countDocuments({});

    if (!flag) {
      const data = await fs.readJson('./app/data/customers.json');
      data.forEach(async (ele) => {
        await Customer.create(ele);
      });
    }
  }
}

export default new CustomerRepo()