const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UeruenSchema = new Schema({
    cesit: {
        type: String,
        required: true,
        unique: false
    },
    cins: {
        type: String,
        enum: ['erkek', 'kadin']
    },
    beden: {
        type: String,
        enum: ['S', 'M', 'L', 'XL']
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
    miktar: {
        type: Number,
        required: true,
        unique: false
    }

});


module.exports = mongoose.model('Ueruen', UeruenSchema);