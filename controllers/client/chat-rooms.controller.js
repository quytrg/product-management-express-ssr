const User = require('../../models/user.model')
const ChatRoom = require('../../models/chat-room.model')

// [GET] /chat-rooms/
module.exports.index = async (req, res) => {
    try {
        const groupList = await ChatRoom.find({
            roomType: 'group',
            deleted: false,
            'users.user_id': res.locals.user.id
        }).select('title avatar')
        res.render('client/pages/chat-rooms/index.pug',{
            titlePage: 'Chat Rooms',
            groupList
        })
    }
    catch (err) {
        console.log(err);
        res.redirect('back')
    } 
}

// [GET] /chat-rooms/create
module.exports.create = async (req, res) => {
    try {
        const friendList = res.locals.user.friendList

        for (const friend of friendList) {
            const friendInfo = await User.findOne({
                _id: friend.user_id
            }).select('fullName avatar')
            friend.friendInfo = friendInfo
        }

        res.render('client/pages/chat-rooms/create.pug',{
            titlePage: 'Create Chat Room',
            friendList
        })
    }
    catch (err) {
        console.log(err);
        res.redirect('back')
    } 
}

// [POST] /chat-rooms/create
module.exports.createPost = async (req, res) => {
    try {
        if (!req.body.title || req.body.userIds.length < 2) {
            res.redirect('back')
            return
        }

        const roomData = {
            title: req.body.title,
            roomType: 'group',
            users: []
        }

        for (const userId of req.body.userIds) {
            roomData.users.push({
                user_id: userId,
                role: 'user'
            })
        }

        roomData.users.push({
            user_id: res.locals.user.id,
            role: 'superAdmin'
        })

        const newChatRoom = new ChatRoom(roomData)
        await newChatRoom.save()
        res.redirect(`/chat/${newChatRoom.id}`)
    }
    catch (err) {
        console.log(err);
        res.redirect('back')
    } 
}
