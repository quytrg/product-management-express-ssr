const ChatRoom = require('../../models/chat-room.model')

module.exports.isAllowedAccess = async (req, res, next) => {
    try {
        const chatRoomId = req.params.chatRoomId
        const userId = res.locals.user.id

        const isExistInChatRoom = await ChatRoom.findOne({
            _id: chatRoomId,
            deleted: false,
            'users.user_id': userId
        })
        
        if (!isExistInChatRoom) {
            res.redirect('/')
            return
        }
        next()
    }
    catch (error) {
        console.log("ERROR OCCURED:", error);
        res.redirect('/')
    }
}
