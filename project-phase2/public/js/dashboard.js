/** imports */
import  customerRepo  from "./repository/customer-repo.js";
import  invoiceRepo  from "./repository/invoice-repo.js";
import  paymentRepo  from "./repository/payment-repo.js";
import  chequeRepo  from "./repository/cheque-repo.js";
import  depositRepo  from "./repository/deposit-repo.js";
import  accountRepo  from "./repository/bankAccount-repo.js";


/** DOM variables */
const invoiceTotal = document.querySelector('#total')
const dueWithin30Days = document.querySelector('#due30Days')
const dueAfter30Days = document.querySelector('#due30MoreDays')
const chequeAwait = document.querySelector('#Awaiting')
const chequeDeposit = document.querySelector('#deposited')
const chequeCashed = document.querySelector('#cashed')
const chequeReturned = document.querySelector('#returned')
const latestCustomers = document.querySelector('#latest-customers')
const latestPayments = document.querySelector('#latest-payments')

/** Global variables */
let totalAmount30Days = 0.0, totalDueAfter30Days = 0.0, totalAmount = 0.0;

/** Methods */
document.addEventListener("DOMContentLoaded", async () => {

    /** FETCH DATA FROM JSON */

  /*  //Customers
    let customers = await customerRepo.getAllCustomers();
    if (customers.length === 0) {
        const url = "../data/customers.json";
        const response = await fetch(url);
        customers = await response.json();

        for (const customer of customers) await customerRepo.addCustomer(customer);
    }

    //Invoices
    let invoices = await invoiceRepo.getAllInvoices();
    if (invoices.length === 0) {
        const url = "../data/invoices.json";
        const response = await fetch(url);
        invoices = await response.json();

        for (const invoice of invoices) await invoiceRepo.addInvoice(invoice);
    }

    //Payments
    let payments = await paymentRepo.getAllPayments();
    if (payments.length === 0) {
        const url = "../data/payments.json";
        const response = await fetch(url);
        payments = await response.json();

        for (const payment of payments) await paymentRepo.addPayment(payment);
    }

    //Cheques
    let cheques = await chequeRepo.getAllCheques();
    if (cheques.length === 0) {
        const url = "../data/cheques.json";
        const response = await fetch(url);
        cheques = await response.json();

        for (const cheque of cheques) await chequeRepo.addCheque(cheque);
    }

    //Deposits
    let deposits = await depositRepo.getAllDeposits();
    if (deposits.length === 0) {
        const url = "../data/cheque-deposits.json";
        const response = await fetch(url);
        deposits = await response.json();

        for (const deposit of deposits) await depositRepo.addDeposit(deposit);
    }

    //Bank Accounts 
    let accounts = await accountRepo.getAllAccounts();
    if (accounts.length === 0) {
        const url = "../data/bank-accounts.json";
        const response = await fetch(url);
        accounts = await response.json();

        for (const account of accounts) await accountRepo.addAccount(account);
    }
*/
    await displayUpdates();
    await displayInvoiceStats();
    await displayChequeStats();

});


async function displayUpdates() {
    let customerList = "";
    let paymentList = "";
    let j = 0;
    let i = 0;
    const payments = await paymentRepo.getLastNoOfPayments(3)
    const customers = await customerRepo.getLastNoOfCustomers(3)
    console.log(payments)
    console.log(customers)
    //const customers = await customertRepo.getLastNoOfCustomers(3)
   // payments.length > 3 ? i = payments.length - 3 : i = 0;
   // customers.length > 3 ? j = customers.length - 3 : j = 0;



    for (; i < payments.length; i++) {
        paymentList += listPayments(payments[i])
    }
   for (; j < customers.length; j++) {
        customerList += listCustomers(customers[j])
    }

    latestCustomers.innerHTML = `<table>
        <thead>
        <th>ID</th>
        <th>Company Name</th>
        <th>Mobile</th>
        </thead>
        ${customerList}
    </table>`

    latestPayments.innerHTML = `<table>
        <thead>
        <th>Payment Date</th>
        <th>Invoice No</th>
        <th>Payment amount</th>
        </thead>
        ${paymentList}
    </table>`
}

function listPayments(payment) {
    return `
    <tr>
        <td data-heading="Payment Date">${new Date(payment.paymentDate).toDateString()}</td>
        <td data-heading="Payment Invoice">${payment.invoiceNo}</td>
        <td data-heading="Amount">${payment.amount}</td>
    </tr>`
}
function listCustomers(customer) {
    return ` <tr>
        <td data-heading="Customer ID">${customer.customerId}</td>
        <td data-heading="Company Name">${customer.companyName}</td>
        <td data-heading="Mobile">${customer.contactDetails.mobile}</td>
            </tr>`
}

async function displayInvoiceStats() {
    //getInvoicesDueDate(invoicesData)
    const amount =   await invoiceRepo.getTotalAmountOfInvoices()
    invoiceTotal.innerHTML += " $" + amount.toFixed(2)
    dueWithin30Days.innerHTML += " $" +  (await invoiceRepo.getInvoiceDueDates("less")).toFixed(2)
    dueAfter30Days.innerHTML += " $" + (await invoiceRepo.getInvoiceDueDates("greatEqual")).toFixed(2)
}

function getInvoicesDueDate(invoices) {
    let getTime, getDays;

/*    getInvoiceDueDates
    totalAmount30Days = getInvoiceDueDates*/

    /*for (const invoice of invoices) {

        //returns date in milliseconds
        const dateNow = new Date()
        const dueDate = new Date(invoice.dueDate)
        getTime = dueDate - dateNow
        getDays = (getTime) / (1000 * 24 * 3600)

        totalAmount += invoice.amount;

        /!*if (getDays < 30 && getDays > -1) totalAmount30Days += invoice.amount
        else if (getDays > 30) totalDueAfter30Days += invoice.amount*!/
    }*/
}

async function displayChequeStats() {
    let awaiting = 0.0, cashed = 0.0, returned = 0.0, deposited = 0.0;
    /*for (const cheque of chequesData) {
        if (cheque.status === "Awaiting")
            awaiting += cheque.amount
        else if (cheque.status === "Cashed")
            cashed += cheque.amount
        else if (cheque.status === "Returned")
            returned += cheque.amount
        else if (cheque.status === "Deposited")
            deposited += cheque.amount
    }
*/
    chequeAwait.innerHTML += " $" + (await displayTotalAmount("Awaiting")).toFixed(2)
    chequeDeposit.innerHTML += " $" + (await displayTotalAmount("Deposited")).toFixed(2)
    chequeCashed.innerHTML += " $" + (await displayTotalAmount("Cashed")).toFixed(2)
    chequeReturned.innerHTML += " $" + (await displayTotalAmount("Returned")).toFixed(2)
}
async function displayTotalAmount(status){

    return await chequeRepo.getChequeStats(status)
}