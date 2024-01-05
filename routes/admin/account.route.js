const express = require("express");
const router = express.Router();

// multer storage
const multer = require("multer");
const upload = multer();

const controller = require("../../controllers/admin/account.controller");
const validate = require("../../validates/admin/account.validate");
const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware");

// permissions
const permissions = require('../../middlewares/admin/permissions.midleware.js')

router.get("/", controller.index);

router.get("/create", controller.create);

router.post(
    "/create",
    permissions.createAccount,
    upload.single("avatar"),
    uploadCloud.upload,
    validate.createPost,
    controller.createPost
);

router.get("/edit/:id", controller.edit);

router.patch(
    "/edit/:id",
    permissions.editAccount,
    upload.single("avatar"),
    uploadCloud.upload,
    validate.editPatch,
    controller.editPatch
);

// router.get("/detail/:id", controller.detail);

module.exports = router;
