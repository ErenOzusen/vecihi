const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const UeruenGiyimSchema = new Schema({
    images: [{
        url: String,
        filename: String
    }],

    cesit: {
        type: String,
        enum: ['tshirt', 'sapka', 'canta', 'suesEsyalari'],
        required: true
    },
    kategori: {
        type: String,
        enum: ['erkekGiyim', 'kadinGiyim', 'unisexGiyim', 'vintageUeruenler'],
        required: true
    },
    beden: {
        type: [String],
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
    /* ,
    miktar: {
        type: Number,
        required: true,
        unique: false
    } */

});


module.exports = mongoose.model('UeruenGiyim', UeruenGiyimSchema);