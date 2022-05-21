const API_KEY = '4d72be8d-f73a-406d-a9b8-303556d65731'

const kontenbaseClient = new kontenbase.KontenbaseClient({
    apiKey: API_KEY
})

async function profileEdit() {
    let image = document.getElementById('file-photo').files[0];
    let name = document.getElementById("fullname").value
    let username = document.getElementById("username").value
    let email = document.getElementById("email").value
    let biodata = document.getElementById("biodata").value

    const { data, error } = await kontenbaseClient.auth.update({
        firstName: name,
        username
    });

    alert("Edit Profile Succes")
    renderUserInfo()
}

async function renderUserInfo() {
    const { user, error } = await kontenbaseClient.auth.user();

    console.log(user);
    document.getElementById("fullname").value = user.firstName
    document.getElementById("username").value = user.username ? user.username : ""
    document.getElementById("email").value = user.email
    // console.log(userData);
}

renderUserInfo()