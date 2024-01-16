const Chat = require('../../models/chat.model')
const User = require('../../models/user.model')

// [GET] /chat
module.exports.index = async (req, res) => {
    try {
        const userId = res.locals.user.id
        io.once('connection', (socket) => {
            socket.on('CLIENT_SEND_MESSAGE', async (content) => {
                const chatObj = {
                    user_id: userId,
                    content: content
                }

                const chat = new Chat(chatObj)
                await chat.save()

                // send message to all connection
                const messageInfo = {
                    user_id: userId,
                    fullName: res.locals.user.fullName,
                    content: content
                }
                io.emit('SERVER_SEND_MESSAGE', messageInfo)
            })
        });

        // load messages once access to route
        const chats = await Chat.find({
            deleted: false,
        })

        for (const chat of chats) {
            const userInfo = await User.findOne({
                _id: chat.user_id
            }).select("fullName")

            chat.userInfo = userInfo
        }
        
        res.render('client/pages/chat/index.pug',{
            titlePage: 'Chat',
            chats
        })
    }
    catch (err) {
        console.log(err);
        res.redirect('back')
    } 
}
