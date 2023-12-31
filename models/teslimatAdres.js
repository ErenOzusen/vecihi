const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TeslimatAdresSchema = new Schema({
    tc: {
        type: String,
        required: true,
        unique: false
    },
    isim: {
        type: String,
        required: true,
        unique: false
    },
    soyisim: {
        type: String,
        required: true,
        unique: false
    },

    uelke: {
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
        required: true,
        unique: false
    },

});

module.exports = mongoose.model('TeslimatAdres', TeslimatAdresSchema);