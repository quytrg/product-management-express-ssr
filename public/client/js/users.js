// Add friend feature
const addFriendButtonList = document.querySelectorAll('button[btn-add-friend]')
if (addFriendButtonList) {
    addFriendButtonList.forEach(button => {
        button.addEventListener('click', () => {
            const recipientId = button.getAttribute('btn-add-friend')
            const userBox = button.closest('.box-user')
            userBox.classList.add('add')
            socket.emit('CLIENT_ADD_FRIEND', recipientId)
        })
    })
}
// End add friend feature
