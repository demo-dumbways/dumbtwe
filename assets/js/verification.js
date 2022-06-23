const API_KEY = 'aea64958-96f0-45dc-b3cc-e9991afd890e'

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
        address
    }

    const { user, error } = await kontenbaseClient.auth.update(verifData)

    alert()
    window.location.href = "beranda.html"
}

renderData()