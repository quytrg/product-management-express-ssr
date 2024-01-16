

// [GET] /chat
module.exports.index = async (req, res) => {
    try {
        
        res.render('client/pages/chat/index.pug',{
            titlePage: 'Chat',
        })
    }
    catch (err) {
        console.log(err);
        res.redirect('back')
    } 
}
