// Database
import userRepo from "./repository/user-repo.js";

// HTML QUERIES
const loginButton = document.querySelector('#loginBtn')
const email = document.querySelector('#email')
const password = document.querySelector('#password')

// Event Listeners
loginButton.addEventListener('click', handleLogin) // instead of display, () => display() can be used as well.

// Variables
let allUsers

// Functions
document.addEventListener("DOMContentLoaded", async () => {
    allUsers = await userRepo.getAllUsers();
    if (allUsers.length === 0) await loadUsers();
});

async function handleLogin(e) {
    e.preventDefault()

    const user = await userRepo.getUserByEmail(email.value)
    if (user) {
        if (user.password === password.value) {
            window.location.assign("../html/dashboard.html")
        } else {
            document.querySelector('#password').setAttribute('class', 'error')
            document.querySelector('#error-password').setAttribute('data-error', "Invalid Password!")
        }
    }
    else {
        document.querySelector('#email').setAttribute('class', 'error')
        document.querySelector('#error-email').setAttribute('data-error', "Invalid Email!")
    }
}

async function loadUsers() {
    const url = "../data/users.json";
    const response = await fetch(url);
    const users = await response.json();
    for (const user of users) await userRepo.addUser(user);
}