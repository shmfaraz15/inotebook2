const mongoose = require('mongoose');
const { Schema } = mongoose;

const ImageSchema = new Schema({
    filename: {
        type: String,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: false,
    },
    source: {
        type: String,
        required: false,
        unique: true
    },
    location: {
        type: String,
        required: false
    },
    isfavourite: {
        type: Boolean,
        required: false,
        default: false
    },
    date: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model('image', ImageSchema); 