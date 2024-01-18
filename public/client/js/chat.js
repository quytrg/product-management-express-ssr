// CLIENT_SEND_MESSAGE
const formSendChat = document.querySelector('form[form-send-chat]')
if (formSendChat) {
    formSendChat.addEventListener('submit', (e) => {
        e.preventDefault()
        const content = e.target.elements.content.value
        if (content) {
            socket.emit('CLIENT_SEND_MESSAGE', content)
            e.target.elements.content.value = ''
        }
    })
}
// End CLIENT_SEND_MESSAGE

// SERVER_SEND_MESSAGE
socket.on('SERVER_SEND_MESSAGE', (messageInfo) => {
    const chatBox = document.querySelector('.chat')
    if (chatBox) {
        const myId = chatBox.getAttribute('my-id')
        const chatBody = chatBox.querySelector('.inner-body')

        const chatDiv = document.createElement('div')
        let chatContent = ''
        if (myId === messageInfo.user_id) {
            chatContent = `
                <div class="inner-outgoing">
                    <div class="inner-content">${messageInfo.content}</div>
                </div>
            `
        }
        else {
            chatContent = `
                <div class="inner-incoming">
                    <div class="inner-name">${messageInfo.fullName}</div>
                    <div class="inner-content">${messageInfo.content}</div>
                </div>
            `
        }
        chatDiv.innerHTML = chatContent
        chatBody.appendChild(chatDiv)
        chatBody.scrollTop = chatBody.scrollHeight
    }
})
// End SERVER_SEND_MESSAGE

// Scroll chat to bottom
const chatBody = document.querySelector('.chat .inner-body')
if (chatBody) {
    chatBody.scrollTop = chatBody.scrollHeight
}
// End scroll chat to bottom
