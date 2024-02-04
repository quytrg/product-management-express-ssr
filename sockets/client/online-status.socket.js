const User = require('../../models/user.model')

module.exports = async (res) => {
    const userId = res.locals.user.id
    io.once('connection', async (socket) => {
        // send online status
        socket.broadcast.emit('SERVER_SEND_ONLINE_STATUS', {
            userId
        })
    })
} 
