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
