const Account = require("../../models/account.model");

const systemConfig = require("../../config/system");

// bcrypt hash password
const bcrypt = require('bcrypt');

// [GET] /admin/auth/login
module.exports.login = async (req, res) => {
    try {
        res.render(`${systemConfig.prefixAdmin}/pages/auth/login.pug`, {
            titlePage: "Login",
        });
    } catch (error) {
        console.log("ERROR OCCURED:", error);
        req.flash("errorMessage", "Error occured, page did not existed");
        res.redirect("back");
    }
};

// [POST] /admin/auth/login
module.exports.loginPost = async (req, res) => {
    try {
        const filter = {
            email: req.body.email,
            deleted: false
        }
        const user = await Account.findOne(filter)
        
        if (!user) {
            req.flash("errorMessage", "Tài khoản không tồn tại!")
            res.redirect("back")
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

        if (user.status === 'inactive') {
            req.flash("errorMessage", "Tài khoản đã bị khoá!")
            res.redirect("back")
            return
        }

        res.cookie('token', user.token, { expires: new Date(Date.now() + 900000), httpOnly: true })
        res.redirect(`/${systemConfig.prefixAdmin}/dashboard`)
        
    } catch (error) {
        console.log("ERROR OCCURED:", error);
        req.flash("errorMessage", "Error occured, page did not existed");
        res.redirect("back");
    }
};

// [GET] /admin/auth/logout
module.exports.logout = async (req, res) => {
    try {
        res.clearCookie('token')
        res.redirect(`/${systemConfig.prefixAdmin}/auth/login`)
    } catch (error) {
        console.log("ERROR OCCURED:", error);
        req.flash("errorMessage", "Error occured, page did not existed");
        res.redirect("back");
    }
};
