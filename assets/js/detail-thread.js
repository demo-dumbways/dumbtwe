const API_KEY = '1c375960-d74a-4127-83b5-a3ca224b966b';

const kontenbaseClient = new kontenbase.KontenbaseClient({
  apiKey: API_KEY,
});

let id = '';
async function getDetailThread() {
  id = new URL(window.location.href).searchParams.get('id');

  const { data, error } = await kontenbaseClient.service('thread').getById(id);
  renderDetailThread(data);
}

async function renderDetailThread(data) {
  let thread = document.getElementById('thread-detail');

  document.getElementById('comment-thread').style.display = 'block';

  thread.innerHTML = `
        <div class="view-thread">
          <div class="left">
            <img src="./assets/img/profile.jpg" alt="">
          </div>
          <div class="right">
            <div class="top">
              <div class="profile-user">
                <div>
                  <h3>Ilham Fathullah</h3>
                  <span>@ilham</span>
                </div>
                <span>33 minutes ago</span>
              </div>
              <div class="options">
                <i onclick="renderEditThread()" class="fa-solid fa-pen" style="font-size: 15px; margin-right: 10px;"></i>
                <i onclick="deleteThread()" class="fa-solid fa-trash" style="color: rgb(193, 48, 48); font-size: 15px;"></i>
              </div>
            </div>
            <div class="content-thread">
              <p>
                ${data.content}
              </p>
              ${data.photo ? `<img src="${data.photo[0].url}" alt="">` : ''}
            </div>
            <div class="bottom">
              <div class="react-view">
                <div class="react-group">
                  <i class="fa-solid fa-heart"></i> <span>${await getThreadLike(
                    data._id
                  )}</span>
                </div>
                <div class="react-group">
                  <i class="fa-solid fa-comment-dots"></i> <span>${await getThreadCommentCount(
                    data._id
                  )}</span>
                </div>
              </div>
              <div class="react-button">
              ${
                (await checkUserLike(data._id))
                  ? `<button class="btn-dislike" onclick="dislikeThread('${data._id}'); event.stopPropagation()">
                <i class="fa-solid fa-heart"></i> Like
              </button>`
                  : `<button class="btn-like" onclick="likeThread('${data._id}'); event.stopPropagation()">
                  <i class="fa-solid fa-heart"></i> Like
                </button>`
              }
                <button class="btn-comment" onclick="document.getElementById('comment-message').select()">
                  <i class="fa-solid fa-comment-dots"></i> Comment
                </button>
              </div>
            </div>
          </div>
        </div>
    `;
}

async function renderEditThread() {
  const { data, error } = await kontenbaseClient.service('thread').getById(id);

  document.getElementById('comment-thread').style.display = 'none';
  let thread = document.getElementById('thread-detail');
  // thread.innerHTML = ''

  thread.innerHTML = `
  <div class="card p-20 post-thread">
        <div class="left">
          <img src="./assets/img/profile.jpg" alt="">
        </div>
        <div class="right">
          <form id="form-thread">
            <textarea id="content" placeholder="What's happening?" rows="5">${data.content}</textarea>
            <input id="hastag" type="text" placeholder="# Hastag (optional)" value="${data.hastag}">
            <div class="file-button-group">
              <div class="file">
                <label for="file-photo">
                  <i class="fa-solid fa-image"></i> <span id="photo-name"> Photo</span>
                </label>
                <input type="file" hidden id="file-photo" onchange="changeName()">
                <label for="file-video">
                  <i class="fa-solid fa-circle-play"></i> <span id="video-name"> Video</span>
                </label>
                <input type="file" hidden id="file-video" onchange="changeName()">
              </div>
              <div class="btn-publish">
                <button type="button" onclick="getDetailThread()">Cancel</button>
                <button type="button" onclick="updateThread()">Update</button>
              </div>
            </div>
          </form>
        </div>
      </div>
  `;
}

async function updateThread() {
  const content = document.getElementById('content').value;
  const hastag = document.getElementById('hastag').value;
  const photo = document.getElementById('file-photo').files[0];
  const video = document.getElementById('file-video').files[0];

  let thread = {
    content,
    hastag,
  };

  if (photo) {
    const { data: dataThumbnailPhoto, error: errorThumbnailPhoto } =
      await kontenbaseClient.storage.upload(photo);
    thread.photo = [dataThumbnailPhoto];
  }

  if (video) {
    const { data: dataThumbnailVideo, error: errorThumbnailVideo } =
      await kontenbaseClient.storage.upload(video);
    thread.video = [dataThumbnailVideo];
  }

  const { data, error } = await kontenbaseClient
    .service('thread')
    .updateById(id, thread);

  getDetailThread();
}

async function deleteThread() {
  const { data, error } = await kontenbaseClient
    .service('thread')
    .deleteById(id);

  window.location.href = 'beranda.html';
}

function changeName() {
  const photo = document.getElementById('file-photo').files[0];
  const photoElement = document.getElementById('photo-name');

  const video = document.getElementById('file-video').files[0];
  const videoElement = document.getElementById('video-name');

  if (photo) {
    photoElement.innerHTML = photo.name;
  }
  if (video) {
    videoElement.innerHTML = video.name;
  }
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

  getDetailThread();
}

async function dislikeThread(id) {
  const { user, error: errorUser } = await kontenbaseClient.auth.user();

  const { data, error } = await kontenbaseClient.service('like').find({
    where: { thread: id, Users: user._id },
    lookup: '*',
  });

  if (error || data.length == 0) {
    console.log(data);
    return console.log(error);
  }

  const { error: errorLike } = await kontenbaseClient
    .service('like')
    .deleteById(data[0]._id);

  if (errorLike) {
    return console.log(errorLike);
  }

  getDetailThread();
}

async function checkUserLike(threadId) {
  const { user, error: errorUser } = await kontenbaseClient.auth.user();

  const { data, error } = await kontenbaseClient.service('like').find({
    where: {
      thread: [threadId],
      Users: [user._id],
    },
    lookup: '*',
  });

  const isLike = data.length != 0 ? true : false;

  return isLike;
}

async function getThreadLike(id) {
  const { data, error } = await kontenbaseClient.service('like').count({
    where: { thread: id },
  });

  return data.count;
}

async function getThreadCommentCount(id) {
  const { data, error } = await kontenbaseClient.service('comment').count({
    where: { thread: id },
  });

  return data.count;
}

async function commentThread() {
  const message = document.getElementById('comment-message');

  const { user, error: errorUser } = await kontenbaseClient.auth.user();

  if (errorUser) {
    return console.log(errorUser);
  }

  const { error } = await kontenbaseClient.service('comment').create({
    message: message.value,
    thread: [id],
    user: [user._id],
  });

  if (error) {
    console.log({
      message,
      thread: [id],
      user: [user._id],
    });
    return console.log(error);
  }

  message.value = '';

  getCommentThread();
  getDetailThread();
}

async function getCommentThread() {
  id = new URL(window.location.href).searchParams.get('id');

  const { data, error } = await kontenbaseClient.service('comment').find({
    where: { thread: id },
    lookup: 'user',
  });

  if (error) {
    return console.log(error);
  }

  const CommentElement = document.getElementById('comment-list');
  CommentElement.innerHTML = '';

  await data.forEach((item, idx) => {
    CommentElement.innerHTML += `<div class="comment-item">
                                  <div class="comment-name">${
                                    item.user[0].username
                                      ? item.user[0].username
                                      : item.user[0].firstName
                                  }</div>
                                  <div class="comment-message">${
                                    item.message
                                  }</div>
                                </div>`;
  });

  console.log(CommentElement);
}

getDetailThread();

getCommentThread();
