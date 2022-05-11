/** Imports */
import  paymentRepo  from "./repository/payment-repo.js";
import  chequeRepo  from "./repository/cheque-repo.js";
import invoiceRepo  from "./repository/invoice-repo.js";
import { Payment } from "./model/payment.js";
import { Cheque } from "./model/cheque.js";



/** Global Variables */
let paymentContent;
let paymentMode;
let chequeDetailsDiv;
let payChequeId;
let payChequeDrawer;
let payBankSelect;
let payChequeIssueDate;
let payImageUrl;
let payChequeDueDate;
let payChequeStatus;
let paymentAmount;
let paymentDate;
let paymentId;
let invoiceId;
let paymentIdSearch;
let payImage;
let addPaymentBtn;
let isCheque;
let editPaymentAmount = 0;
let totalPaymentAmount = 0;
let amountDifference = 0;
let invoiceAmount = 0;

document.addEventListener("DOMContentLoaded",
    async () => {

        addPaymentBtn = document.querySelector('#add-payment')
        addPaymentBtn.addEventListener('click', loadAddPayment)
        paymentIdSearch = document.querySelector('.search-input')
        paymentContent = document.querySelector('#payment-container')

        document.querySelector('.search-btn').addEventListener('click', searchPayment)
        document.querySelector("#list-payment").addEventListener('click', displayPayment)

        await getInvoice()
        await displayPayment()

        window.editPayment = editPayment
        window.deletePayment = deletePayment

    });

async function getInvoice() {
    const urlParams = new URLSearchParams(window.location.search);
    invoiceId = urlParams.get('invoiceNo');

    document.querySelector('.page-subheading').innerHTML = `Invoice# ${invoiceId}`
    const invoice = await invoiceRepo.getInvoice(invoiceId)
    invoiceAmount = invoice.amount;
}

async function searchPayment() {
    const searchCriteria = document.querySelector(".search-criteria").value
    const searchInput = document.querySelector(".search-input").value.trim()
    let tableBody = "", payment;

    if (searchCriteria == "byId") {
        const paymentId = (searchInput);
        if (!paymentId) return window.alert(`Invalid search query.`);
        payment = await paymentRepo.getPayment(searchInput, invoiceId);

        if (!payment) return window.alert(`No matching payment found for this invoice.`);
        tableBody = injectToHtml(payment)
    } else {
        let paymentList;

        if (!searchInput) return window.alert(`Invalid search query.`);

        if (searchCriteria == "byAmount") {
            paymentList = await paymentRepo.getPaymentByAmount(searchInput, invoiceId);
        } else if (searchCriteria == "byPaymentDate") {
            paymentList = await paymentRepo.getPaymentByDate(new Date(searchInput), invoiceId);
        } else if (searchCriteria == "byPaymentMode") {
            paymentList = await paymentRepo.getPaymentByMode(searchInput, invoiceId);
        }
        tableBody = paymentList.map(payment => injectToHtml(payment)).join(" ")
    }

    if (!tableBody) return window.alert(`No matching payment found for this invoice.`);

    paymentContent.innerHTML = `
        <table>
            <thead>
                <th>Payment ID</th>
                <th>Amount</th>
                <th>Payment Date</th>
                <th>Payment Mode</th>
                <th>Cheque No</th>
                <th>Actions</th>
            </thead>
            <tbody>
                ${tableBody}
            </tbody>
        </table>`;
}

async function deletePayment(id) {
    if (!window.confirm(`Are you sure you would like to delete payment ${id}?`)) return
    const data = await paymentRepo.getPayment(id)
    await paymentRepo.deletePayment(id)
    console.log(data)
    console.log(data.chequeNo)
    if (data.paymentMode === "Cheque") await chequeRepo.deleteChequeByPaymentId(data.paymentId)
    await displayPayment()
}

async function displayPayment() {
    let display = ""
    let allPaymentsPerInvoice

    totalPaymentAmount = 0; //reset amount Count

    allPaymentsPerInvoice = await paymentRepo.getPaymentsByInvoice(invoiceId);
    allPaymentsPerInvoice.forEach(payment => display += injectToHtml(payment));

    validateInvoiceAmount(allPaymentsPerInvoice)

    paymentContent.innerHTML = `
        <table>
            <thead>
                <th>Payment ID</th>
                <th>Amount</th>
                <th>Payment Date</th>
                <th>Payment Mode</th>
                <th>Cheque No</th>
                <th>Actions</th>
            </thead>
            ${display}
        </table>`
}

function injectToHtml(payment) {
    console.log(payment)
    console.log(new Date(payment.paymentDate).toDateString())
    payment.chequeNo === undefined ? payment.chequeNo = "none" : payment.chequeNo

    return `
    <tr>
        <td data-heading="Payment ID">${payment.paymentId}</td>
        <td data-heading="Amount">${payment.amount}</td>
        <td data-heading="Payment Date">${new Date(payment.paymentDate).toDateString()}</td>
        <td data-heading="Payment Mode">${payment.paymentMode}</td>
        <td data-heading="Cheque No">${payment.chequeNo}</td>
        <td>
            <span>
                <button class="action-btn delete-btn" onclick="editPayment('${payment.paymentId}')"><i class="fa fa-edit"></i>Edit</button>
                <button class="action-btn update-btn" onclick="deletePayment('${payment.paymentId}')"><i class="fa fa-trash"></i>Delete</button>
            </span>
        </td>
    </tr>`
}

function validateInvoiceAmount(allPayments) {
    for (const payment of allPayments)
        totalPaymentAmount += parseInt(payment.amount)
}

async function loadAddPayment() {
    await loadPage('partial-views/add-payment.html')

    paymentMode = document.querySelector('#payment-mode')
    paymentMode.addEventListener('change', updatePaymentSelect)
    chequeDetailsDiv = document.querySelector('#cheque-details-container')
    paymentAmount = document.querySelector('#payment-amount')
    paymentDate = document.querySelector('#payment-date')
    paymentId = document.querySelector('#payment-id')

    document.querySelector('#submitBtn-add-payment').addEventListener('click', addPayment)
    paymentId.disabled = true
    paymentDate.valueAsDate = new Date()

    await loadPaymentOptions()
}

async function updatePaymentSelect() {
    if (paymentMode.value === 'Cheque') {
        isCheque = true;
        await onChequeSelect()

    } else {
        isCheque = false;
        chequeDetailsDiv.innerHTML = ""
    }
}

async function onChequeSelect() {
    // loading cheque form partial view
    const url = `../html/partial-views/add-cheque.html`
    const contentPage = await fetch(url)
    chequeDetailsDiv.innerHTML = await contentPage.text()

    chequeDetailsDiv.style.display = "block"
    payChequeId = document.querySelector('#pay-cheque-no')
    payChequeDrawer = document.querySelector('#pay-cheque-drawer')
    payBankSelect = document.querySelector('#pay-bank-select')
    payChequeStatus = document.querySelector('#pay-cheque-status')
    payChequeIssueDate = document.querySelector('#pay-cheque-issueDate')
    payChequeDueDate = document.querySelector('#pay-cheque-dueDate')
    payImageUrl = document.querySelector('#pay-cheque-imgUrl')
    payImage = document.querySelector('#cheque-img')
    payChequeIssueDate.valueAsDate = new Date()

    payChequeDueDate.valueAsDate = new Date()
    payChequeDueDate.setAttribute("min", payChequeDueDate.valueAsDate)

    payChequeStatus.value = "Awaiting"

    payImageUrl.addEventListener('change', function () {
        let imageFile;
        const reader = new FileReader();
        reader.readAsDataURL(this.files[0]);
        reader.addEventListener('load', () => {
            imageFile = reader.result;
            payImage.style.display = "block"
            payImage.setAttribute('src', imageFile);
            imageFile = payImage.getAttribute('src');
        });
    });

    await loadBankOptions()
}

function sendChequeDetailsToCheque(cheque) {
    payChequeId.value = cheque.chequeNo
    paymentAmount.value = cheque.amount
    payChequeDrawer.value = cheque.drawer
    payBankSelect.value = cheque.bankName
    payChequeStatus.value = cheque.status
    payChequeIssueDate.valueAsDate = new Date(cheque.receivedDate)
    payChequeDueDate.valueAsDate = new Date(cheque.dueDate)

    console.log(cheque.chequeImageUri)
    payImage.setAttribute('src', cheque.chequeImageUri);
    payImage.style.display = "block"
}


async function addPayment() {
    let payment;
    let paymentNo = parseInt(paymentId.value)
    let cheque

    //adding new payment
    if (isNaN(paymentNo)) {

        payment = new Payment(invoiceId, paymentAmount.value, paymentDate.value, paymentMode.value)

        amountDifference = invoiceAmount - totalPaymentAmount
        if (paymentAmount.value > amountDifference) {
            if (amountDifference > 0) {
                window.alert("total payment amount exceeds the invoice amount, please rectify the amount." +
                    " Max amount accepted is " + amountDifference)
                amountDifference = 0
                return
            }
            if (amountDifference === 0 || amountDifference < 0) {
                window.alert("cannot add more payments as total payment amounts have met the invoice amount limit")
                await displayPayment()
                return
            }
        }

        // empty fields error validation for payment
        if (!await paymentErrorValidation(payment)) {
            return
        }

        await paymentRepo.addPayment(payment)


        //Cheque is selected
        if (paymentMode.value == "Cheque") {
            const lastPayment = await paymentRepo.getLastNoOfPayments(1)
            //payment.amount = (cheque.amount)
            payment.chequeNo = parseInt(payChequeId.value)

            await paymentRepo.deletePayment(lastPayment[0].paymentId)
            await paymentRepo.addPayment(payment)



            const paying= await paymentRepo.getLastNoOfPayments(1)
            cheque = new Cheque(parseInt(payChequeId.value),(paymentAmount.value), payChequeDrawer.value, payBankSelect.value,
                payChequeStatus.value, payChequeIssueDate.value, payChequeDueDate.value, payImage.getAttribute("src"),paying[0].paymentId)
            /*//Duplicate ChequeNo validation
            const existingCheque = await chequeRepo.getCheque(cheque.chequeNo)
            if (existingCheque) {
                window.alert("Cheque number already exists in database!")
                return
            }
*/
            // empty fields error validation for cheque
            if (!await chequeErrorValidation(cheque)) {
                return
            }
            await chequeRepo.addCheque(cheque)
        }



    } else { // update existing payment

        amountDifference = invoiceAmount - (totalPaymentAmount - editPaymentAmount)
        if (paymentAmount.value > amountDifference) {
            if (invoiceAmount == totalPaymentAmount) {
                window.alert("Cannot go above the current amount " + editPaymentAmount +
                    ". Please enter the same value or a value lower than " + editPaymentAmount + ".")
                return
            }
            if (amountDifference > 0) {
                window.alert("Max amount to enter is: " + amountDifference + ".")
                return
            }
        }

        payment = new Payment(invoiceId, (paymentAmount.value), paymentDate.value, paymentMode.value, "none")

        if (isCheque == true) {     // updating cheque
            payment.chequeNo = (payChequeId.value)
            const cheque = await chequeRepo.getChequeByPaymentId(payment.paymentId)
            //getChequeDetailsToCheque(cheque)
            cheque.amount = (payment.amount)
            cheque.drawer = payChequeDrawer.value
            cheque.bankName = payBankSelect.value
            cheque.dueDate = payChequeDueDate.value
            cheque.chequeImageUri = payImage.getAttribute('src')

            //error validation
            if (!await chequeErrorValidation(cheque))
                return

            await chequeRepo.updateCheque(cheque)
            await paymentRepo.updatePayment(payment)

        } else { //was never a cheque

            //error validation
            if (!await paymentErrorValidation(payment))
                return

            await paymentRepo.updatePayment(payment)
            payment.chequeNo = undefined
        }
    }
    await displayPayment()
}

async function editPayment(id) {
    let cheque
    await loadAddPayment()
    const payment = await paymentRepo.getPayment(id)

    paymentId.value = payment.paymentId
    paymentMode.value = payment.paymentMode
    paymentAmount.value = (payment.amount)
    paymentDate.valueAsDate = new Date(payment.paymentDate)
    paymentMode.disabled = true;
    editPaymentAmount = (payment.amount)

    if (paymentMode.value === "Cheque") { // if payment selected is a cheque

        await onChequeSelect()
        //payChequeId.value = (payment.chequeNo)
        const cheque = await chequeRepo.getChequeByPaymentId(payment.paymentId)
        console.log(payment.paymentId)
        console.log("cheqye ibject")
        console.log(cheque)
        sendChequeDetailsToCheque(cheque)
        payChequeId.disabled = true
        isCheque = true
    }
}

async function chequeErrorValidation(cheque) {
    let valid = true;
    console.log(cheque.chequeNo)
    const chequeExists = await chequeRepo.getChequeByChequeNo(cheque.chequeNo);
    if (chequeExists) {
        console.log("inside")
        console.log(chequeExists)
        payChequeId.parentElement.setAttribute('data-error', "Cheque number already exists!")
        payChequeId.setAttribute('class', "error")
        valid = false
    }
    if (isNaN(cheque.chequeNo)) {
        payChequeId.parentElement.setAttribute('data-error', "Cheque number is required!")
        payChequeId.setAttribute('class', "error")
        valid = false
    }
    if (isNaN(cheque.amount) || paymentAmount.value == 0) {
        paymentAmount.parentElement.setAttribute('data-error', "Cheque amount is required!")
        paymentAmount.setAttribute('class', "error")
        valid = false
    }
    if (payBankSelect.value === "Select Bank") {
        payBankSelect.parentElement.setAttribute('data-error', "Bank is required!")
        payBankSelect.setAttribute('class', "error")
        valid = false
    }
    if (cheque.drawer === "") {
        payChequeDrawer.parentElement.setAttribute('data-error', "Cheque drawer is required!")
        payChequeDrawer.setAttribute('class', "error")
        valid = false
    }
    if (payChequeDueDate.value < payChequeIssueDate.value) {
        payChequeDueDate.parentElement.setAttribute('data-error', "Cheque Due Date cannot be before the issue date!")
        payChequeDueDate.setAttribute('class', "error")
        valid = false
    }
    if (payChequeDueDate.value === payChequeIssueDate.value) {
        payChequeDueDate.parentElement.setAttribute('data-error', "Cheque Due Date cannot be the same date as the issue date!")
        payChequeDueDate.setAttribute('class', "error")
        valid = false
    }
    if (payImage.getAttribute("src") === "#") {
        payImageUrl.parentElement.setAttribute('data-error', "Cheque Image is required!")
        payImageUrl.setAttribute('class', "error")
        valid = false
    }
    return valid
}

async function paymentErrorValidation(payment) {
    let valid = true;

    if (payment.amount === "" || paymentAmount.value == 0) {
        paymentAmount.parentElement.setAttribute('data-error', "Payment amount is empty!")
        paymentAmount.setAttribute('class', "error")
        valid = false
    } else {
        paymentAmount.parentElement.removeAttribute('data-error')
        paymentAmount.removeAttribute('class')
    }

    if (payment.paymentMode === "Select Payment Mode") {
        paymentMode.parentElement.setAttribute('data-error', "Payment Mode is not selected!")
        paymentMode.setAttribute('class', "error")
        valid = false
    } else {
        paymentMode.parentElement.removeAttribute('data-error')
        paymentMode.removeAttribute('class')
    }
    return valid
}

async function loadBankOptions() {
   /* const url = "../data/banks.json"
    const response = await fetch(url)*/
    const getAllBankOptions = [
        "Qatar National Bank",
        "Doha Bank",
        "Commercial Bank",
        "Qatar International Islamic Bank",
        "Qatar Islamic Bank",
        "Qatar Development Bank",
        "Arab Bank",
        "Al Ahli Bank",
        "Mashreq Bank",
        "HSBC Bank Middle East",
        "BNP Paribas",
        "Bank Saderat Iran",
        "United Bank ltd.",
        "Standard Chartered Bank",
        "Masraf Al Rayan",
        "Al khaliji Commercial Bank",
        "International Bank of Qatar",
        "Barwa Bank"
    ]
    const bankOptions = getAllBankOptions.map(bank => `<option value="${bank}">${bank}</option>`).join('')
    payBankSelect.innerHTML = "<option value='Select Bank' disabled selected>Select Bank</option>" + bankOptions
}

async function loadPaymentOptions() {
   const paymentModes = ["Bank transfer", "Credit card", "Cheque"]

    const getPayMode = paymentModes.map(payMode => `<option value="${payMode}">${payMode}</option>`)
    paymentMode.innerHTML = "<option value='Select Payment Mode' disabled selected>Select Payment Mode</option>" + getPayMode.join('')
}

async function loadPage(pagePath) {
    const url = `../html/${pagePath}`
    const contentPage = await fetch(url)
    paymentContent.innerHTML = await contentPage.text()
}