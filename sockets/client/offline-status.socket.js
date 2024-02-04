const User = require('../../models/user.model')

module.exports = async (res) => {
    const userId = res.locals.user.id
    io.once('connection', async (socket) => {
        // send offline status
        socket.broadcast.emit('SERVER_SEND_OFFLINE_STATUS', {
            userId
        })
    })
} 
