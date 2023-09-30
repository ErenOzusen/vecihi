const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_100');
});

const UeruenGiyimSchema = new Schema({
    images: [ImageSchema],

    cesit: {
        type: String,
        enum: ['tshirt', 'sapka', 'canta', 'anahtarlik', 'ahsapueruenler', 'suesueruen'],
        required: true
    },
    kategori: {
        type: String,
        enum: ['erkekGiyim', 'kadinGiyim', 'unisexGiyim', 'vintageUeruenler'],
        required: true
    },
    beden: {
        type: [String],
        //test
        required: true
    },
    fiyat: {
        type: Number,
        required: true,
        unique: false
    },
    tarif: {
        type: String,
        required: true,
        unique: false
    },
    aciklama: {
        type: String,
        required: true,
        unique: false
    }
});


module.exports = mongoose.model('UeruenGiyim', UeruenGiyimSchema);