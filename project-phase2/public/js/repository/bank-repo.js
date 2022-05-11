class BankRepo {

  async getBanks() {
    const data = await fetch("/api/banks");
    const banks = await data.json();
    return banks;
  }
  
}
export default new BankRepo();
