import depositRepo from "./repository/deposit-repo.js";
import chequeRepo from "./repository/cheque-repo.js";
import accountRepo from "./repository/bankAccount-repo.js";

import Deposit from "./model/cheque-deposit.js";

let mainContent, returnReasons;
const depositTableHead = `
  <table class='deposits-list'>
    <thead>
      <th>Deposit ID</th>
      <th>Deposit Date</th>
      <th>Status</th>
      <th>Cheque Count</th>
      <th>Actions</th>
    </thead>`

document.addEventListener("DOMContentLoaded", async () => {
  mainContent = document.querySelector(".main-content");
  await displayChequeDeposits();

  document
    .querySelector(".list-btn")
    .addEventListener("click", displayChequeDeposits);
  document
    .querySelector(".add-btn")
    .addEventListener("click", loadAddDepositPage);

  document
    .querySelector('.search-btn')
    .addEventListener('click', searchDeposit)

  window.deleteDeposit = deleteDeposit;
  window.viewDeposit = viewDeposit;
  window.loadUpdateChequeDeposit = loadUpdateChequeDeposit;
  window.handleSelectReturned = handleSelectReturned
});

async function displayChequeDeposits() {
  const deposits = await depositRepo.getAllDeposits();
  mainContent.innerHTML = `
    ${depositTableHead}
      <tbody>
        ${deposits.map((deposit) => depositToTableRowHTML(deposit)).join(" ")}
      </tbody>
    </table>
    `
}

async function searchDeposit() {
  const searchCriteria = document.querySelector(".search-criteria").value
  const searchInput = document.querySelector(".search-input").value
  let tableBody = "", deposit;

  if (searchCriteria == "byId") {
    const depositId = searchInput
    if (!depositId) return window.alert(`Invalid search query.`)
    deposit = await depositRepo.getDeposit(depositId);

    if (!deposit) return window.alert(`No matching deposit found.`);
    tableBody = depositToTableRowHTML(deposit)
  }
  else {
    let depositList;
    if (searchCriteria == "byDepositDate") {
      const depositDate = new Date(searchInput)
      if (depositDate == "Invalid Date") return window.alert(`Invalid search query.`)
      depositList = await depositRepo.getDepositByDepositDate(depositDate)
    }
    else if (searchCriteria == "byStatus") {
      if (!searchInput) return window.alert(`Invalid search query.`)
      depositList = await depositRepo.getDepositByStatus(searchInput)
    }
    tableBody = depositList.map(deposit => depositToTableRowHTML(deposit)).join(" ")
  }

  if (!tableBody) return window.alert(`No matching deposit found.`)

  mainContent.innerHTML = `
    ${depositTableHead}
      <tbody>
          ${tableBody}
      </tbody>
    </table>`
}

async function loadAddDepositPage() {
  const pageContent = await fetch("../html/partial-views/add-cheque-deposit.html");
  const innercode = await pageContent.text();

  const awaitingCheques = await chequeRepo.getAwaitingCheques();
  let awaitingChequesList = awaitingCheques.map((cheque) => chequeToTableRowHTML(cheque, "add")).join(" ");
  awaitingChequesList = `
    <table class="add-deposit-cheque-list">
      <thead>
        <th>Cheque No</th>
        <th>Amount</th>
        <th>Status</th>
        <th>Due Date</th>
        <th>Included</th>
      </thead>
      <tbody>
        ${awaitingChequesList}
      </tbody>
    </table>`

  mainContent.innerHTML = innercode + awaitingChequesList;

  document
    .querySelector("#save-btn")
    .addEventListener("click", handleSaveDeposit);

  const datebox = document.querySelector("#depositDate");
  datebox.valueAsDate = new Date()
  datebox.setAttribute("min", datebox.value)

  const selectBankAccount = document.querySelector("#bankAccountNo");
  selectBankAccount.innerHTML = await addBankAccountOptions();
}

async function addBankAccountOptions() {
  const accounts = await accountRepo.getAllAccounts();
  const options = accounts
    .map(
      (account) =>
        `<option value="${account._id}">${account.accountNo} ${account.bank}</option>`
    )
    .join(" ");
  return options;
}

async function deleteDeposit(depositId) {
  if (!window.confirm(`Are you sure you would like to delete deposit ${depositId}?`)) return

  const deposit = await depositRepo.getDeposit(depositId);
  console.log(deposit);
  const toDeleteCheques = deposit.chequeNos

  for (let index = 0; index < toDeleteCheques.length; index++) {
    const cheque = await chequeRepo.getCheque(toDeleteCheques[index]);
    cheque.status = 'Awaiting'
    delete cheque.depositedDate
    await chequeRepo.deleteCheque(cheque._id)
    await chequeRepo.addCheque(cheque)
  }

  await depositRepo.deleteDeposit(depositId)
  await displayChequeDeposits()
}

async function handleSaveDeposit(event) {
  event.preventDefault();

  const bankAccountId = document.querySelector("#bankAccountNo").value;
  const depositDate = document.querySelector("#depositDate").value;
  const depositStatus = "Deposited";
  const chequeNos = getCheckedCheques();

  if (!chequeNos.length) {
    window.alert("No cheques selected.");
    return;
  }

  const newDeposit = new Deposit(depositDate, bankAccountId, depositStatus, chequeNos);

  await depositRepo.addDeposit(newDeposit);
  window.alert("Successfully deposited.");

  // Set all cheques deposit date and also update their status to deposited
  for (let index = 0; index < chequeNos.length; index++) {
    const cheque = await chequeRepo.getCheque(chequeNos[index]);
    cheque.status = "Deposited";
    cheque.depositedDate = depositDate;
    await chequeRepo.updateCheque(cheque);
  }

  await displayChequeDeposits()
}

function getCheckedCheques() {
  let checkedCheques = [];
  const cheques = document.querySelectorAll('input[type="checkbox"]');
  for (const cheque of cheques) {
    if (cheque.checked) {
      checkedCheques.push(cheque.dataset.chequeid);
    }
  }
  return checkedCheques;
}

async function viewDeposit(depositId) {
  const deposit = await depositRepo.getDeposit(depositId)
  const chequeNos = deposit.chequeNos

  let chequesInfo = ''
  for (let index = 0; index < chequeNos.length; index++) {
    const cheque = await chequeRepo.getCheque(chequeNos[index])
    chequesInfo += `
    <tr class="cheque">
      <td data-heading="Cheque No">${cheque.chequeNo}</td>
      <td data-heading="Amount">${cheque.amount}</td>
      <td data-heading="Status">${cheque.status}</td>
      <td data-heading="Due Date">${new Date(cheque.dueDate).toDateString()}</td>
    </tr>`
  }

  chequesInfo = `
    <table class="view-deposit-cheques">
      <thead>
        <th>Cheque No</th>
        <th>Amount</th>
        <th>Status</th>
        <th>Due Date</th>
      </thead>

      <tbody>
        ${chequesInfo}
      </tbody>
    </table>
  `

  let depositInfo = depositToDetailedCardHTML(deposit)
  depositInfo = depositInfo.concat(" ", chequesInfo)
  mainContent.innerHTML = depositInfo
}

async function loadUpdateChequeDeposit(depositId) {
  const pageContent = await fetch("../html/partial-views/update-cheque-deposit.html");
  const innercode = await pageContent.text();

  const deposit = await depositRepo.getDeposit(depositId)

  returnReasons = [
    "No funds/insufficient funds",
    "Cheque post-dated, please represent on due date",
    "Drawer's signature differs",
    "Alteration in date/words/figures requires drawer's full signature",
    "Order cheque requires payee's endorsement",
    "Not drawn on us",
    "Drawer deceased/bankrupt",
    "Account closed",
    "Stopped by drawer due to cheque lost, bearer's bankruptcy or a judicial order",
    "Date/beneficiary name is required",
    "Presentment cycle expired",
    "Already paid",
    "Requires drawer's signature ",
    "Cheque information and electronic data mismatch"
  ].map(reason => `<option value="${reason}">${reason}</option>`).join(' ');

  let chequeList = ""
  for (const chequeNo of deposit.chequeNos) {
    const depositCheque = await chequeRepo.getCheque(chequeNo)
    chequeList += chequeToTableRowHTML(depositCheque, "update")
  }

  const chequesInfo = `
    <table class="view-deposit-cheques">
      <thead>
        <th>Cheque No</th>
        <th>Amount</th>
        <th>Status</th>
        <th>Due Date</th>
        <th>Is Returned</th>
        <th>Return Reason</th>
        <th>Return Date</th>
      </thead>

      <tbody>
        ${chequeList}
      </tbody>
    </table>
  `

  mainContent.innerHTML = innercode + chequesInfo

  const bankAccount = await accountRepo.getAccount(deposit.bankAccountId)
  document.querySelector("#bank-account-no").value = deposit.bankAccountId + " " + bankAccount.bank
  document.querySelector("#deposit-id").value = depositId

  const cashedDateBox = document.querySelector("#cashed-date")
  cashedDateBox.setAttribute("min", deposit.depositDate)
  cashedDateBox.valueAsDate = new Date()

  document.querySelector("#update-btn").addEventListener('click', updateDeposit)
  document.querySelector('#deposit-status').addEventListener('change', handleDepositStatusDDChange)
  window.handleDepositStatusDDChange = handleDepositStatusDDChange
}

function handleDepositStatusDDChange(event) {
  const status = event.target.value
  const isReturnedCheckBoxes = document.querySelectorAll("input[class='is-returned']")

  if (status == "cashed") {
    isReturnedCheckBoxes.forEach(box => {
      box.checked = false
      box.disabled = true
    })
    document.querySelectorAll("[class='return-date'], [class='return-reason']").forEach(el => el.disabled = true)
  }
  else if (status == "returns") isReturnedCheckBoxes.forEach(box => box.disabled = false)
}

async function handleSelectReturned(chequeNo) {
  const checkBox = document.querySelector(`input[type="checkbox"][data-chequeno="${chequeNo}"]`)
  if (checkBox.checked) {
    document.querySelector(`[class="return-reason"][data-chequeNo="${chequeNo}"]`).disabled = false
    document.querySelector(`[class="return-date"][data-chequeNo="${chequeNo}"]`).disabled = false
  }
  else {
    document.querySelector(`[class="return-reason"][data-chequeNo="${chequeNo}"]`).disabled = true
    document.querySelector(`[class="return-date"][data-chequeNo="${chequeNo}"]`).disabled = true
  }
}

async function updateDeposit(event) {
  event.preventDefault()

  const depositId = document.querySelector("#deposit-id").value
  const deposit = await depositRepo.getDeposit(depositId)

  deposit.cashedDate = document.querySelector("#cashed-date").value

  const depositStatus = document.querySelector("#deposit-status").value

  if (depositStatus == "cashed") {
    deposit.depositStatus = "Cashed"

    for (const chequeNo of deposit.chequeNos) {
      const cheque = await chequeRepo.getCheque(chequeNo)
      cheque.status = "Cashed"
      await chequeRepo.updateCheque(cheque)
    }
    window.alert("Cheque deposit status updated to cashed.")
  }
  else if (depositStatus == "returns") {
    deposit.depositStatus = "Cashed with Returns"

    let returnedChequeCount = 0
    for (const chequeId of deposit.chequeNos) {
      const cheque = await chequeRepo.getCheque(chequeId)

      const returnedCheckBox = document.querySelector(`input[class="is-returned"][data-chequeId="${chequeId}"]`)
      if (returnedCheckBox.checked) {
        returnedChequeCount += 1
        const returnReason = document.querySelector(`select[class="return-reason"][data-chequeId="${chequeId}"`).value
        if (!returnReason) {
          window.alert(`Please select a return reason.`)
          return
        }
        cheque.status = "Returned - " + returnReason
        const returnDate = document.querySelector(`input[class="return-date"][data-chequeId="${chequeId}"`).value
        if (!returnDate) {
          window.alert(`Please select a return date.`)
          return
        }
        cheque.returnedDate = returnDate
        await chequeRepo.updateCheque(cheque)
      }
      else {
        cheque.status = "Cashed"
        await chequeRepo.updateCheque(cheque)
      }
    }
    if (!returnedChequeCount) {
      deposit.depositStatus = "Cashed"
      window.alert("Cheque deposit status updated to cashed as no cheques returned.")
    }
    else window.alert("Cheque deposit status updated to cashed with returns.")
  }
  await depositRepo.updateDeposit(deposit)
  await displayChequeDeposits()
}

function datediff(first, second) {
  // Take the difference between the dates and divide by milliseconds per day.
  // Round to nearest whole number to deal with DST.
  return Math.round((second - first) / (1000 * 60 * 60 * 24));
}

function depositToTableRowHTML(chequeDeposit) {
  let html = `
    <tr class="deposit-row">
      <td data-heading="Deposit ID">${chequeDeposit.depositId}</td>
      <td data-heading="Deposit Date">${new Date(chequeDeposit.depositDate).toDateString()}</td>
      <td data-heading="Status">${chequeDeposit.depositStatus}</td>
      <td data-heading="Cheque Count">${chequeDeposit.chequeNos.length}</td>
      <td data-heading="Actions" class="deposit-action-buttons">
        <span>
          <button class="action-btn view-btn" onclick="viewDeposit('${chequeDeposit.depositId}')"><i class="fa fa-eye"></i>View</button>`

  if (chequeDeposit.depositStatus == "Deposited") {
    html += `
        <button class="action-btn update-btn" onclick="loadUpdateChequeDeposit('${chequeDeposit.depositId}')"><i class="fa fa-edit"></i>Edit</button>
        <button class="action-btn delete-btn" onclick="deleteDeposit('${chequeDeposit.depositId}')"><i class="fa fa-trash"></i>Delete</button></td>
      </span>
    `
  }
  else html += "</span> </td>"

  html += "</div >"
  return html;
}

function chequeToTableRowHTML(cheque, action) {
  // Calcualte remaining days 
  const daysDiff = datediff(Date.now(), Date.parse(cheque.dueDate)).toString();
  let colorClass;

  if (daysDiff < 0) colorClass = 'red-days'
  else colorClass = 'green-days'

  let row = `
    <tr class="cheque-row" data-chequeId="${cheque.chequeNo}">
      <td data-heading="Cheque No">${cheque.chequeNo}</td>
      <td data-heading="Amount">${cheque.amount}</td>
      <td data-heading="Status">${cheque.status}</td>
      <td data-heading="Due Date">
        <span>
          <time>${new Date(cheque.dueDate).toDateString()}</time> <span class="${colorClass}">(${daysDiff})</span>
        </span>
      </td>`

  if (action == "add") {
    row += `
      <td data-heading="Include"> <input type="checkbox" data-chequeId="${cheque._id}"> </td>`
  }
  else if (action == "update") {
    row += `
      <td data-heading="Is Returned">
        <input type="checkbox" class="is-returned" onChange="handleSelectReturned(${cheque.chequeNo})" data-chequeNo="${cheque.chequeNo}" data-chequeId="${cheque._id}" disabled /> 
      </td>
      </td>
      <td data-heading="Return Reason">
        <select class="return-reason" data-chequeNo="${cheque.chequeNo}" data-chequeId="${cheque._id}" disabled>
          <option value='' disabled selected>Select Return Reason</option>
          ${returnReasons}
        </select>
      </td>
      <td data-heading="Return Date">
        <input type="date" class="return-date" data-chequeNo="${cheque.chequeNo}" data-chequeId="${cheque._id}" min="${cheque.depositedDate}" disabled />
      </td>
      `
  }
  return row + "</tr>";
}

function depositToDetailedCardHTML(chequeDeposit) {
  return `
    <div class="deposit-card">
      <h3 class="page-subheading">View Cheque Deposit</h3>
      <label>Deposit ID: ${chequeDeposit.depositId}</label>
      <label>Deposit Date: ${new Date(chequeDeposit.depositDate).toDateString()}</label>
      <label>Status: ${chequeDeposit.depositStatus}</label>
      <label>Cheque Count: ${chequeDeposit.chequeNos.length}</label>
    </div > `;
}