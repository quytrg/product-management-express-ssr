const User = require('../../models/user.model')

// sockets
const usersSocket = require('../../sockets/client/users.socket')

// [GET] /user/register 
module.exports.notFriend = async (req, res) => {
    try {
        await usersSocket(res)
        const user = await User.findOne({ _id: res.locals.user.id }).select('requestFriends acceptFriends')
        const { requestFriends, acceptFriends } = user

        const users = await User.find({
            $and: [
                { _id: { $ne: res.locals.user.id }, },
                { _id: { $nin: requestFriends }},
                { _id: { $nin: acceptFriends }},
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