const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_100');
});

const RatingSchema = new Schema({
    images: [ImageSchema],

    stars: {
        type: Number,
        required: true,
        unique: false
    },

    yorum: {
        type: String,
        required: true,
        unique: false
    },

    ueye: {
        type: Schema.Types.ObjectId,
        ref: 'Ueye'
    },

    ueruenGiyim: {
        type: Schema.Types.ObjectId,
        ref: 'UeruenGiyim'
    }
});


module.exports = mongoose.model('Rating', RatingSchema);