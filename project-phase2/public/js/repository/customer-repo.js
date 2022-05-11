import Customer from "../model/customer.js";

class CustomerRepo {
  constructor() {
    this.baseUrl = " /api/customers";
  }

  async addCustomer(customer) {
    return await fetch(`${this.baseUrl}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(customer),
    });
  }

  async getAllCustomers() {
    const data = await fetch(this.baseUrl);
    const customers = await data.json();
    customers.map((e) => Object.setPrototypeOf(e, Customer.prototype));
    return customers;
  }

  async getCustomer(customerId) {
    const data = await fetch(`${this.baseUrl}/?customerId=${customerId}`);
    const customer = await data.json();
    Object.setPrototypeOf(customer, Customer.prototype);
    return customer;
  }

  async updateCustomer(updatedCustomer) {
    console.log('hello')
    console.log(updatedCustomer.companyName);
    return await fetch(`${this.baseUrl}`, {
      method: "Put",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedCustomer),
    });
  }

  async deleteCustomer(customerId) {
    return await fetch(`${this.baseUrl}/${customerId}`, {
      method: "Delete",
    });
  }

  async deleteAllCustomers() {
    return await fetch(`${this.baseUrl}`, {
      method: "Delete",
    });
  }

  async getCustomerByCompanyName(companyName) {
    const data = await fetch(`${this.baseUrl}/companyName/${companyName}`);
    const customer = await data.json();
    Object.setPrototypeOf(customer, Customer.prototype);
    return customer;
  }

  async getCustomerByCity(city) {
    const data = await fetch(`${this.baseUrl}/city/${city}`);
    const customers = await data.json();
    customers.map((e) => Object.setPrototypeOf(e, Customer.prototype));
    return customers;
  }
  async getLastNoOfCustomers(limit) {
    const data = await fetch(`${this.baseUrl}/last/${limit}`)
    const customers = await data.json()
    console.log(customers)
    if(customers.length != 0) {
      console.log("inside if statment")
      console.log(customers)
      return customers
    }
    return null
  }
}

export default new CustomerRepo();
