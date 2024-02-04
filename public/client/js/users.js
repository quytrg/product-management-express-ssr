// Add friend feature
const addFriendsButtonList = document.querySelectorAll('button[btn-add-friend]')
if (addFriendsButtonList) {
    addFriendsButtonList.forEach(button => {
        button.addEventListener('click', () => {
            const recipientId = button.getAttribute('btn-add-friend')
            const userBox = button.closest('.box-user')
            userBox.classList.add('add')
            socket.emit('CLIENT_ADD_FRIEND', recipientId)
        })
    })
}
// End add friend feature

// Friend request cencellation feature
const CancelFriendsButtonList = document.querySelectorAll('button[btn-cancel-friend]')
if (CancelFriendsButtonList) {
    CancelFriendsButtonList.forEach(button => {
        button.addEventListener('click', () => {
            const recipientId = button.getAttribute('btn-cancel-friend')
            const userBox = button.closest('.box-user')
            userBox.classList.remove('add')
            socket.emit('CLIENT_CANCEL_FRIEND_REQUEST', recipientId)
        })
    })
}
// End friend request cencellation feature

// Confirm friend request
const friendConfirmationButtonList = document.querySelectorAll('button[btn-confirm-request]')
if (friendConfirmationButtonList) {
    friendConfirmationButtonList.forEach(button => {
        button.addEventListener('click', () => {
            const requestSenderId = button.getAttribute('btn-confirm-request')
            const userBox = button.closest('.box-user')
            userBox.classList.add('accepted')
            socket.emit('CLIENT_CONFIRM_REQUEST', requestSenderId)
        })
    })
}
// End confirm friend request

// Refuse friend request
const friendRefusalButtonList = document.querySelectorAll('button[btn-refuse-request]')
if (friendRefusalButtonList) {
    friendRefusalButtonList.forEach(button => {
        button.addEventListener('click', () => {
            const requestSenderId = button.getAttribute('btn-refuse-request')
            const userBox = button.closest('.box-user')
            userBox.classList.add('refuse')
            socket.emit('CLIENT_REFUSE_REQUEST', requestSenderId)
        })
    })
}
// End refuse friend request

// Unfriend
const unfriendButtonList = document.querySelectorAll('button[btn-unfriend]')
if (unfriendButtonList) {
    unfriendButtonList.forEach(button => {
        button.addEventListener('click', () => {
            const userBox = button.closest('.box-user')
            userBox.classList.add('unfriend')
            const recipientId = button.getAttribute('btn-unfriend')
            socket.emit('CLIENT_UNFRIEND', recipientId)
        })
    })
}
// End unfriend

// Friend request notification
const friendRequestNoti = document.querySelector('span[badge-users-accept]')
if (friendRequestNoti) {
    socket.on('SERVER_SEND_FRIEND_REQUEST_NOTIFICATION', async ({ recipientId, numRequest }) => {
        const userId = friendRequestNoti.getAttribute('badge-users-accept')
        if (userId === recipientId) {
            friendRequestNoti.textContent = numRequest
        }
    })
}
// End friend request notification

// Render friend request list realtime
const acceptFriends = document.querySelector('div[accept-friends]')
if (acceptFriends) {
    socket.on('SERVER_SEND_SENDER_INFO', async ({ recipientId, senderInfo }) => {
        const userId = acceptFriends.getAttribute('accept-friends')
        if (userId === recipientId) {
            const boxUserContainer = document.createElement('div')
            boxUserContainer.classList.add('col-3')
            boxUserContainer.setAttribute('user-id', senderInfo._id)

            const htmlString = `
            <div class="box-user">
                <div class="inner-avatar"><img src="${senderInfo.avatar ? senderInfo.avatar : "/images/img_avatar.jpg"}" alt="${senderInfo.fullName}"></div>
                <div class="inner-info">
                    <div class="inner-name">${senderInfo.fullName}</div>
                    <div class="inner-buttons">
                        <button class="btn btn-sm btn-primary me-1" btn-confirm-request="${senderInfo._id}">Chấp nhận</button>
                        <button class="btn btn-sm btn-primary me-1" btn-accepted-request="">Bạn bè</button>
                        <button class="btn btn-sm btn-secondary me-1" btn-refuse-request="${senderInfo._id}">Từ chối</button>
                        <button class="btn btn-sm btn-secondary me-1" btn-refused-request="">Đã từ chối</button>
                    </div>
                </div>
            </div>
            `
            boxUserContainer.innerHTML = htmlString
            acceptFriends.insertBefore(boxUserContainer, acceptFriends.firstChild)

            // add event listener to new box user
            // confirm friend request
            const friendConfirmationButton = boxUserContainer.querySelector('button[btn-confirm-request]')
            if (friendConfirmationButton) {
                friendConfirmationButton.addEventListener('click', () => {
                    const requestSenderId = friendConfirmationButton.getAttribute('btn-confirm-request')
                    const userBox = friendConfirmationButton.closest('.box-user')
                    userBox.classList.add('accepted')
                    socket.emit('CLIENT_CONFIRM_REQUEST', requestSenderId)
                })
                
            }
            // refuse friend request
            const friendRefusalButton = boxUserContainer.querySelector('button[btn-refuse-request]')
            if (friendRefusalButton) {
                friendRefusalButton.addEventListener('click', () => {
                    const requestSenderId = friendRefusalButton.getAttribute('btn-refuse-request')
                    const userBox = friendRefusalButton.closest('.box-user')
                    userBox.classList.add('refuse')
                    socket.emit('CLIENT_REFUSE_REQUEST', requestSenderId)
                })
            }
        }
    })
}
// End render friend request list realtime

// Remove sender info from recipient's 'accept list' 
if (acceptFriends) {
    socket.on('SERVER_CANCEL_FRIEND_REQUEST', async ({ recipientId, senderId }) => {
        const userId = acceptFriends.getAttribute('accept-friends')
        if (userId === recipientId) {
            const senderBox = acceptFriends.querySelector(`[user-id="${senderId}"]`)
            if (senderBox) {
                acceptFriends.removeChild(senderBox)
            }
        }
    })
}
// End remove sender info from recipient's 'accept list' 

// Remove sender info from user list
const userList = document.querySelector('[data-users-not-friend]')
if (userList) {
    socket.on('SERVER_ADD_FRIEND', async ({ recipientId, senderId }) => {
        const userId = userList.getAttribute('data-users-not-friend')
        if (userId === recipientId) {
            const senderBox = userList.querySelector(`[user-id="${senderId}"]`)
            if (senderBox) {
                userList.removeChild(senderBox)
            }
        }
    })
}
// End remove sender info from user list

// Display online tag 
const friendList = document.querySelector('[data-friend]')
if (friendList) {
    socket.on('SERVER_SEND_ONLINE_STATUS', ({ userId }) => {
        const userBox = friendList.querySelector('[online-status]')
        userBox.setAttribute('online-status', 'online')
    })
}
// End display online tag

// Hide online tag
if (friendList) {
    socket.on('SERVER_SEND_OFFLINE_STATUS', ({ userId }) => {
        const userBox = friendList.querySelector('[online-status]')
        userBox.setAttribute('online-status', 'offline')
    })
}
// End hide online tag
