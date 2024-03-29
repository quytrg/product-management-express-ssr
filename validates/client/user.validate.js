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

module.exports.forgotPasswordPost = async (req, res, next) => {
    if (!req.body.email) {
        req.flash('errorMessage', 'Email không được để trống!')
        res.redirect('back')
        return
    }

    next()
}

module.exports.otpPost = async (req, res, next) => {
    if (!req.body.email) {
        req.flash('errorMessage', 'Email không được để trống!')
        res.redirect('back')
        return
    }

    if (!req.body.otp) {
        req.flash('errorMessage', 'OTP không được để trống!')
        res.redirect('back')
        return
    }

    next()
}

module.exports.resetPasswordPost = async (req, res, next) => {
    if (!req.body.password) {
        req.flash('errorMessage', 'Mật khẩu không được để trống!')
        res.redirect('back')
        return
    }

    if (!req.body.confirmPassword) {
        req.flash('errorMessage', 'Vui lòng xác nhận lại mật khẩu!')
        res.redirect('back')
        return
    }

    if (req.body.confirmPassword !== req.body.password) {
        req.flash('errorMessage', 'Xác nhận mật khẩu không trùng khớp!')
        res.redirect('back')
        return
    }

    next()
}
