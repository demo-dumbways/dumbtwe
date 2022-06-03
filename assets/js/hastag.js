const API_KEY = 'aea64958-96f0-45dc-b3cc-e9991afd890e'

const kontenbaseClient = new kontenbase.KontenbaseClient({
  apiKey: API_KEY
})

let threads = []


async function getThreads() {
  const hastag = localStorage.getItem("hastag")
  document.getElementById("search-bar").value = '#' + hastag

  const { data, error } = await kontenbaseClient.service('thread').find({
    where: { hastag: hastag },
  })

  if (data) {
    threads = data;
    renderThreads();
  } else {
    console.log(error);
  }
}

async function renderThreads() {
  console.log(threads);
  let threadContainer = document.getElementById("thread-container")
  threadContainer.innerHTML = ''
  // console.log(threadContainer);
  for (let i = 0; i < threads.length; i++) {
    const isLogin = false
    threadContainer.innerHTML += `
          <div class="card p-20 view-thread" onclick="location.href='detail-thread.html?id=${threads[i]._id}'">
            <div class="left">
            <img src="${threads[i].owner.avatar[0].url}" alt="">
            </div>
            <div class="right">
              <div class="top">
                <div class="profile-user">
                  <div>
                    <h3>${threads[i].owner.firstName}</h3>
                    <span><i class="fa-solid fa-circle-check"></i></span>
                    <span>@${threads[i].owner.username}</span>
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
                <a onclick="navigateHastag('${threads[i].hastag}'); event.stopPropagation()">
                  <p>
                    #${threads[i].hastag}
                  </p>
                </a>
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

async function renderProfile() {

  const { user, error } = await kontenbaseClient.auth.user();

  let avatarProfile = document.getElementById("avatar-profile")

  let fullname = document.getElementById("fullname")
  let username = document.getElementById("username")
  let biodata = document.getElementById("biodata")

  fullname.innerHTML = user.firstName
  if (user.username) {
    username.innerHTML = '@' + user.username
  } else {
    username.innerHTML = '@'
  }

  if (user.biodata) {
    biodata.innerHTML = user.biodata
  } else {
    biodata.innerHTML = '-'
  }

  avatarProfile.src = user.avatar[0].url

}

renderProfile()
getThreads()