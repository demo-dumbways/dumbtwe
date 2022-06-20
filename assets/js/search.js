async function search(e) {
    if (e.key === "Enter") {
        const searchData = document.getElementById("search").value

        // const { data, error } = await kontenbaseClient.service('Users').find({
        //     or: [
        //         { firstName: { $contains: searchData } },
        //         { username: { $contains: searchData } }
        //     ]
        // })

        const { data: dataUsers, error } = await kontenbaseClient.service('Users').find({
            where: { firstName: { $contains: searchData } },
            lookup: ['following', 'followers']
        })

        const { data: dataThreads, error: errorThreads } = await kontenbaseClient.service('thread').find({
            where: { hastag: { $contains: searchData } }
        })

        renderSearchResults(dataUsers, dataThreads)
    }
}


async function renderSearchResults(dataUsers, dataThreads) {
    let contentElement = document.getElementById("middle-side")
    contentElement.innerHTML = ''

    if (dataUsers.length != 0) {
        for (let i = 0; i < dataUsers.length; i++) {

            contentElement.innerHTML += `
                <div class="card list-follow p-20" style="margin-top:0; margin-bottom:20">
                    <div class="list-suggest">
                        <div class="suggest">
                            <div class="avatar">
                                <img src="${dataUsers[i].avatar[0].url}" alt="" style="height:60px; width:60px; ">
                            </div>
    
                            <div class="account" style="flex:8">
                                <a href = 'another-user.html?id=${dataUsers[i]._id}'>
                                ${dataUsers[i].firstName}
                                </a>
                                <p>@${dataUsers[i].username}</p>
                            </div>
                            
                            <div class="btn-follow">
                            ${dataUsers[i].followers.length != 0 ? `<button style="background-color: grey;">Unfollow</button>` : `<button style="background-color: #00b7df; color:white">Follow</button>`}
                                
                            </div>
                        </div>
                    </div>
                </div>
        `
        }
    }
    if (dataThreads.length != 0) {
        for (let i = 0; i < dataThreads.length; i++) {
            contentElement.innerHTML += `
            <div class="card p-20 view-thread" onclick="location.href='detail-thread.html?id=${dataThreads[i]._id}'">
                <div class="left">
                    <img src="${dataThreads[i].owner.avatar[0].url}" alt="">
                </div>
                <div class="right">
                    <div class="top">
                    <div class="profile-user">
                        <div onclick="location.href = 'another-user.html?id=${dataThreads[i].owner._id}'; event.stopPropagation()">
                        <h3>${dataThreads[i].owner.firstName}</h3>
                        <span>${dataThreads[i].owner.username}</span>
                        </div>
                        <span>33 minutes ago</span>
                    </div>
                    <div class="options">
                        <i class="fa-solid fa-ellipsis"></i>
                    </div>
                    </div>
                    <div class="content-thread">
                        <p>
                            ${dataThreads[i].content}
                        </p>
                        <a onclick="navigateHastag('${dataThreads[i].hastag}'); event.stopPropagation()">
                            <p>
                            #${dataThreads[i].hastag}
                            </p>
                        </a>
                        ${dataThreads[i].photo ? `<img src=" ${dataThreads[i].photo[0].url}" alt="">` : ''}
                    </div>
                    <div class="bottom">
                        <div class="react-view">
                            <div class="react-group">
                            <i class="fa-solid fa-heart"></i><span>${await getThreadLike(threads[i]._id)}</span>
                            </div>
                            <div class="react-group">
                            <i class="fa-solid fa-comment-dots"></i><span>${await getThreadCommentCount(threads[i]._id)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `
        }
    }

    if (dataUsers.length == 0 && dataThreads.length == 0) {
        contentElement.innerHTML += `
        <div class="card list-follow p-20" style="margin-top:0; margin-bottom:20; text-align:center">
        <img src="./assets/img/notfound.jpg"/ style="height:400px; border-radius:15px;">
        </div>
        `
    }

}
