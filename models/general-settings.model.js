const mongoose = require("mongoose");

const generalSettingSchema = new mongoose.Schema(
    {
        websiteName: String,
        logo: String,
        phone: String,
        email: String,
        address: String,
        copyright: String,
    },
    { timestamps: true }
);

const generalSetting = mongoose.model("GeneralSetting", generalSettingSchema);

module.exports = generalSetting;
