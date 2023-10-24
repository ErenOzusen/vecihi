const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AlisverisSepetiSchema = new Schema({

    ueye: {
        type: Schema.Types.ObjectId,
        ref: 'Ueye'
    },

    ueruenler: [
        {
            ueruenGiyim: {
                type: Schema.Types.ObjectId,
                ref: 'UeruenGiyim',
                required: true,
            },

            miktar: {
                type: Number,
                required: true,
                unique: false,
            },
        },
    ],

    teslimatAdres: {
        type: Schema.Types.ObjectId,
        ref: 'TeslimatAdres'
    },

    faturaAdres: {
        type: Schema.Types.ObjectId,
        ref: 'FaturaAdres'
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