const Role = require('../../models/role.model.js')

const systemConfig = require('../../config/system/index')

// [GET] /admin/roles
module.exports.index = async (req, res) => {

    const filter = {
        deleted: false
    }

    const roles = await Role.find(filter)

    res.render(`${systemConfig.prefixAdmin}/pages/roles/index.pug`, {
        titlePage: 'Roles',
        roles
    })
}

// [GET] /admin/roles/create
module.exports.create = async (req, res) => {
    res.render(`${systemConfig.prefixAdmin}/pages/roles/create.pug`, {
        titlePage: 'Create Role',
    })
}

// [POST] /admin/roles/create
module.exports.createPost = async (req, res) => {
    const doc = await Role.create(req.body)
    await doc.save()

    res.redirect(`/${systemConfig.prefixAdmin}/roles`)
}

// [GET] /admin/roles/edit/:id
module.exports.edit = async (req, res) => {
    try {
        const role = await Role.findById({ _id: req.params.id })

        res.render(`${systemConfig.prefixAdmin}/pages/roles/edit.pug`, {
            titlePage: 'Edit Role',
            role
        })
    } catch (error) {
        res.redirect(`/${systemConfig.prefixAdmin}/roles`)
    }
}

// [PATCH] /admin/roles/edit/:id
module.exports.editPatch = async (req, res) => {
    await Role.findOneAndUpdate({ _id: req.params.id }, req.body)

    req.flash('changeSuccess', 'Đã cập nhật thông tin nhóm quyền thành công!')

    res.redirect(`back`)
}
