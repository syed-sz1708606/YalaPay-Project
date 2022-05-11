import { InvoiceRepo } from "./repository/invoice-repo.js";
import { CustomerRepo } from "./repository/customer-repo.js";
import { PaymentRepo } from "./repository/payment-repo.js";
import { Invoice } from "./model/invoice.js";

const invoiceRepo = new InvoiceRepo();
const paymentRepo = new PaymentRepo();
const customerRepo = new CustomerRepo();

let mainContent;

let invoiceTableHead = `
    <table class='invoice-list'>
        <thead>
            <th>Invoice No</th>
            <th>Customer ID</th>
            <th>Amount</td>
            <th>Invoice Date</th>
            <th>Due Date</th>
            <th>Balance</th>
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
        const invoiceObj = new Invoice()
        Object.assign(invoiceObj, invoice)
        tableBody += await invoiceToTableRow(invoiceObj);
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
    const customerOptions = customers.map(customer => `<option value=${customer.customerId}>${customer.customerId}</option>`).join('')
    customerSelect.innerHTML = "<option value='' disabled selected>Select Customer ID</option>" + customerOptions
    document.querySelector('#invoiceDate').valueAsDate = new Date()
    customerSelect.addEventListener('change', handleCustIdSelect)

    document.querySelector('#submit-add-btn').addEventListener('click', addInvoice)
}

async function searchInvoice() {
    const searchCriteria = document.querySelector(".search-criteria").value
    const searchInput = document.querySelector(".search-input").value
    let tableBody = "", invoice;

    if (searchCriteria == "byId") {
        const invoiceId = parseInt(searchInput)
        if (!invoiceId) return window.alert(`Invalid search query.`)
        invoice = await invoiceRepo.getInvoiceById(invoiceId);

        if (!invoice) return window.alert(`No matching invoice found.`);

        const invoiceObj = new Invoice()
        Object.assign(invoiceObj, invoice)
        tableBody = await invoiceToTableRow(invoiceObj)
    }
    else {
        let invoiceList;
        if (searchCriteria == "byCustomerID") {
            const customerId = parseInt(searchInput)
            if (!customerId) return window.alert(`Invalid search query.`)
            invoiceList = await invoiceRepo.getInvoiceByCustomerId(customerId)
        }
        else if (searchCriteria == "byAmount") {
            const amount = parseFloat(searchInput)
            if (!amount) return window.alert(`Invalid search query.`)
            invoiceList = await invoiceRepo.getInvoiceByAmount(amount)
        }
        for (const invoice of invoiceList) {
            const invoiceObj = new Invoice()
            Object.assign(invoiceObj, invoice)
            tableBody += await invoiceToTableRow(invoiceObj)
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

    const invoiceNo = parseInt(document.querySelector('#invoiceNo').value)
    const customerId = parseInt(document.querySelector('#customerId').value)
    const customerName = document.querySelector('#customerName').value
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

    const invoice = new Invoice(invoiceNo, customerId, customerName, amount, invoiceDate, dueDate)

    if (invoiceNo) {
        await invoiceRepo.updateInvoice(invoice)
        window.alert(`Invoice with ID: ${invoice.invoiceNo} updated.`)
    }
    else {
        const invoiceList = await invoiceRepo.getAllInvoices()
        if (invoiceList.length > 0) {
            invoice.invoiceNo = (invoiceList[invoiceList.length - 1].invoiceNo) + 1
            await invoiceRepo.addInvoice(invoice)
            window.alert(`Invoice with ID: ${invoice.invoiceNo} added.`)
        }
        else {
            invoice.invoiceNo = 1
            await invoiceRepo.addInvoice(invoice)
        }
    }

    await displayInvoices()
}

async function deleteInvoice(invoiceNo) {
    if (!window.confirm(`Are you sure you would like to delete invoice ${invoiceNo}?`)) return

    const getAllPaymentsByInvoice = await paymentRepo.getPaymentsByInvoice(invoiceNo)
    for (const payments of getAllPaymentsByInvoice)
        await paymentRepo.deletePayment(payments.paymentId);
    await invoiceRepo.deleteInvoice(parseInt(invoiceNo));
    await displayInvoices();
}

async function updateInvoice(invoiceNo) {
    await loadPage('partial-views/add-invoice.html')
    document.querySelector('form .page-subheading').innerHTML = "Update Invoice"
    document.querySelector('#invoiceNo').value = invoiceNo

    const invoice = await invoiceRepo.getInvoiceById(invoiceNo)

    const customerSelect = document.querySelector('#customerId')

    const customers = await customerRepo.getAllCustomers()
    let customerOptions = ""
    customers.forEach(customer => {
        if (customer.customerId == invoice.customerId)
            customerOptions += `<option value=${customer.customerId} selected>${customer.customerId}</option>`
        else
            customerOptions += `<option value=${customer.customerId}>${customer.customerId}</option>`
    })
    customerSelect.innerHTML = customerOptions
    customerSelect.addEventListener('change', handleCustIdSelect)

    document.querySelector('#customerName').value = invoice.customerName
    document.querySelector('#amount').value = invoice.amount
    document.querySelector('#invoiceDate').value = invoice.invoiceDate
    document.querySelector('#dueDate').value = invoice.dueDate

    const submitBtn = document.querySelector('#submit-add-btn')
    submitBtn.innerHTML = "Submit Update"
    submitBtn.addEventListener('click', addInvoice)
}

async function handleCustIdSelect() {
    const custId = parseInt(document.querySelector('#customerId').value)
    const customer = await customerRepo.getCustomerById(custId);
    document.querySelector('#customerName').value = customer.companyName
}

async function managePayments(invoiceNo) {
    window.location.href = "./manage-payments.html?invoiceNo=" + invoiceNo
}

async function invoiceToTableRow(invoice) {
    return `
            <tr>
                <td data-heading="Invoice No">${invoice.invoiceNo}</td>
                <td data-heading="Customer ID">${invoice.customerId}</td>
                <td data-heading="Amount">${invoice.amount}</td>
                <td data-heading="Invoice Date">${invoice.invoiceDate}</td>
                <td data-heading="Due Date">${invoice.dueDate}</td>
                <td data-heading="Balance">${await invoice.getBalance()}</td>
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