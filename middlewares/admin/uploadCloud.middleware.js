const uploadImage = require('../../helpers/uploadImage')

module.exports.upload = async (req, res, next) => {
    if (req.file) {
        req.body[req.file.fieldname] = await uploadImage.uploadToCloudinary(req.file.buffer)
    }
    next();
}
