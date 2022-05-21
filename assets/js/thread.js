let threads = []

async function addThread() {
  const content = document.getElementById("content").value
  const hastag = document.getElementById("hastag").value
  const photo = document.getElementById("file-photo").files[0]
  const video = document.getElementById("file-video").files[0]

  let thread = {
    content,
    hastag,
  }

  if (photo) {
    const { data: dataThumbnailPhoto, error: errorThumbnailPhoto } = await kontenbaseClient.storage.upload(photo);
    thread.photo = [dataThumbnailPhoto]
  }

  if (video) {
    const { data: dataThumbnailVideo, error: errorThumbnailVideo } = await kontenbaseClient.storage.upload(video);
    thread.video = [dataThumbnailVideo]

  }

  // if (errorThumbnailPhoto) {
  //   return console.log(errorThumbnailPhoto);
  // }



  await kontenbaseClient.service('thread').create(thread);

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

  // console.log(data);
  if (data) {
    threads = data;
    renderThread();
  } else {
    console.log(error);
  }
}

function renderThread() {
  console.log(threads);
  let threadContainer = document.getElementById("thread-container")
  threadContainer.innerHTML = ''
  // console.log(threadContainer);
  for (let i = 0; i < threads.length; i++) {
    const isLogin = false
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
                ${threads[i].content}
              </p>
              ${threads[i].photo ? `<img src=" ${threads[i].photo[0].url}" alt="">` : ''}
            </div>
            <div class="bottom">
              <div class="react-view">
                <div class="react-group">
                  <i class="fa-solid fa-heart"></i> <span>345<span>
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

getData();


