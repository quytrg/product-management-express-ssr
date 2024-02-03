const User = require('../../models/user.model')

const generateHelper = require('../../helpers/generate')

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

        // confirm friend request
        socket.on('CLIENT_CONFIRM_REQUEST', async (requestSenderId) => {
            // generate a room chat id
            const roomChatId = generateHelper.generateRandomString(20)

            // add request sender id to user's friend list and
            // remove request sender id from user's acceptFriends
            const isExistInFriendListOfUser = await User.findOne({
                _id: userId,
                'friendList.user_id': requestSenderId
            })
            if (!isExistInFriendListOfUser) {
                await User.updateOne(
                    { _id: userId },
                    {
                        $push: {
                            friendList: {
                                user_id: requestSenderId,
                                room_chat_id: roomChatId,
                            },
                        },
                        $pull: { acceptFriends: requestSenderId },
                    }
                );
            }

            // add user id to request sender's friend list and
            // remove user id from request sender's requestFriends
            const isExistInFriendListOfSender = await User.findOne({
                _id: requestSenderId,
                'friendList.user_id': userId
            })
            if (!isExistInFriendListOfSender) {
                await User.updateOne(
                    { _id: requestSenderId },
                    {
                        $push: {
                            friendList: {
                                user_id: userId,
                                room_chat_id: roomChatId,
                            },
                        },
                        $pull: { requestFriends: userId }
                    }
                );
            }
        })

        // refuse friend request
        socket.on('CLIENT_REFUSE_REQUEST', async (requestSenderId) => {
            // remove user id from sender's requestFriends
            await User.updateOne({ _id: requestSenderId }, { $pull: { requestFriends: userId } })

            // remove requestSenderId from user's acceptFriends
            await User.updateOne({ _id: userId }, { $pull: { acceptFriends: requestSenderId } })
        })

        // unfriend
        socket.on('CLIENT_UNFRIEND', async (recipientId) => {
            // remove recipient id from user's friendList
            await User.updateOne({ _id: userId }, { $pull: { friendList: { user_id: recipientId } } })
            
            // remove user id from recipient's friendList
            await User.updateOne({ _id: recipientId }, { $pull: { friendList: { user_id: userId } } })
        })

    });
} 
