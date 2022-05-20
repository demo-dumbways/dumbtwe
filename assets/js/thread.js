async function addThread() {
    const content = document.getElementById("content").value
    const hastag = document.getElementById("hastag").value
    const photo = document.getElementById("file-photo").files[0]
    const video = document.getElementById("file-video").files[0]

    // const { data: dataThumbnailPhoto, error: errorThumbnailPhoto } = await kontenbaseClient.storage.upload(photo);
    // const { data: dataThumbnailVideo, error: errorThumbnailVideo } = await kontenbaseClient.storage.upload(video);

    // let thread = {
    //     content,
    //     hastag,
    //     photo: [dataThumbnailPhoto],
    //     video: [dataThumbnailVideo]
    // }

    // await kontenbaseClient.service('thread').create(thread);

    getData()
}

function changeName() {
    const photo = document.getElementById("file-photo").files[0]
    const photoElement = document.getElementById("photo-name")

    const video = document.getElementById("file-video").files[0]
    const videoElement = document.getElementById("video-name")

    if (photo) {
        photoElement.innerHTML = photo.name
    }
    if (video) {
        videoElement.innerHTML = video.name
    }
}

async function getData() {
    const { data, error } = await kontenbaseClient.service('thread').find();

    if (data) {
        thread = data;
        renderProject();
    } else {
        console.log(error);
    }
}

const data = [
    {
        content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloribus, eos!Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloribus, eos!",
        like: "234"
    },
    {
        content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. ",
        like: "34"
    },
    {
        content: "Doloribus, eos!Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloribus, eos!",
        like: "24"
    },
    {
        content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloribus, eos!Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloribus, eos!",
        like: "2"
    },
]

async function renderThread() {
    let threadContainer = document.getElementById("thread-container")
    // console.log(threadContainer);
    for (let i = 0; i < data.length; i++) {
        threadContainer.innerHTML += `
        <div class="card p-20 view-thread" onclick="location.href='detail-thread.html'">
          <div class="left">
            <img src="./assets/img/profile-1.jpg" alt="">
          </div>
          <div class="right">
            <div class="top">
              <div class="profile-user">
                <div>
                  <h3>Tom Cruise</h3>
                  <span><i class="fa-solid fa-circle-check"></i></span>
                  <span>@tomtom</span>
                </div>
                <span>33 minutes ago</span>
              </div>
              <div class="options">
                <i class="fa-solid fa-ellipsis"></i>
              </div>
            </div>
            <div class="content-thread">
              <p>
                ${data[i].content}
              </p>
              <img src="./assets/img/thread-1.jpg" alt="">
            </div>
            <div class="bottom">
              <div class="react-view">
                <div class="react-group">
                  <i class="fa-solid fa-heart"></i> <span>742k</span>
                </div>
                <div class="react-group">
                  <i class="fa-solid fa-comment-dots"></i> <span>142</span>
                </div>
              </div>
              <div class="react-button">
                <button class="btn-like">
                  <i class="fa-solid fa-heart"></i> Like
                </button>
                <button class="btn-comment" onclick="alert('haihai'); event.stopPropagation()">
                  <i class=" fa-solid fa-comment-dots"></i> Comment
                </button>
              </div>
            </div>
          </div>
        </div>
        `

    }
}

renderThread()

// getData();


