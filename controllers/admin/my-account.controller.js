const Account = require('../../models/account.model.js')

const systemConfig = require('../../config/system/index')

// bcrypt hash password
const bcrypt = require('bcrypt');

// [GET] /admin/my-account
module.exports.index = async (req, res) => {
    res.render(`${systemConfig.prefixAdmin}/pages/my-account/index.pug`, {
        titlePage: 'My Account',
    })
}

// [GET] /admin/my-account/edit
module.exports.edit = async (req, res) => {
    res.render(`${systemConfig.prefixAdmin}/pages/my-account/edit.pug`, {
        titlePage: 'Edit Profile',
    })
}

// [PATCH] /admin/my-account/edit
module.exports.editPatch = async (req, res) => {
    try {
        // bcrypt hash
        const savedHashedPassword = res.locals.user.password
        const plainTextPassword = req.body.password;
        const isPasswordMatch = await bcrypt.compare(plainTextPassword, savedHashedPassword);
        if (!isPasswordMatch) {
            req.flash("errorMessage", "Sai mật khẩu!")
            res.redirect("back")
            return
        }
        delete req.body.password

        if (req.body.role_id) {
            delete req.body.role_id
            return
        }

        const filter = {
            _id: res.locals.user.id
        }
        await Account.findOneAndUpdate(filter, req.body)
        req.flash("changeSuccess", "Cập nhật thông tin tài khoản thành công");
        res.redirect(`/${systemConfig.prefixAdmin}/my-account`)
    } catch (error) {
        console.log("ERROR OCCURED:", error);
        req.flash("errorMessage", "Error occured, page did not existed");
        res.redirect("back");
    }
}
