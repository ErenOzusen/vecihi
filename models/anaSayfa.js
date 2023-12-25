const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AnaSayfaSchema = new Schema({
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