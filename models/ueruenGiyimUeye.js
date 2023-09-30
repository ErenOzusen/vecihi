const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const UeruenGiyimUeyeSchema = new Schema({

    ueruenGiyim: {
        type: Schema.Types.ObjectId,
        ref: 'ueruenGiyim'
    },

    miktar: {
        type: Number,
        required: true,
        unique: false
    }
});


module.exports = mongoose.model('UeruenGiyimUeye', UeruenGiyimUeyeSchema);