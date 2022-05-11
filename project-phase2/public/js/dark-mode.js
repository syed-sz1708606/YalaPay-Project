const darkBtn = `<i class="fa fa-moon-o"></i>`
const lightBtn = `<i class="fa fa-sun-o"></i>`

function getPreference() {
    let preference = localStorage.getItem('theme-preference')
    if (!preference) preference = "light"
    return preference
}

function displayTheme() {
    document.firstElementChild.setAttribute('data-theme', getPreference())
}

function handleDarkModeClick() {
    const currentTheme = getPreference()
    const theme = currentTheme == 'light' ? 'dark' : 'light'
    localStorage.setItem('theme-preference', theme)
    displayTheme()

    const themeBtn = document.querySelector("#dark-mode-button")
    if (theme == "light") themeBtn.innerHTML = lightBtn
    else if (theme == "dark") themeBtn.innerHTML = darkBtn
}

displayTheme()
window.onload = () => {
    const themeBtn = document.querySelector("#dark-mode-button")
    themeBtn.addEventListener('click', handleDarkModeClick)

    const theme = getPreference()
    if (theme == "light") themeBtn.innerHTML = lightBtn
    else if (theme == "dark") themeBtn.innerHTML = darkBtn
}