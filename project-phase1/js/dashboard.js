/** imports */
import { CustomerRepo } from "./repository/customer-repo.js";
import { InvoiceRepo } from "./repository/invoice-repo.js";
import { PaymentRepo } from "./repository/payment-repo.js";
import { ChequeRepo } from "./repository/cheque-repo.js";
import { DepositRepo } from "./repository/deposit-repo.js";
import { AccountRepo } from "./repository/bankAccount-repo.js";

/** Repositories */

const invoiceRepo = new InvoiceRepo();
const customerRepo = new CustomerRepo();
const paymentRepo = new PaymentRepo();
const chequeRepo = new ChequeRepo();
const depositRepo = new DepositRepo();
const accountRepo = new AccountRepo();

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

    //Customers
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

    displayUpdates(customers, payments);
    displayInvoiceStats(invoices);
    displayChequeStats(cheques);

});


function displayUpdates(customers, payments) {
    let customerList = "";
    let paymentList = "";
    let j = 0;
    let i = 0;

    payments.length > 3 ? i = payments.length - 3 : i = 0;
    customers.length > 3 ? j = customers.length - 3 : j = 0;

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
        <td data-heading="Payment Date">${payment.paymentDate}</td>
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

function displayInvoiceStats(invoicesData) {
    getInvoicesDueDate(invoicesData)

    invoiceTotal.innerHTML += " $" + totalAmount.toFixed(2)
    dueWithin30Days.innerHTML += " $" + totalAmount30Days.toFixed(2)
    dueAfter30Days.innerHTML += " $" + totalDueAfter30Days.toFixed(2)
}

function getInvoicesDueDate(invoices) {
    let getTime, getDays;

    for (const invoice of invoices) {

        //returns date in milliseconds
        const dateNow = new Date()
        const dueDate = new Date(invoice.dueDate)
        getTime = dueDate - dateNow
        getDays = (getTime) / (1000 * 24 * 3600)

        totalAmount += invoice.amount;

        if (getDays < 30 && getDays > -1) totalAmount30Days += invoice.amount
        else if (getDays > 30) totalDueAfter30Days += invoice.amount
    }
}

function displayChequeStats(chequesData) {
    let awaiting = 0.0, cashed = 0.0, returned = 0.0, deposited = 0.0;
    for (const cheque of chequesData) {
        if (cheque.status === "Awaiting")
            awaiting += cheque.amount
        else if (cheque.status === "Cashed")
            cashed += cheque.amount
        else if (cheque.status === "Returned")
            returned += cheque.amount
        else if (cheque.status === "Deposited")
            deposited += cheque.amount
    }

    chequeAwait.innerHTML += " $" + awaiting.toFixed(2)
    chequeDeposit.innerHTML += " $" + deposited.toFixed(2)
    chequeCashed.innerHTML += " $" + cashed.toFixed(2)
    chequeReturned.innerHTML += " $" + returned.toFixed(2)
}