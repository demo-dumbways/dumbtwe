
const API_KEY = 'aea64958-96f0-45dc-b3cc-e9991afd890e'

const kontenbaseClient = new kontenbase.KontenbaseClient({
    apiKey: API_KEY
})

async function renderUserInfo() {

    const { user, error } = await kontenbaseClient.auth.user()
    console.log(user);

    document.getElementById("fullname").value = user.firstName
    document.getElementById("username").value = user.username
    document.getElementById("email").value = user.email
    document.getElementById("biodata").value = user.biodata
}

renderUserInfo()

function changeName() {
    const photo = document.getElementById("file-photo").files[0]
    const photoElement = document.getElementById("photo-name")

    if (photo) {
        photoElement.innerHTML = photo.name
    }

    let thumbnailPreview = document.getElementById("thumbnail-preview")
    let imgPreview = URL.createObjectURL(photo)
    thumbnailPreview.src = imgPreview
}

async function profileEdit() {

    let avatar = document.getElementById("file-photo").files[0]
    let name = document.getElementById("fullname").value
    let username = document.getElementById("username").value
    let biodata = document.getElementById("biodata").value

    let userData = {
        firstName: name,
        username,
        biodata
    }

    if (avatar) {
        const { data, error } = await kontenbaseClient.storage.upload(avatar)
        userData.avatar = [data]
    }

    const { user, error } = await kontenbaseClient.auth.update(userData)
    console.log(user);

    window.location.href = "beranda.html"
}

async function renderProfile() {
    const { user, error } = await kontenbaseClient.auth.user()
    if (user) {
        let avatarProfile = document.getElementById("avatar-profile")
        let previewProfile = document.getElementById("thumbnail-preview")

        let fullname = document.getElementById("fullname")
        let username = document.getElementById("username")
        let biodata = document.getElementById("biodata")

        fullname.innerHTML = user.firstName
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
        previewProfile.src = user.avatar[0].url
    }

}

renderProfile()