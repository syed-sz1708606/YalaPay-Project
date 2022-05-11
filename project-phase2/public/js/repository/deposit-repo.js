class DepositRepo {
  constructor() {
    this.baseUrl = " /api/deposits";
  }

  async addDeposit(deposit) {
    return await fetch(this.baseUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(deposit),
    });
  }

  async getAllDeposits() {
    const data = await fetch(this.baseUrl);
    const deposits = await data.json();
    return deposits;
  }

  async getDeposit(depositId) {
    const data = await fetch(`${this.baseUrl}/?depositId=${depositId}`);
    const deposit = await data.json();
    // Object.setPrototypeOf(customer, Customer.prototype);
    return deposit;
  }

  async updateDeposit(updatedDeposit) {
    return await fetch(this.baseUrl, {
      method: "Put",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedDeposit),
    });
  }

  async deleteDeposit(depositId) {
    return await fetch(`${this.baseUrl}/${depositId}`, {
      method: "Delete",
    });
  }

  async getDepositByDepositDate(date) {
    const data = await fetch(`${this.baseUrl}/date/${date}`);
    const deposits = await data.json();
    return deposits;
  }

  async getDepositByStatus(status) {
    const data = await fetch(`${this.baseUrl}/status/${status}`);
    const deposits = await data.json();
    return deposits;
  }
}

export default new DepositRepo();
