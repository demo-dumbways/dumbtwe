
const API_KEY = 'aea64958-96f0-45dc-b3cc-e9991afd890e'

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

    if (error) {
        alert("Invalid Login")
        window.location.href = "login.html"
    }

    if (user.role[0] == "admin") {
        window.location.href = "admin-verification.html"
    } else {
        window.location.href = "beranda.html"
    }
}

async function logout() {

    const { user, error } = await kontenbaseClient.auth.logout()

    window.location.href = "index.html"

}

async function renderProfile() {
    const { user, error } = await kontenbaseClient.auth.user({
        lookup: ['following', 'followers']
    })
    if (user) {
        let avatarProfile = document.getElementById("avatar-profile")
        let threadProfile = document.getElementById("avatar-thread")

        let fullname = document.getElementById("fullname")
        let username = document.getElementById("username")
        let biodata = document.getElementById("biodata")
        let followers = document.getElementById("followers")
        let following = document.getElementById("following")

        followers.innerHTML = user.followers.length
        following.innerHTML = user.following.length


        if (user.verified == "approved") {
            fullname.innerHTML = `${user.firstName} <i class="fa-solid fa-circle-check" style="color:#00d6d6"></i>`
        } else {
            fullname.innerHTML = user.firstName
        }

        if (user.username) {
            username.innerHTML = '@' + user.username
        } else {
            username.innerHTML = "@"
        }

        if (user.biodata) {
            biodata.innerHTML = user.biodata
        } else {
            biodata.innerHTML = "-"
        }

        avatarProfile.src = user.avatar[0].url
        threadProfile.src = user.avatar[0].url
    }

}

renderProfile()

