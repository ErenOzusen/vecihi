const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SiparislerSchema = new Schema({

    ueye: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ueye',
        required: true,
    },
    sepet: [
        {
            ueruenGiyim: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'UeruenGiyim',
                required: true,
            },
            miktar: {
                type: Number,
                required: true,
            },

            tarih: {
                type: String, // Datum als Zeichenkette speichern
                required: false,
            },

            saat: {
                type: String, // Uhrzeit als Zeichenkette speichern
                required: false,
            },
            toplamFiyat: {
                type: Number,
                required: false,
                unique: false
            }
        },
    ],

})

module.exports = mongoose.model('Siparisler', SiparislerSchema);