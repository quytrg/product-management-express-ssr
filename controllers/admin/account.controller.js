const Account = require("../../models/account.model");
const Role = require("../../models/role.model");

const systemConfig = require("../../config/system");

// bcrypt hash password
const bcrypt = require('bcrypt');

// helpers
const generateHelper = require('../../helpers/generate')

// [GET] /admin/accounts
module.exports.index = async (req, res) => {
    try {
        const accounts = await Account.find({
            deleted: false,
        });

        for (const account of accounts) {
            const role = await Role.findOne({ _id: account.role_id });
            account.role = role;
        }

        res.render(`${systemConfig.prefixAdmin}/pages/accounts/index.pug`, {
            titlePage: "Accounts Page",
            accounts,
        });
    } catch (error) {
        console.log("ERROR OCCURED:", error);
        req.flash("errorMessage", "Error occured, page did not existed");
        res.redirect("back");
    }
};

// [GET] /admin/accounts/create
module.exports.create = async (req, res) => {
    try {
        const filter = {
            deleted: false
        }
        const roles = await Role.find(filter)

        res.render(`${systemConfig.prefixAdmin}/pages/accounts/create.pug`, {
            titlePage: "Create Account",
            roles
        });
    } catch (error) {
        console.log("ERROR OCCURED:", error);
        req.flash("errorMessage", "Error occured, page did not existed");
        res.redirect("back");
    }
};

// [POST] /admin/accounts/create
module.exports.createPost = async (req, res) => {
    try {
        // bcrypt hash
        const saltRounds = 10;
        const plainTextPassword = req.body.password;
        req.body.password = await bcrypt.hash(plainTextPassword, saltRounds);
        req.body.token = generateHelper.generateRandomString(30)

        const doc = await Account.create(req.body)
        await doc.save()

        res.redirect(`/${systemConfig.prefixAdmin}/accounts`)
    } catch (error) {
        console.log("ERROR OCCURED:", error);
        req.flash("errorMessage", "Error occured, page did not existed");
        res.redirect("back");
    }
};

// [GET] /admin/accounts/edit/:id
module.exports.edit = async (req, res) => {
    try {
        const filter = {
            deleted: false,
            _id: req.params.id
        }
        const account = await Account.findOne(filter)

        const roles = await Role.find({ deleted: false })

        res.render(`${systemConfig.prefixAdmin}/pages/accounts/edit.pug`, {
            titlePage: "Edit Account",
            account,
            roles
        });
    } catch (error) {
        console.log("ERROR OCCURED:", error);
        req.flash("errorMessage", "Error occured, page did not existed");
        res.redirect("back");
    }
};

// [PATCH] /admin/accounts/edit/:id
module.exports.editPatch = async (req, res) => {
    try {
        // bcrypt hash
        if (req.body.password !== '') {
            const saltRounds = 10;
            const plainTextPassword = req.body.password;
            req.body.password = await bcrypt.hash(plainTextPassword, saltRounds);
        }
        else {
            delete req.body.password
        }

        const filter = {
            _id: req.params.id
        }
        await Account.findOneAndUpdate(filter, req.body)
        req.flash("changeSuccess", "Cập nhật thông tin tài khoản thành công");
        res.redirect(`/${systemConfig.prefixAdmin}/accounts`)
    } catch (error) {
        console.log("ERROR OCCURED:", error);
        req.flash("errorMessage", "Error occured, page did not existed");
        res.redirect("back");
    }
};
