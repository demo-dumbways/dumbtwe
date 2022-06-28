const API_KEY = '6e926aea-71c3-4445-9fbf-2b2c3c06b50a'

const kontenbaseClient = new kontenbase.KontenbaseClient({
    apiKey: API_KEY
})

let idUserRecipient = ''

const key = kontenbaseClient.realtime.subscribe('chats', { event: '*' }, (message) => {
    if (message.error) {
        console.log(message.error)
        return
    }

    getMessage(idUserRecipient)
    getListChats()
})
getListChats()

if (localStorage.idAnotherUser) {
    idUserRecipient = localStorage.getItem('idAnotherUser')
    localStorage.removeItem('idAnotherUser')
    getMessage(idUserRecipient)
}

async function getListChats() {
    kontenbaseClient.realtime.unsubscribe(key)
    const { user, error: errorUser } = await kontenbaseClient.auth.user()
    const { data: dataSender, error } = await kontenbaseClient.service('chats').find({
        where: {
            sender: user._id
        },
        lookup: '*',
        sort: { createdAt: 1 }
    });

    const { data: dataRecipient, error: errorRecipient } = await kontenbaseClient.service('chats').find({
        where: {
            recipient: user._id
        },
        lookup: '*',
        sort: { createdAt: 1 }
    });

    let chats = []

    dataSender.map((chat) => {
        if (Array.isArray(chat.recipient) && chat.recipient.length) {
            chat.recipient[0].createdAt = chat.createdAt
            chats.push(chat.recipient[0])
        }
    })

    dataRecipient.map((chat) => {
        if (typeof chat.sender == 'object') {
            chat.sender.createdAt = chat.createdAt
            chats.push(chat.sender)
        }
    })

    chats = [...new Map(chats.map(item =>
        [item['_id'], item])).values()]

    console.log(dataRecipient, chats);
    chats.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    renderListChats(chats)
}

function renderListChats(chats) {
    let listElement = document.getElementById("user-list")

    listElement.innerHTML = ''

    for (let i = 0; i < chats.length; i++) {
        listElement.innerHTML += `
            <div class="user-group">
                <div class="user"  onclick="getMessage('${chats[i]._id}')">
                <img src="${chats[i].avatar[0].url}" style="border-radius:50%" />
                <div>
                    <h4>${chats[i].firstName}</h4>
                    <span>@${chats[i].username}</span>
                </div>
             </div>
            <hr class="divider" />
    `
    }

}

async function getMessage(idAnotherUser) {
    kontenbaseClient.realtime.unsubscribe(key)
    idUserRecipient = idAnotherUser

    let cardSelected = document.getElementById("selected")
    let cardUnselected = document.getElementById("unselected")

    cardSelected.style.display = 'block'
    cardUnselected.style.display = 'none'


    const { user, error: errorUser } = await kontenbaseClient.auth.user()
    const { data: dataSender, error: errorSender } = await kontenbaseClient.service('chats').find({
        where: {
            sender: user._id,
            recipient: idAnotherUser
        },
        lookup: '*',
        sort: { createdAt: 1 }
    });

    const { data: dataRecipient, error: errorRecipient } = await kontenbaseClient.service('chats').find({
        where: {
            sender: idAnotherUser,
            recipient: user._id,
        },
        lookup: '*'
    });

    let dataChats = dataSender.concat(dataRecipient)

    dataChats.sort((a, b) => a.createdAt.localeCompare(b.createdAt))

    renderMessage(dataChats, idAnotherUser)
}

async function renderMessage(dataChats, idAnotherUser) {

    const { data, error } = await kontenbaseClient.service('Users').getById(idAnotherUser)

    let messageProfile = document.getElementById("profile-chat")
    let message = document.getElementById("message")
    message.innerHTML = ''

    messageProfile.innerHTML = `
        <div class="top">
          <div class="user-group">
            <div class="user">
            <img src="${data.avatar[0].url}" style="border-radius:50%" />
            <div>
                <h4>${data.firstName}</h4>
                <span>@${data.username}</span>
            </div>
            </div>
          </div>
        </div>
    `

    if (!dataChats) {
        return
    }
    console.log(dataChats);

    for (let i = 0; i < dataChats.length; i++) {
        message.innerHTML += `

        ${dataChats[i].sender._id == idAnotherUser ?
                `
                <div class="chat-left">
                    <p>
                    ${dataChats[i].message}
                    </p>
                </div>
                `
                :
                `
                <div class="chat-right">
                    <p>
                    ${dataChats[i].message}
                    </p>
                </div>
                `
            }`
    }
}

async function addMessage() {
    // const { user, error: errorUser } = await kontenbaseClient.auth.user()

    // console.log(idUserRecipient);
    let textMessage = document.getElementById("write-message").value

    const { data, error } = await kontenbaseClient.service('chats').create({
        message: textMessage,
        recipient: [idUserRecipient]
    })

    document.getElementById("write-message").value = ''
    getListChats()
    getMessage(idUserRecipient)
}
