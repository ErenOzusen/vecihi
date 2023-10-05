const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AlisverisSepetiSchema = new Schema({

    ueruenGiyim: {
        type: Schema.Types.ObjectId,
        ref: 'UeruenGiyim'
    },

    miktar: {
        type: Number,
        required: true,
        unique: false
    },

    teslimatAdres: {
        type: Schema.Types.ObjectId,
        ref: 'TeslimatAdres'
    },

    faturaAdres: {
        type: Schema.Types.ObjectId,
        ref: 'FaturaAdres'
    },

    kargo: {
        type: Schema.Types.ObjectId,
        ref: 'Kargo'
    },

    oedemeSistemi: {
        type: String,
        enum: ['kredikart', 'mobil', 'banka'],
        required: false
    },

    toplamFiyat: {
        type: Number,
        required: false,
        unique: false
    }
});

module.exports = mongoose.model('AlisverisSepeti', AlisverisSepetiSchema);