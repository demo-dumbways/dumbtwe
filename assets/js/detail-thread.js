const API_KEY = '4d72be8d-f73a-406d-a9b8-303556d65731'

const kontenbaseClient = new kontenbase.KontenbaseClient({
    apiKey: API_KEY
})

let id = ''
async function getDetailThread() {
    id = new URL(window.location.href).searchParams.get("id")

    const { data, error } = await kontenbaseClient.service('thread').getById(id)

    renderDetailThread(data)
}

function renderDetailThread(data) {
    console.log(data);
    let thread = document.getElementById("thread-detail")
    // thread.innerHTML = ''

    thread.innerHTML = `
    <div class="middle-side" id="thread-detail">
      <div class="card p-20">
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
                <!-- <i class="fa-solid fa-ellipsis"></i> -->
                <i class="fa-solid fa-pen" style="font-size: 15px; margin-right: 10px;"></i>
                <i onclick="deleteThread()"class="fa-solid fa-trash" style="color: rgb(193, 48, 48); font-size: 15px;"></i>
              </div>
            </div>
            <div class="content-thread">
              <p>
                ${data.content}
              </p>
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
                <button class="btn-comment">
                  <i class="fa-solid fa-comment-dots"></i> Comment
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    `

}

async function deleteThread() {
    const { data, error } = await kontenbaseClient.service('thread').deleteById(id)

    window.location.href = "beranda.html"
}

getDetailThread()