const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AlisverisSepetiSchema = new Schema({

    ueruenGiyimUeye: [{
        type: Schema.Types.ObjectId,
        ref: 'UeruenGiyimUeye'
    }],

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
});

module.exports = mongoose.model('AlisverisSepeti', AlisverisSepetiSchema);