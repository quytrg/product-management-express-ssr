

// [GET] /chat
module.exports.index = async (req, res) => {
    try {
        io.on('connection', (socket) => {
            console.log('a user connected', socket.id);
        });
        
        res.render('client/pages/chat/index.pug',{
            titlePage: 'Chat',
        })
    }
    catch (err) {
        console.log(err);
        res.redirect('back')
    } 
}
