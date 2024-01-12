module.exports.registerPost = async (req, res, next) => {
    if (!req.body.fullName) {
        req.flash('errorMessage', 'Tên không được để trống!')
        res.redirect('back')
        return
    }

    if (!req.body.email) {
        req.flash('errorMessage', 'Email không được để trống!')
        res.redirect('back')
        return
    }

    if (!req.body.password) {
        req.flash('errorMessage', 'Mật khẩu không được để trống!')
        res.redirect('back')
        return
    }

    next()
}

module.exports.loginPost = async (req, res, next) => {
    if (!req.body.email) {
        req.flash('errorMessage', 'Email không được để trống!')
        res.redirect('back')
        return
    }

    if (!req.body.password) {
        req.flash('errorMessage', 'Mật khẩu không được để trống!')
        res.redirect('back')
        return
    }

    next()
}
