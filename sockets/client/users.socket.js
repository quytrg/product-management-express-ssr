const User = require('../../models/user.model')
const ChatRoom = require('../../models/chat-room.model')

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

            // emit friend request notification to recipient
            const recepientInfo = await User.findOne({
                _id: recipientId
            })
            const numRequest = recepientInfo.acceptFriends.length
            socket.broadcast.emit('SERVER_SEND_FRIEND_REQUEST_NOTIFICATION', {
                recipientId,
                numRequest
            })

            //emit sender's info to recepient's acceptFriends
            const senderInfo = await User.findOne({
                _id: userId
            }).select('avatar fullName')
            socket.broadcast.emit('SERVER_SEND_SENDER_INFO', {
                recipientId,
                senderInfo
            })

            // emit an event to remove sender info from user list
            socket.broadcast.emit('SERVER_ADD_FRIEND', {
                recipientId,
                senderId: userId
            })
        })

        // cancel friend request
        socket.on('CLIENT_CANCEL_FRIEND_REQUEST', async (recipientId) => {
            // remove recipient id from sender's requestFriends
            await User.updateOne({ _id: userId }, { $pull: { requestFriends: recipientId } })

            // remove user id from recipient's acceptFriends
            await User.updateOne({ _id: recipientId }, { $pull: { acceptFriends: userId } })

            // emit friend request notification to recepient
            const recepientInfo = await User.findOne({
                _id: recipientId
            })
            const numRequest = recepientInfo.acceptFriends.length
            socket.broadcast.emit('SERVER_SEND_FRIEND_REQUEST_NOTIFICATION', {
                recipientId,
                numRequest
            })

            // emit an event to remove sender info from recipient's 'accept list' 
            socket.broadcast.emit('SERVER_CANCEL_FRIEND_REQUEST', {
                recipientId,
                senderId: userId
            })
        })

        // confirm friend request
        socket.on('CLIENT_CONFIRM_REQUEST', async (requestSenderId) => {
            // check if requestSenderId is in user's acceptFriends
            const isExistInAcceptFriends = await User.findOne({
                _id: userId,
                acceptFriends: requestSenderId
            })
            if (!isExistInAcceptFriends) return

            // check if request sender id already exists in user's friend list
            const isExistInFriendListOfUser = await User.findOne({
                _id: userId,
                'friendList.user_id': requestSenderId
            })
            // check if user id already exists in request sender's friend list
            const isExistInFriendListOfSender = await User.findOne({
                _id: requestSenderId,
                'friendList.user_id': userId
            })

            let chatRoomId = ''
            if (!isExistInFriendListOfUser && !isExistInFriendListOfSender) {
                const chatRoom = new ChatRoom({
                    roomType: 'friend',
                    users: [
                        {
                            user_id: userId,
                            role: 'superAdmin'
                        },
                        {
                            user_id: requestSenderId,
                            role: 'superAdmin'
                        }
                    ]
                })
                await chatRoom.save()
                chatRoomId = chatRoom.id
            }

            // add request sender id to user's friend list and
            // remove request sender id from user's acceptFriends
            if (!isExistInFriendListOfUser) {
                await User.updateOne(
                    { _id: userId },
                    {
                        $push: {
                            friendList: {
                                user_id: requestSenderId,
                                chat_room_id: chatRoomId,
                            },
                        },
                        $pull: { acceptFriends: requestSenderId },
                    }
                );
            }

            // add user id to request sender's friend list and
            // remove user id from request sender's requestFriends
            if (!isExistInFriendListOfSender) {
                await User.updateOne(
                    { _id: requestSenderId },
                    {
                        $push: {
                            friendList: {
                                user_id: userId,
                                chat_room_id: chatRoomId,
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
