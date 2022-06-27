const API_KEY = '6e926aea-71c3-4445-9fbf-2b2c3c06b50a'

const kontenbaseClient = new kontenbase.KontenbaseClient({
    apiKey: API_KEY
})


async function renderData() {
    const { user, error } = await kontenbaseClient.auth.user()
    const { data, error: errorInfluence } = await kontenbaseClient.service("influence").find()

    console.log(data);
    document.getElementById("fullname").value = user.firstName

    let influence = document.getElementById("radio-influence")
    influence.innerHTML = ''
    for (let i = 0; i < data.length; i++) {
        influence.innerHTML += `
            <input type="radio" id="influence" name="influence" value="${data[i].name}">
            <label for="html">${data[i].name}</label><br>
        `
    }

}

async function addVerification() {
    let firstName = document.getElementById("fullname").value
    let influence = document.querySelector('input[name="influence"]:checked').value;
    let idCard = document.getElementById("idCard").value
    let address = document.getElementById("address").value

    let verifData = {
        firstName,
        influence,
        idCard,
        address,
        verified: "pending"
    }

    const { user, error } = await kontenbaseClient.auth.update(verifData)

    alert("Success, Wait for Result from Admin")
    window.location.href = "beranda.html"
}


async function renderForm() {

    const { user, error } = await kontenbaseClient.auth.user()

    let middleSide = document.getElementById("middle-side")
    if (user.verified == "pending") {
        middleSide.innerHTML = `
        <div class="card p-20 edit-profile">
                <h1>your data is being verified, please be willing to wait</h1>
                
            </div>
        `
    } else if (user.verified == "approved") {
        middleSide.innerHTML = `
        <div class="card p-20 edit-profile">
                <h1>your account is verified
                    <i class="fa-solid fa-circle-check" style="color:#00d6d6"></i>
                </h1>
                
            </div>
        `
    } else {
        renderData()
    }
}

renderForm()