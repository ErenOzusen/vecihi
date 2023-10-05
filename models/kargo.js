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
    image: ImageSchema,

    isim: {
        type: String,
        unique: true,
        required: true
    },
    uecret: {
        type: Number,
        unique: false,
        required: true
    },


});

module.exports = mongoose.model('Kargo', KargoSchema);