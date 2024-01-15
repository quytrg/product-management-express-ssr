const User = require('../../models/user.model')

module.exports.requireAuth = async (req, res, next) => {
    if (!req.cookies.token) {
        res.redirect(`/user/login`)
        return
    }
    
    const user = await User.findOne({ token: req.cookies.token })
    if (!user) {
        res.redirect(`/user/login`)
        return
    }
    
    next()
}
