const API_KEY = '6e926aea-71c3-4445-9fbf-2b2c3c06b50a'

const kontenbaseClient = new kontenbase.KontenbaseClient({
    apiKey: API_KEY
})

async function getData() {
    const { data, error } = await kontenbaseClient.service("Users").find({
        or: [
            { verified: "pending" },
            { verified: "rejected" },
            { verified: "approved" }
        ],
        sort: { verified: 1 }
    })

    renderListVerify(data)
}

function renderListVerify(data) {
    let bodyTable = document.getElementById("body-table")

    console.log(data);

    bodyTable.innerHTML = ""
    for (let i = 0; i < data.length; i++) {
        bodyTable.innerHTML += `
        <tr>
            <td class="text-center">${i + 1}</td>
            <td>${data[i].username}</td>
            <td>${data[i].firstName}</td>
            <td class="text-center">${data[i].influence}</td>
            <td>${data[i].idCard}</td>
            <td class="address">
            ${data[i].address}
            </td>
            <td class="text-center text-blue">${data[i].verified}</td>
            <td class="text-center">
            ${data[i].verified == "pending" ?
                `
                <button class="btn-cancel" onclick="verify('${data[i]._id}','rejected')">Reject</button>
                <button class="btn-approve" onclick="verify('${data[i]._id}','approved')">Approve</button>
                `
                :
                `<span class="btn-cancel">Cancel</span>`
            }
            </td>
          </tr>`
    }
}

async function verify(id, action) {
    const { data, error } = await kontenbaseClient.service('Users').updateById(id, {
        verified: action,
    })

    getData()
}

async function logout() {

    const { user, error } = await kontenbaseClient.auth.logout()

    window.location.href = "index.html"

}

getData()