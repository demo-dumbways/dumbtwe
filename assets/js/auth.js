const API_KEY = '418b6bfa-1779-4233-a788-7c0f7ac40251'

const kontenbaseClient = new kontenbase.KontenbaseClient({
    apiKey: API_KEY
})

async function register() {

    let name = document.getElementById("input-name").value
    let email = document.getElementById("input-email").value
    let username = document.getElementById("input-username").value
    let password = document.getElementById("input-password").value

    const { user, token, error } = await kontenbaseClient.auth.register({
        firstName: name,
        email: email,
        username: username,
        password: password,
    })

    window.location.href = "login.html"

}

async function login() {

    let email = document.getElementById("input-email").value
    let password = document.getElementById("input-password").value

    const { user, token, error } = await kontenbaseClient.auth.login({
        email: email,
        password: password,
    })

    window.location.href = "beranda.html"
}

async function logout() {

    const { user, error } = await kontenbaseClient.auth.logout()

    window.location.href = "index.html"

}

let age = "ilham"