const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ImageSchema = new Schema({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_100');
});

const AnaSayfaSchema = new Schema({
    images: [ImageSchema],

    sectionBirBaslik: {
        type: String,
        required: false,
        unique: false
    },

    sectionBirUeruenID: [{
        type: String,
        required: false,
        unique: false
    }],

    sectionIkiUeruenID: [{
        type: String,
        required: false,
        unique: false
    }],

});

module.exports = mongoose.model('AnaSayfa', AnaSayfaSchema);