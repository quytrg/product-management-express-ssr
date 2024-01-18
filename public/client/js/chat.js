import * as Popper from 'https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js'

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
        const typingList = chatBody.querySelector('.inner-list-typing')
        chatBody.insertBefore(chatDiv, typingList)

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

// Show typing
let timeOutHiddenTyping
function showTyping() {
    socket.emit('CLIENT_SEND_TYPING', 'show')
    clearTimeout(timeOutHiddenTyping)
    timeOutHiddenTyping = setTimeout(() => {
        socket.emit('CLIENT_SEND_TYPING', 'hidden')
    }, 3000)
}
// End show typing


// emoji-picker-element
const chatBox = document.querySelector('.chat') 
if (chatBox) {
    // toggle emoji button
    const button = chatBox.querySelector('.toggle-emoji')
    const tooltip = chatBox.querySelector('.tooltip')
    Popper.createPopper(button, tooltip)

    const toggleEmoji = chatBox.querySelector('.toggle-emoji')
    toggleEmoji.onclick = () => {
        tooltip.classList.toggle('shown')
    }
    document.addEventListener('click', (e) => {
        let isClickInsideElement = toggleEmoji.contains(e.target);

        // click outside toggle emoji button
        if (!isClickInsideElement) {
            tooltip.classList.remove('shown')
        }
    })

    // insert emoji to chat content
    const chatContent = chatBox.querySelector('input[name="content"]')
    chatBox.querySelector('emoji-picker')
        .addEventListener('emoji-click', (e) => {
            chatContent.value += e.detail.unicode
            chatContent.focus();
            const end = chatContent.value.length
            chatContent.setSelectionRange(end, end);
            showTyping()
        });
}
// End emoji-picker-element

// CLIENT_SEND_TYPING
if (chatBox) {
    const chatInput = chatBox.querySelector('input[name="content"]')
    chatInput.addEventListener('keyup', () => {
        showTyping()
    })
}
// End CLIENT_SEND_TYPING

// SERVER_SEND_TYPING
socket.on('SERVER_SEND_TYPING', (typingInfo) => {
    const typingList = chatBody.querySelector('.inner-list-typing')
    const userTyping = typingList.querySelector(`[user-id="${typingInfo.user_id}"]`)
    if (typingInfo.flag === 'show') {
        if (!userTyping) {
            const typingBoxString = `
            <div class='box-typing' user-id="${typingInfo.user_id}">
                <div class="inner-name">${typingInfo.fullName}</div>
                <div class="inner-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
            `
            const typingBoxElement = document.createRange().createContextualFragment(typingBoxString)
            typingList.appendChild(typingBoxElement)

            // Scroll chat to bottom
            chatBody.scrollTop = chatBody.scrollHeight
        }
    }
    else {
        typingList.removeChild(userTyping)
    }
})
// End SERVER_SEND_TYPING


