const API_KEY = '418b6bfa-1779-4233-a788-7c0f7ac40251'

const kontenbaseClient = new kontenbase.KontenbaseClient({
    apiKey: API_KEY
})

async function profileEdit() {
    let avatar = document.getElementById('file-photo').files[0];
    let name = document.getElementById("fullname").value
    let username = document.getElementById("username").value
    let email = document.getElementById("email").value
    let biodata = document.getElementById("biodata").value

    let user = {
        firstName: name,
        username,
        biodata
    }
    if (avatar) {
        const { data: dataAvatar, error: errorAvatar } = await kontenbaseClient.storage.upload(avatar);
        user.avatar = [dataAvatar]
    }

    const { data, error } = await kontenbaseClient.auth.update(user);

    // alert("Edit Profile Succes")
    // renderUserInfo()
    window.location.href = "beranda.html"
}

async function renderUserInfo() {
    const { user, error } = await kontenbaseClient.auth.user();

    console.log(user);
    document.getElementById("fullname").value = user.firstName
    document.getElementById("username").value = user.username ? user.username : ""
    document.getElementById("email").value = user.email
    // console.log(userData);
}

function changeName() {
    const photo = document.getElementById("file-photo").files[0]
    const photoElement = document.getElementById("photo-name")

    if (photo) {
        photoElement.innerHTML = photo.name
    }

    let thumbnailPreview = document.getElementById('thumbnail-preview');
    let imgPreview = URL.createObjectURL(photo);
    thumbnailPreview.src = imgPreview;
}

renderUserInfo()