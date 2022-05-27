const API_KEY = '1c375960-d74a-4127-83b5-a3ca224b966b';

const kontenbaseClient = new kontenbase.KontenbaseClient({
  apiKey: API_KEY,
});

let threads = [];
let id = '';

async function logout() {
  const { user, error } = await kontenbaseClient.auth.logout();

  window.location.href = 'index.html';
}

async function renderAnotherUserProfile() {
  id = new URL(window.location.href).searchParams.get('id');

  let { data } = await kontenbaseClient
    .service('Users')
    .find({ where: { _id: id } });

  data = data[0];

  if (data) {
    let avatarProfile = document.getElementById('avatar-profile');
    let avatarThread = document.getElementById('avatar-thread');

    let fullname = document.getElementById('fullname');
    let username = document.getElementById('username');
    let biodata = document.getElementById('biodata');

    fullname.innerHTML = data.firstName;

    if (data.username) {
      username.innerHTML = '@' + data.username;
    } else {
      username.innerHTML = '@';
    }

    if (data.biodata) {
      biodata.innerHTML = data.biodata;
    } else {
      biodata.innerHTML = '-';
    }

    if (data.avatar) {
      avatarProfile.src = data.avatar[0]?.url;
      avatarThread.src = data.avatar[0]?.url;
    }
  }
}

async function getThreads() {
  let { data, error } = await kontenbaseClient.service('thread').find();

  data = data.filter((item, idx) => {
    if (item.owner._id == id) {
      return item;
    }
  });

  if (data) {
    console.log(data);
    threads = data;
    renderThreads();
  } else {
    console.log(error);
  }

  localStorage.removeItem('hastag');
}

async function renderThreads() {
  // console.log(threads);
  let threadContainer = document.getElementById('thread-container');
  threadContainer.innerHTML = '';
  // console.log(threadContainer);
  for (let i = 0; i < threads.length; i++) {
    const isLogin = false;

    threadContainer.innerHTML += `
          <div class="card p-20 view-thread" onclick="location.href='detail-thread.html?id=${
            threads[i]._id
          }'">
            <div class="left">
            <img src="${
              threads[i].owner?.avatar
                ? threads[i].owner.avatar[0].url
                : '/assets/img/default-user.jpeg'
            }" alt="">
            </div>
            <div class="right">
              <div class="top">
                <div class="profile-user">
                  <div onclick="location.href = 'another-thread.html?id=${
                    threads[i].owner._id
                  }'; event.stopPropagation()">
                    <h3>${threads[i].owner.firstName}</h3>
                    <span><i class="fa-solid fa-circle-check"></i></span>
                    <span>${
                      threads[i].owner.username
                        ? threads[i].owner.username
                        : '@'
                    }</span>
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
                <a onclick="navigateHastag('${
                  threads[i].hastag
                }'); event.stopPropagation()">
                  <p>
                    #${threads[i].hastag}
                  </p>
                </a>
                ${
                  threads[i].photo
                    ? `<img src=" ${threads[i].photo[0].url}" alt="">`
                    : ''
                }
              </div>
              <div class="bottom">
                <div class="react-view">
                  <div class="react-group">
                    <i class="fa-solid fa-heart"></i> <span>${await getThreadLike(
                      threads[i]._id
                    )}<span>
                  </div>
                  <div class="react-group">
                    <i class="fa-solid fa-comment-dots"></i> <span>${await getThreadComment(
                      threads[i]._id
                    )}</span>
                  </div>
                </div>
                <div class="react-button">
                ${
                  (await checkUserLike(threads[i]._id))
                    ? `<button class="btn-dislike" onclick="dislikeThread('${threads[i]._id}'); event.stopPropagation()">
                  <i class="fa-solid fa-heart"></i> Like
                </button>`
                    : `<button class="btn-like" onclick="likeThread('${threads[i]._id}'); event.stopPropagation()">
                    <i class="fa-solid fa-heart"></i> Like
                  </button>`
                }
                
                  <button class="btn-comment" onclick="location.href='detail-thread.html?id=${
                    threads[i]._id
                  }'; event.stopPropagation()">
                    <i class=" fa-solid fa-comment-dots"></i> Comment
                  </button>
                </div>
              </div>
            </div>
          </div>
          `;
  }
}

async function getThreadLike(id) {
  const { data, error } = await kontenbaseClient.service('like').count({
    where: { thread: id },
  });

  return data.count;
}

async function likeThread(id) {
  const { user, error: errorUser } = await kontenbaseClient.auth.user();

  if (errorUser) {
    return console.log(errorUser);
  }

  const { error } = await kontenbaseClient.service('like').create({
    thread: [id],
    Users: [user._id],
  });

  if (error) {
    console.log(error);
  }

  getThreads();
}

async function dislikeThread(id) {
  const { user, error: errorUser } = await kontenbaseClient.auth.user();

  const { data, error } = await kontenbaseClient.service('like').find({
    where: { thread: id, Users: user._id },
    lookup: '*',
  });

  if (error || data.length == 0) {
    return console.log(error);
  }

  const { error: errorLike } = await kontenbaseClient
    .service('like')
    .deleteById(data[0]._id);

  if (errorLike) {
    return console.log(errorLike);
  }

  getThreads();
}

async function checkUserLike(threadId) {
  const { user, error: errorUser } = await kontenbaseClient.auth.user();

  const { data, error } = await kontenbaseClient.service('like').find({
    where: {
      thread: [threadId],
      Users: [user._id],
    },
  });

  const isLike = data.length != 0 ? true : false;
  return isLike;
}

async function getThreadComment(id) {
  const { data, error } = await kontenbaseClient.service('comment').count({
    where: { thread: id },
  });

  return data.count;
}

getThreads();

renderAnotherUserProfile();
