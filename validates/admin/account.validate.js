module.exports.createPost = (req, res, next) => {
    
    if (!req.body.fullName) {
        req.flash('errorMessage', 'Tiêu đề sản phẩm không được để trống!')
        res.redirect('back')
        return
    }

    if (!req.body.email) {
        req.flash('errorMessage', 'Email không được để trống!')
        res.redirect('back')
        return
    }

    if (!req.body.password) {
        req.flash('errorMessage', 'Password không được để trống!')
        res.redirect('back')
        return
    }

    next()
}

module.exports.editPatch = (req, res, next) => {
    
    if (!req.body.fullName) {
        req.flash('errorMessage', 'Tiêu đề sản phẩm không được để trống!')
        res.redirect('back')
        return
    }

    if (!req.body.email) {
        req.flash('errorMessage', 'Email không được để trống!')
        res.redirect('back')
        return
    }

    next()
}
