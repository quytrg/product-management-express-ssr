const GeneralSetting = require('../../models/general-settings.model')

const systemConfig = require('../../config/system/index')

// [GET] /admin/settings/general
module.exports.generalSettings = async (req, res) => {
    try {
        const generalSettings = await GeneralSetting.findOne({})
        res.render(`${systemConfig.prefixAdmin}/pages/settings/general.pug`, {
            titlePage: "General Settings",
            generalSettings
        });
    } catch (error) {
        console.log("ERROR OCCURED:", error);
        req.flash("errorMessage", "Error occured, page did not existed");
        res.redirect("back");
    }
};

// [PATCH] /admin/settings/general
module.exports.generalSettingsPatch = async (req, res) => {
    try {
        const generalSetting = await GeneralSetting.findOne({})
        if (generalSetting) {
            await GeneralSetting.updateOne(
                { _id: generalSetting.id },
                req.body
            )
        }
        else {
            const doc = new GeneralSetting(req.body)
            await doc.save()
        }
        req.flash("changeSuccess", "Cập nhật thông tin thành công!");
        res.redirect('back')
    } catch (error) {
        console.log("ERROR OCCURED:", error);
        req.flash("errorMessage", "Error occured, page did not existed");
        res.redirect("back");
    }
};
