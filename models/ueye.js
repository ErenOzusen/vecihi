const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const UeyeSchema = new Schema({
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
    email: {
        type: String,
        required: true,
        unique: true
    },

    ceptelefonu: {
        type: Number,
        required: false,
        unique: false
    },
    sepet: [{
        type: Schema.Types.ObjectId,
        ref: 'UeruenGiyim'
    }]

});

UeyeSchema.plugin(passportLocalMongoose,
    {
        usernameField: 'email',
        passwordField: 'password',

    });
module.exports = mongoose.model('Ueye', UeyeSchema);