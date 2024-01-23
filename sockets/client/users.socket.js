const User = require('../../models/user.model')

module.exports = async (res) => {
    const userId = res.locals.user.id
    io.once('connection', (socket) => {
        socket.on('CLIENT_ADD_FRIEND', async (recipientId) => {
            
            // add recipient id to sender's requestFriends
            const isExistInRequestList = await User.findOne({
                _id: userId,
                requestFriends: recipientId
            })
            if (!isExistInRequestList) {
                await User.updateOne({ _id: userId }, { $push: { requestFriends: recipientId } })
            }

            // add user id to recipient's acceptFriends
            const isExistInAcceptList = await User.findOne({
                _id: recipientId,
                acceptFriends: userId
            })
            if (!isExistInAcceptList) {
                await User.updateOne({ _id: recipientId }, { $push: { acceptFriends: userId } })
            }
        })
    });
} 
