const User = require('../../models/user.model')

// bcrypt hash password
const bcrypt = require('bcrypt');

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
