const Chat = require('../../models/chat.model')

const uploadImage = require('../../helpers/uploadImage')

module.exports = async (req, res) => {
    const userId = res.locals.user.id
    const chatRoomId = req.params.chatRoomId
    io.once('connection', (socket) => {
        socket.join(chatRoomId)
        // receive message
        socket.on('CLIENT_SEND_MESSAGE', async (data) => {
            

            const images = []
            for (const imageBuffer of data.images) {
                const cloudinaryLink = await uploadImage.uploadToCloudinary(imageBuffer)
                images.push(cloudinaryLink) 
            }

            const chatObj = {
                user_id: userId,
                chat_room_id: chatRoomId,
                content: data.content.trim(),
                images
            }

            const chat = new Chat(chatObj)
            await chat.save()

            // send message to all connection
            const messageInfo = {
                user_id: userId,
                fullName: res.locals.user.fullName,
                content: data.content,
                images
            }
            io.to(chatRoomId).emit('SERVER_SEND_MESSAGE', messageInfo)
        })

        // receive typing
        socket.on('CLIENT_SEND_TYPING', (flag) => {
            socket.broadcast.to(chatRoomId).emit('SERVER_SEND_TYPING', {
                user_id: userId,
                fullName: res.locals.user.fullName,
                flag
            })
        })
    });
} 
