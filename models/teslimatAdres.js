const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TeslimatAdresSchema = new Schema({
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
    ceptelefonu: Number,
    required: false,
    unique: false
});

module.exports = mongoose.model('TeslimatAdres', TeslimatAdresSchema);