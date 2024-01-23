const User = require('../../models/user.model')

module.exports = async (res) => {
    const userId = res.locals.user.id
    io.once('connection', (socket) => {
        // add friend
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

        // cancel friend request
        socket.on('CLIENT_CANCEL_FRIEND_REQUEST', async (recipientId) => {
            // remove recipient id from sender's requestFriends
            await User.updateOne({ _id: userId }, { $pull: { requestFriends: recipientId } })

            // remove user id from recipient's acceptFriends
            await User.updateOne({ _id: recipientId }, { $pull: { acceptFriends: userId } })
        })
    });
} 
