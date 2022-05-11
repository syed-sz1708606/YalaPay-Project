import invoiceRepo from "./repository/invoice-repo.js";
import customerRepo from "./repository/customer-repo.js";
import chequeRepo from "./repository/cheque-repo.js";
import paymentRepo from "./repository/payment-repo.js";

import { Invoice } from "./model/invoice.js";

let mainContent;

let invoiceTableHead = `
    <table class='invoice-list'>
        <thead>
            <th>Invoice No</th>
            <th>Customer</th>
            <th>Amount</td>
            <th>Invoice Date</th>
            <th>Due Date</th>
            <th>Actions</th>
        </thead>`

document.addEventListener("DOMContentLoaded", async () => {
    mainContent = document.querySelector('.main-content')
    await displayInvoices()

    document.querySelector('.list-btn').addEventListener('click', displayInvoices)
    document.querySelector('.add-btn').addEventListener('click', loadAddInvoice)
    document.querySelector('.search-btn').addEventListener('click', searchInvoice)

    window.deleteInvoice = deleteInvoice
    window.updateInvoice = updateInvoice
    window.managePayments = managePayments
});

async function loadPage(pageName) {
    const pageContent = await fetch(`../html/${pageName}`)
    mainContent.innerHTML = await pageContent.text()
}

async function displayInvoices() {
    const invoices = await invoiceRepo.getAllInvoices()
    let tableBody = ""

    for (const invoice of invoices) {
        tableBody += await invoiceToTableRow(invoice);
    }

    mainContent.innerHTML = `
        ${invoiceTableHead}
            <tbody>
                ${tableBody}
            </tbody>
        </table>`
}

async function loadAddInvoice() {
    await loadPage('partial-views/add-invoice.html')

    const customerSelect = document.querySelector('#customerId')
    const customers = await customerRepo.getAllCustomers()
    const customerOptions = customers.map(customer => `<option value=${customer.customerId}>${customer.companyName} (${customer.customerId})</option>`).join('')
    customerSelect.innerHTML = "<option value='' disabled selected>Select Customer</option>" + customerOptions
    document.querySelector('#invoiceDate').valueAsDate = new Date()

    document.querySelector('#submit-add-btn').addEventListener('click', addInvoice)
}

async function searchInvoice() {
    const searchCriteria = document.querySelector(".search-criteria").value
    const searchInput = document.querySelector(".search-input").value
    let tableBody = "", invoice;

    if (searchCriteria == "byId") {
        const invoiceId = searchInput
        if (!invoiceId) return window.alert(`Invalid search query.`)
        invoice = await invoiceRepo.getInvoice(invoiceId);

        if (!invoice) return window.alert(`No matching invoice found.`);

        const invoiceObj = new Invoice()
        Object.assign(invoiceObj, invoice)
        tableBody = await invoiceToTableRow(invoiceObj)
    }
    else {
        let invoiceList;
        if (searchCriteria == "byCustomerID") {
            const customerId = searchInput
            if (!customerId) return window.alert(`Invalid search query.`)
            invoiceList = await invoiceRepo.getInvoicesByCustomerId(customerId)
        }
        else if (searchCriteria == "byAmount") {
            const amount = parseFloat(searchInput)
            if (!amount) return window.alert(`Invalid search query.`)
            invoiceList = await invoiceRepo.getInvoicesByAmount(amount)
        }
        for (const invoice of invoiceList) {
            tableBody += await invoiceToTableRow(invoice)
        }
    }

    if (!tableBody) return window.alert(`No matching invoice found.`)

    mainContent.innerHTML = `
        ${invoiceTableHead}
            <tbody>
                ${tableBody}
            </tbody>
        </table>`
}

async function addInvoice(event) {
    event.preventDefault()
    let errorCount = 0;

    const invoiceNo = document.querySelector('#invoiceNo').value
    const customerId = document.querySelector('#customerId').value
    const amount = parseFloat(document.querySelector('#amount').value)
    const invoiceDate = document.querySelector('#invoiceDate').value
    const dueDate = document.querySelector('#dueDate').value

    if (!customerId) {
        document.querySelector('#customerId').parentElement
            .setAttribute('data-error', "Customer ID is required!")
        document.querySelector('#customerId').setAttribute('class', "error")
        errorCount++;
    }
    if (!amount) {
        document.querySelector('#amount').parentElement.setAttribute('data-error', "Invoice Amount is required!")
        document.querySelector('#amount').setAttribute('class', "error")

        errorCount++;
    }
    if (!invoiceDate) {
        document.querySelector('#invoiceDate').parentElement
            .setAttribute('data-error', "Invoice Date is required!")
        document.querySelector('#invoiceDate').setAttribute('class', "error")
        errorCount++;
    }
    if (!dueDate) {
        document.querySelector('#dueDate').parentElement
            .setAttribute('data-error', "Invoice Due Date is required!")
        document.querySelector('#dueDate').setAttribute('class', "error")
        errorCount++;
    }
    if ((new Date(dueDate) - new Date(invoiceDate)) < 0) {
        document.querySelector('#dueDate').parentElement
            .setAttribute('data-error', "Due date must be after invoice date!")
        document.querySelector('#dueDate').setAttribute('class', "error")
        errorCount++;
    }
    if (errorCount > 0) {
        window.alert('Please fill out all information!')
        return
    }

    const invoice = new Invoice(customerId, amount, invoiceDate, dueDate)

    if (invoiceNo) {
        invoice.invoiceNo = invoiceNo
        await invoiceRepo.updateInvoice(invoice)
        window.alert(`Invoice with ID: ${invoiceNo} updated.`)
    }
    else {
        await invoiceRepo.addInvoice(invoice)
        window.alert(`Invoice added.`)
    }

    await displayInvoices()
}

async function deleteInvoice(invoiceNo) {
    if (!window.confirm(`Are you sure you would like to delete invoice ${invoiceNo}?`)) return

    const invoicePayments = await paymentRepo.getPaymentsByInvoice(invoiceNo)
    // for (const payment of invoicePayments)
    //     await paymentRepo.deletePayment(payment.paymentId);

    await invoiceRepo.deleteInvoice(invoiceNo)
    await displayInvoices();
}

async function updateInvoice(invoiceNo) {
    await loadPage('partial-views/add-invoice.html')
    document.querySelector('form .page-subheading').innerHTML = "Update Invoice"
    document.querySelector('#invoiceNo').value = invoiceNo

    const invoice = await invoiceRepo.getInvoice(invoiceNo)

    const customerSelect = document.querySelector('#customerId')

    const customers = await customerRepo.getAllCustomers()
    let customerOptions = ""
    customers.forEach(customer => {
        if (customer.customerId == invoice.customerId)
            customerOptions += `<option value=${customer.customerId} selected>${customer.companyName} (${customer.customerId})</option>`
        else
            customerOptions += `<option value=${customer.customerId}>${customer.companyName} (${customer.customerId})</option>`
    })
    customerSelect.innerHTML = customerOptions

    document.querySelector('#amount').value = invoice.amount
    document.querySelector('#invoiceDate').valueAsDate = new Date(invoice.invoiceDate)
    document.querySelector('#dueDate').valueAsDate = new Date(invoice.dueDate)

    document.querySelector('#submit-add-btn').addEventListener('click', addInvoice)
}

async function managePayments(invoiceNo) {
    window.location.href = "./manage-payments.html?invoiceNo=" + invoiceNo
}

async function getBalance(invoice) {
    //TODO: Maybe implement using mongo aggregate fn
    let balance = invoice.amount
    const payments = await paymentRepo.getPaymentsByInvoice(invoice.invoiceNo)
    for (const payment of payments) {
        if (payment.paymentMode == "Cheque") {
            const cheque = await chequeRepo.getChequeById(payment.chequeNo)
            const chequeStatus = cheque.status.split(" ")[0] //Since returned cheques have return reason in their status
            if (chequeStatus == "Returned")
                continue
        }
        balance -= payment.amount
    }

    return balance;
}
//<td data-heading="Balance">${await getBalance(invoice)}</td>
async function invoiceToTableRow(invoice) {
    return `
            <tr>
                <td data-heading="Invoice No">${invoice.invoiceNo}</td>
                <td data-heading="Customer">${invoice.customerId.companyName}</td>
                <td data-heading="Amount">${invoice.amount}</td>
                <td data-heading="Invoice Date">${new Date(invoice.invoiceDate).toDateString()}</td>
                <td data-heading="Due Date">${new Date(invoice.dueDate).toDateString()}</td>
                <td data-heading="Actions">
                    <span>
                        <button class="action-btn update-btn" onclick="updateInvoice('${invoice.invoiceNo}')"><i class="fa fa-edit"></i>Edit</button>
                        <button class="action-btn delete-btn" onclick="deleteInvoice('${invoice.invoiceNo}')"><i class="fa fa-trash"></i>Delete</button>
                        <button class="action-btn manage-payments-btn" onclick="managePayments('${invoice.invoiceNo}')"><i class="fa fa-money""></i>Payments</button>
                    </span>
                </td>
            </tr>
            `
}