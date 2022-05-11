import invoiceRepo from "./repository/invoice-repo.js";
import chequeRepo from "./repository/cheque-repo.js";
import paymentRepo from "./repository/payment-repo.js";

let reportDiv, viewButton, reportType, statusSelector;

document.addEventListener("DOMContentLoaded", async () => {
    reportDiv = document.querySelector('.report')
    statusSelector = document.querySelector('#status')
    viewButton = document.querySelector('#view-report-btn')

    document.getElementsByName('report-type').forEach(radio => radio.addEventListener('change', handleReportTypeChange))
    await handleReportTypeChange()

    const urlParams = new URLSearchParams(window.location.search);
    reportType = urlParams.get('type');
    if (reportType == "invoice") await displayInvoiceReport();
    else if (reportType == "cheque") {
        document.querySelector('#cheque-radio').checked = true
        await displayChequeReport();
    }
});

async function handleReportTypeChange() {
    reportType = document.querySelector('input[name=report-type]:checked').value;
    document.querySelector('.main-content').style.display = "none"

    if (reportType == "invoice") {
        viewButton.innerHTML = "View Invoice Report"
        viewButton.removeEventListener('click', displayChequeReport)
        viewButton.addEventListener('click', displayInvoiceReport)

        statusSelector.innerHTML = `
            <option value="All" selected>All</option>
            <option value="Pending">Pending</option>
            <option value="Partially Paid">Partially Paid</option>
            <option value="Paid">Paid</option>
        `
    }
    else if (reportType == "cheque") {
        viewButton.innerHTML = "View Cheque Report"
        viewButton.removeEventListener('click', displayInvoiceReport)
        viewButton.addEventListener('click', displayChequeReport)

        statusSelector.innerHTML = `
            <option value="All" selected>All</option>
            <option value="Awaiting">Awaiting</option>
            <option value="Deposited">Deposited</option>
            <option value="Cashed">Cashed</option>
            <option value="Returned">Returned</option>
        `
    }
}

async function displayInvoiceReport() {
    document.querySelector('.main-content').style.display = "block"
    const invoices = await invoiceRepo.getInvoiceReport()
    const filter = statusSelector.value
    const fromDate = new Date(document.querySelector('#from-date').value)
    const toDate = new Date(document.querySelector('#to-date').value)

    let count = 0, total = 0
    let reportHTML = ""

    for (const invoice of invoices) {
        let balance = invoice.balance;

        let status;
        if (balance == invoice.amount) status = "Pending"
        else if (balance == 0) status = "Paid"
        else status = "Partially Paid"

        const invoiceDate = new Date(invoice.invoiceDate)
        if ((status != filter && filter != "All") || invoiceDate > toDate || invoiceDate < fromDate) continue

        count += 1
        total += invoice.amount

        reportHTML += `
        <tr>
            <td data-heading="Invoice No">${invoice.invoiceNo}</td>
            <td data-heading="Status">${status}</td>
            <td data-heading="Invoice Date">${new Date(invoice.invoiceDate).toDateString()}</td>
            <td data-heading="Due Date">${new Date(invoice.dueDate).toDateString()}</td>
            <td data-heading="Customer">${invoice.customer.companyName}</td>
            <td data-heading="Amount">${invoice.amount}</td>
            <td data-heading="Balance">${balance}</td>
        </tr>
        `
    }

    reportHTML = `
        <table class='invoice-report'>
            <thead>
                <th>Invoice No</th>
                <th>Status</th>
                <th>Invoice Date</th>
                <th>Due Date</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Balance</th>
            </thead>

            <tbody>
                ${reportHTML}
            </tbody>
        </table>
    `

    reportDiv.innerHTML = reportHTML
    document.querySelector('#report-count').innerHTML = `Invoice Count: ${count}`
    document.querySelector('#report-total').innerHTML = `Total: ${total}`
}

async function displayChequeReport() {
    document.querySelector('.main-content').style.display = "block"
    const cheques = await chequeRepo.getAllCheques()
    const filter = statusSelector.value
    const fromDate = new Date(document.querySelector('#from-date').value)
    const toDate = new Date(document.querySelector('#to-date').value)

    let count = 0, total = 0
    let reportHTML = ""

    for (const cheque of cheques) {
        const receivedDate = new Date(cheque.receivedDate)
        if ((cheque.status != filter && filter != "All") || receivedDate > toDate || receivedDate < fromDate) continue

        count += 1
        total += cheque.amount

        reportHTML += `
        <tr>
            <td data-heading="Cheque No">${cheque.chequeNo}</td>
            <td data-heading="Drawer">${cheque.drawer}</td>
            <td data-heading="Bank Name">${cheque.bankName}</td>
            <td data-heading="Amount">${cheque.amount}</td>
            <td data-heading="Due Date">${new Date(cheque.dueDate).toDateString()}</td>
            <td data-heading="Status">${cheque.status}</td>
        </tr>
        `
    }

    reportHTML = `
        <table class="cheque-report">
            <thead>
                <th>Cheque No</th>
                <th>Drawer</th>
                <th>Bank Name</th>
                <th>Amount</th>
                <th>Due Date</th>
                <th>Status</th>
            </thead>

            <tbody>
                ${reportHTML}
            </tbody>
        </table>
    `

    reportDiv.innerHTML = reportHTML
    document.querySelector('#report-count').innerHTML = `Cheque Count: ${count}`
    document.querySelector('#report-total').innerHTML = `Total: ${total}`
}