const GeneralSetting = require('../../models/general-settings.model')

module.exports.generalSettings = async (req, res, next) => {
    const generalSettings = await GeneralSetting.findOne({})
    if (generalSettings) {
        res.locals.generalSettings = generalSettings
    }
    next()
}
