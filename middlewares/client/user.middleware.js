const User = require('../../models/user.model')

module.exports.userInfo = async (req, res, next) => {
    if (req.cookies.token) {
        const user = await User.findOne({
            token: req.cookies.token,
            deleted: false,
        }).select("-password")

        if (user) {
            res.locals.user = user
        }
    }

    next()
}
