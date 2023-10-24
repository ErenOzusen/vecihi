const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_100');
});

const yorumSchema = new Schema({
    images: [ImageSchema],
    yorum: String,
    rating: Number,
    author:
    {
        type: Schema.Types.ObjectId,
        ref: 'Ueye'
    },
});

module.exports = mongoose.model("Yorum", yorumSchema);