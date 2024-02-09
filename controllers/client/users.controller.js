const User = require('../../models/user.model')

// sockets
const usersSocket = require('../../sockets/client/users.socket')

// [GET] /users/not-friend 
module.exports.notFriend = async (req, res) => {
    try {
        await usersSocket(res)
        const user = await User.findOne({ _id: res.locals.user.id }).select('requestFriends acceptFriends friendList')
        const { requestFriends, acceptFriends, friendList } = user
        const friendIdList = friendList.map(item => item.user_id)
        const users = await User.find({
            $and: [
                { _id: { $ne: res.locals.user.id }, },
                { _id: { $nin: requestFriends }},
                { _id: { $nin: acceptFriends }},
                { _id: { $nin: friendIdList }},
            ],
            status: 'active',
            deleted: false
        }).select('avatar fullName')

        res.render('client/pages/users/not-friend.pug',{
            titlePage: 'User List',
            users
        })
    }   
    catch(err) {
        console.log(err)
        res.redirect('back')
    }
}

// [GET] /users/request
module.exports.request = async (req, res) => {
    try {
        await usersSocket(res)

        const user = await User.findOne({ _id: res.locals.user.id }).select('requestFriends')
        const { requestFriends } = user

        const users = await User.find({
            _id: { $in: requestFriends },
            status: 'active',
            deleted: false
        }).select('avatar fullName')

        res.render('client/pages/users/request.pug',{
            titlePage: 'Send Request',
            users
        })
    }   
    catch(err) {
        console.log(err)
        res.redirect('back')
    }
}

// [GET] /users/accept
module.exports.accept = async (req, res) => {
    try {
        await usersSocket(res)

        const user = await User.findOne({ _id: res.locals.user.id }).select('acceptFriends')
        const { acceptFriends } = user

        const users = await User.find({
            _id: { $in: acceptFriends },
            status: 'active',
            deleted: false
        }).select('avatar fullName')

        res.render('client/pages/users/accept.pug',{
            titlePage: 'Friend Request',
            users
        })
    }   
    catch(err) {
        console.log(err)
        res.redirect('back')
    }
}

// [GET] /users/friends
module.exports.friends = async (req, res) => {
    try {
        await usersSocket(res)

        const user = await User.findOne({ _id: res.locals.user.id }).select('friendList')
        const { friendList } = user

        const friendIdList = friendList.map(item => item.user_id)

        const users = await User.find({
            _id: { $in: friendIdList },
            status: 'active',
            deleted: false
        }).select('avatar fullName onlineStatus')

        users.forEach(user => {
            const userInfo = friendList.find(item => user.id === item.user_id)
            user.chat_room_id = userInfo.chat_room_id
        })

        res.render('client/pages/users/friends.pug',{
            titlePage: 'Friend List',
            users
        })
    }   
    catch(err) {
        console.log(err)
        res.redirect('back')
    }
}
