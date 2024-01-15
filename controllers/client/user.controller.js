const User = require('../../models/user.model')
const Cart = require('../../models/cart.model')
const ForgotPassword = require('../../models/forgot-password.model')

// bcrypt hash password
const bcrypt = require('bcrypt');

// helpers
const generateHelper = require('../../helpers/generate')
const sendEmailHelper = require('../../helpers/sendEmail')

// [GET] /user/register 
module.exports.register = async (req, res) => {
    try {
        res.render('client/pages/user/register.pug',{
            titlePage: 'Register',
        })
    }   
    catch(err) {
        console.log(err)
        res.redirect('back')
    }
}

// [POST] /user/register 
module.exports.registerPost = async (req, res) => {
    try {
        const emailExists = await User.findOne({ email: req.body.email, deleted: false })
        if (emailExists) {
            req.flash('errorMessage', 'Email đã tồn tại!')
            res.redirect('back')
            return
        }

        // bcrypt hash
        const saltRounds = 10;
        const plainTextPassword = req.body.password;
        req.body.password = await bcrypt.hash(plainTextPassword, saltRounds);

        const user = new User(req.body)
        await user.save()

        res.cookie('token', user.token, { expires: new Date(Date.now() + 86400000*3), httpOnly: true })

        req.flash('successMessage', "Đăng ký tài khoản thành công!")
        res.redirect('/')
    }   
    catch(err) {
        console.log(err)
        res.redirect('back')
    }
}

// [GET] /user/login
module.exports.login = async (req, res) => {
    try {
        res.render('client/pages/user/login.pug',{
            titlePage: 'Login',
        })
    }   
    catch(err) {
        console.log(err)
        res.redirect('back')
    }
}

// [POST] /user/login
module.exports.loginPost = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email, deleted: false })

        if (!user) {
            req.flash('errorMessage', 'Tài khoản không tồn tại!')
            res.redirect('back')
            return
        }

        const savedHashedPassword = user.password
        const plainTextPassword = req.body.password;
        const isPasswordMatch = await bcrypt.compare(plainTextPassword, savedHashedPassword);
        if (!isPasswordMatch) {
            req.flash("errorMessage", "Sai mật khẩu!")
            res.redirect("back")
            return
        }

        if (user.status !== 'active') {
            req.flash('errorMessage', 'Tài khoản đã bị khoá!')
            res.redirect('back')
            return
        }

        // save user_id to current cart
        await Cart.updateOne(
            { _id: req.cookies.cartId },
            { user_id: user.id }
        )

        res.cookie('token', user.token, { expires: new Date(Date.now() + 86400000*3), httpOnly: true })
        res.redirect('/')
    }   
    catch(err) {
        console.log(err)
        res.redirect('back')
    }
}

// [GET] /user/logout
module.exports.logout = async (req, res) => {
    try {
        res.clearCookie('token')
        req.flash('successMessage', 'Đã đăng xuất khỏi tài khoản thành công!')
        res.redirect('/')
    }   
    catch(err) {
        console.log(err)
        res.redirect('back')
    }
}

// [GET] /user/password/forgot
module.exports.forgotPassword = async (req, res) => {
    try {
        res.render('client/pages/user/forgot-password.pug',{
            titlePage: 'Forgot Password',
        })
    }   
    catch(err) {
        console.log(err)
        res.redirect('back')
    }
}

// [POST] /user/password/forgot
module.exports.forgotPasswordPost = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email, deleted: false })

        if (!user) {
            req.flash('errorMessage', 'Tài khoản không tồn tại!')
            res.redirect('back')
            return
        }

        const otp = generateHelper.generateRandomNumber(6)
        const forgotPasswordObject = {
            email: user.email,
            otp: otp,
            expireAt: Date.now()
        }

        const forgotPassword = new ForgotPassword(forgotPasswordObject)
        await forgotPassword.save()

        // send OTP code to user's email
        const emailSubject = 'Mã OTP xác minh lấy lại mật khẩu'
        const emailContentHtml = `
            Mã OTP xác minh lấy lại mật khẩu là <b>${otp}</b>. Thời hạn sử dụng là 3 phút. Lưu ý không được để lộ mã OTP. 
        `
        sendEmailHelper.sendEmail(user.email, emailSubject, emailContentHtml)

        res.redirect(`/user/password/otp?email=${user.email}`)
    }   
    catch(err) {
        console.log(err)
        res.redirect('back')
    }
}

// [GET] /user/password/otp?email=example@gmail.com
module.exports.otp = async (req, res) => {
    try {
        const email = req.query.email
        res.render('client/pages/user/otp.pug',{
            titlePage: 'Confirm OTP',
            email
        })
    }   
    catch(err) {
        console.log(err)
        res.redirect('back')
    }
}

// [GET] /user/password/otp
module.exports.otpPost = async (req, res) => {
    try {
        const isAuth = await ForgotPassword.findOne({
            email: req.body.email,
            otp: req.body.otp
        })

        if (!isAuth) {
            req.flash('errorMessage', 'OTP không hợp lệ!')
            res.redirect('back')
            return
        }

        const user = await User.findOne({
            email: req.body.email
        })

        res.cookie('token', user.token, { expires: new Date(Date.now() + 86400000*3), httpOnly: true })
        res.redirect(`/user/password/reset?email=${user.email}`)
    }   
    catch(err) {
        console.log(err)
        res.redirect('back')
    }
}

// [GET] /user/password/reset?email=example@gmail.com
module.exports.resetPassword = async (req, res) => {
    try {
        const email = req.query.email
        res.render('client/pages/user/reset-password.pug',{
            titlePage: 'Reset Password',
            email
        })
    }   
    catch(err) {
        console.log(err)
        res.redirect('back')
    }
}

// [GET] /user/password/reset
module.exports.resetPasswordPost = async (req, res) => {
    try {
        const saltRounds = 10;
        const plainTextPassword = req.body.password;
        req.body.password = await bcrypt.hash(plainTextPassword, saltRounds);
        const token = req.cookies.token

        await User.updateOne({ token: token }, { password: req.body.password })
        req.flash('successMessage', 'Đổi mật khẩu thành công!')
        res.redirect('/')
    }   
    catch(err) {
        console.log(err)
        res.redirect('back')
    }
}

// [GET] /user/info
module.exports.info = async (req, res) => {
    try {
        res.render('client/pages/user/info.pug',{
            titlePage: 'User Information',
        })
    }   
    catch(err) {
        console.log(err)
        res.redirect('back')
    }
}
