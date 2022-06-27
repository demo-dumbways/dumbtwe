
const API_KEY = '6e926aea-71c3-4445-9fbf-2b2c3c06b50a'

const kontenbaseClient = new kontenbase.KontenbaseClient({
    apiKey: API_KEY
})

async function renderUserInfo() {
    const { user, error } = await kontenbaseClient.auth.user()
    if (user.username) {
        document.getElementById("username").value = user.username
    }

    document.getElementById("fullname").value = user.firstName

    document.getElementById("email").value = user.email
    if (user.biodata) {
        document.getElementById("biodata").value = user.biodata
    }
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

    window.location.href = "beranda.html"
}

async function renderProfile() {
    const { user, error } = await kontenbaseClient.auth.user({
        lookup: ['following', 'followers']
    })
    if (user) {
        let avatarProfile = document.getElementById("avatar-profile")
        let previewProfile = document.getElementById("thumbnail-preview")

        let fullname = document.getElementById("fullnameProfile")
        let username = document.getElementById("usernameProfile")
        let biodata = document.getElementById("biodataProfile")
        let followers = document.getElementById("followers")
        let following = document.getElementById("following")

        followers.innerHTML = user.followers.length
        following.innerHTML = user.following.length

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

        if (user.avatar) {
            avatarProfile.src = user.avatar[0].url
            previewProfile.src = user.avatar[0].url
        }
    }

}

renderProfile()