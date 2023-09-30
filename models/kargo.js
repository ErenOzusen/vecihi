const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_100');
});

const KargoSchema = new Schema({
    images: ImageSchema,

    kargoIsim: {
        type: String,
        unique: true,
        required: true
    },
    ücret: {
        type: Number,
        unique: false,
        required: true
    },


});

module.exports = mongoose.model('Kargo', KargoSchema);