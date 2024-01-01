module.exports.createPost = (req, res, next) => {
    if (!req.body.title) {
        req.flash('errorMessage', 'Tiêu đề nhóm quyền không được để trống!')
        res.redirect('back')
        return
    }

    if (req.body.description.length < 5) {
        req.flash('errorMessage', 'Mô tả nhóm quyền phải có ít nhất 5 ký tự!')
        res.redirect('back')
        return
    }

    next()
}
