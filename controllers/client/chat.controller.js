const Chat = require('../../models/chat.model')
const User = require('../../models/user.model')

const chatSocket = require('../../sockets/client/chat.socket')

// [GET] /chat
module.exports.index = async (req, res) => {
    try {
        chatSocket(res)

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
