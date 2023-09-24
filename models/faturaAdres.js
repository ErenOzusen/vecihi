const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FaturaAdresSchema = new Schema({
    tc: {
        type: String,
        required: true,
        unique: false
    },
    sehir: {
        type: String,
        required: true,
        unique: false
    },
    sokak: {
        type: String,
        required: true,
        unique: false
    },
    evNumarasi: {
        type: String,
        required: true,
        unique: false
    },
    ceptelefonu: {
        type: Number,
        required: false,
        unique: false
    }
});

module.exports = mongoose.model('FaturaAdres', FaturaAdresSchema);