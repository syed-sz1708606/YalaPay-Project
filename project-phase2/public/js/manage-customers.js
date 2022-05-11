import customerRepo from "./repository/customer-repo.js";
import Customer from "./model/customer.js";

let mainContent;

let customerTableHead = `
  <table class='customers-list'">
    <thead>
      <th>Customer ID</th>
      <th>Company Name</th>
      <th>First Name</th>
      <th>Last Name</th>
      <th>Street Name</th>
      <th>City</th>
      <th>Country</th>
      <th>Mobile</th>
      <th>Email</th>
      <th>Actions</th>
    </thead>`

document.addEventListener("DOMContentLoaded", async () => {
    mainContent = document.querySelector(".main-content");
    await displayCustomers();

    document.querySelector(".list-btn").addEventListener("click", displayCustomers);
    document.querySelector(".add-btn").addEventListener("click", loadAddCustomer);
    document.querySelector(".search-btn").addEventListener("click", searchCustomer);

    window.deleteCustomer = deleteCustomer;
    window.updateCustomer = updateCustomer;
});

async function loadPage(pageName) {
    const pageContent = await fetch(`../html/${pageName}`);
    mainContent.innerHTML = await pageContent.text();
}

async function displayCustomers() {
    const customers = await customerRepo.getAllCustomers();

    mainContent.innerHTML = `
  ${customerTableHead}
      <tbody>
          ${customers.map((customer) => customerToTableRow(customer)).join("")}
      </tbody>
  </table>`;
}

async function loadAddCustomer() {
    await loadPage("partial-views/add-customer.html");
    document.querySelector("#add-customer-form").addEventListener("submit", addCustomer);
}

async function searchCustomer() {
    const searchCriteria = document.querySelector(".search-criteria").value
    const searchInput = document.querySelector(".search-input").value.trim()
    let tableBody = "", customer;

    if (searchCriteria == "byId") {
        const customerId = searchInput;
        if (!customerId) return window.alert(`Invalid search query.`);
        customer = await customerRepo.getCustomer(customerId);

        if (!customer) return window.alert(`No matching customer found.`);
        tableBody = customerToTableRow(customer)
    } else {
        let customerList;
        if (!searchInput) return window.alert(`Invalid search query.`);

        if (searchCriteria == "byCompanyName") {
            customerList = await customerRepo.getCustomerByCompanyName(searchInput);
        } else if (searchCriteria == "byCity") {
            customerList = await customerRepo.getCustomerByCity(searchInput);
        }
        tableBody = customerList.map(customer => customerToTableRow(customer)).join(" ")
    }

    if (!tableBody) return window.alert(`No matching customer found.`);

    mainContent.innerHTML = `
     ${customerTableHead}
        <tbody>
            ${tableBody}
        </tbody>
      </table>`;
}

async function addCustomer(event) {
    event.preventDefault();
    let errorCount = 0;

    const customerId = document.querySelector("#customerId").value;
    const companyName = document.querySelector("#companyName").value;
    const firstName = document.querySelector("#firstName").value;
    const lastName = document.querySelector("#lastName").value;
    const street = document.querySelector("#street").value;
    const city = document.querySelector("#city").value;
    const country = document.querySelector("#country").value;
    const mobile = document.querySelector("#mobile").value;
    const email = document.querySelector("#email").value;

    const address = {
        street: street,
        city: city,
        country: country,
    };

    const contactDetails = {
        firstName: firstName,
        lastName: lastName,
        mobile: mobile,
        email: email,
    };

    const customer = new Customer(
        companyName,
        address,
        contactDetails
    );

    if (!customer.companyName) {
        document.querySelector("#companyName").parentElement.setAttribute('data-error', "Company name is required!")
        document.querySelector("#companyName").setAttribute('class', "error")
        errorCount++
    }
    if (!customer.contactDetails.firstName) {
        document.querySelector("#firstName").parentElement.setAttribute('data-error', "First name is required!")
        document.querySelector("#firstName").setAttribute('class', "error")
        errorCount++
    }
    if (!customer.contactDetails.lastName) {
        document.querySelector("#lastName").parentElement.setAttribute('data-error', "Last name is required!")
        document.querySelector("#lastName").setAttribute('class', "error")
        errorCount++
    }
    if (!customer.contactDetails.mobile) {
        document.querySelector("#mobile").parentElement.setAttribute('data-error', "Mobile number is required!")
        document.querySelector("#mobile").setAttribute('class', "error")
        errorCount++
    }
    if (!customer.contactDetails.email) {
        document.querySelector("#email").parentElement.setAttribute('data-error', "Email is required!")
        document.querySelector("#email").setAttribute('class', "error")
        errorCount++
    }
    if (!customer.address.street) {
        document.querySelector("#street").parentElement.setAttribute('data-error', "Street information is required!")
        document.querySelector("#street").setAttribute('class', "error")
        errorCount++
    }
    if (!customer.address.city) {
        document.querySelector("#city").parentElement.setAttribute('data-error', "City information is required!")
        document.querySelector("#city").setAttribute('class', "error")
        errorCount++
    }
    if (!customer.address.country) {
        document.querySelector("#country").parentElement.setAttribute('data-error', "Country information is required!")
        document.querySelector("#country").setAttribute('class', "error")
        errorCount++
    }
    if (errorCount > 0) {
        window.alert(`Please fill all information!`);
        return;
    }

    if (customerId) {
        customer.customerId = customerId
        await customerRepo.updateCustomer(customer);
        window.alert(`Customer with ID: ${customerId} updated.`);
    } else {
        await customerRepo.addCustomer(customer);
        window.alert(`Customer added.`);
    }

    await displayCustomers();
}

async function deleteCustomer(customerId) {
    if (!window.confirm(`Are you sure you would like to delete cutomer ${customerId}?`)) return
    await customerRepo.deleteCustomer(customerId);
    await displayCustomers();
}

async function updateCustomer(customerId) {
    await loadPage("partial-views/add-customer.html");
    document.querySelector('form .page-subheading').innerHTML = "Update Customer"
    document.querySelector("#customerId").value = customerId;

    const customer = await customerRepo.getCustomer(customerId);

    document.querySelector("#customerId").value = customer._id;
    document.querySelector("#companyName").value = customer.companyName;
    document.querySelector("#firstName").value =
        customer.contactDetails.firstName;
    document.querySelector("#lastName").value = customer.contactDetails.lastName;
    document.querySelector("#street").value = customer.address.street;
    document.querySelector("#city").value = customer.address.city;
    document.querySelector("#country").value = customer.address.country;
    document.querySelector("#mobile").value = customer.contactDetails.mobile;
    document.querySelector("#email").value = customer.contactDetails.email;

    const submitBtn = document.querySelector("#submit-add-btn");
    submitBtn.innerHTML = "Submit Update";
    submitBtn.addEventListener("click", addCustomer);
}

function customerToTableRow(customer) {
    return `
    <tr>
        <td data-heading="Customer ID">${customer.customerId}</td>
        <td data-heading="Company Name">${customer.companyName}</td>
        <td data-heading="First Name">${customer.contactDetails.firstName}</td>
        <td data-heading="Last Name">${customer.contactDetails.lastName}</td>
        <td data-heading="Street">${customer.address.street}</td>
        <td data-heading="City">${customer.address.city}</td>
        <td data-heading="Country">${customer.address.country}</td>
        <td data-heading="Mobile">${customer.contactDetails.mobile}</td>
        <td data-heading="Email">${customer.contactDetails.email}</td>
        <td data-heading="Actions">
          <span>
            <button class="action-btn update-btn" onclick="updateCustomer('${customer.customerId}')"><i class="fa fa-edit"></i>Edit</button>
            <button class="action-btn delete-btn" onclick="deleteCustomer('${customer.customerId}')"><i class="fa fa-trash"></i>Delete</button>
          </span>
        </td>
    </tr>
    `;
}