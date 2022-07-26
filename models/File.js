const mongoose = require('mongoose');

let File = mongoose.Schema({
    //pass
    password: String,
    //file
    path: {
        type: String,
        required: true,
    },
    //count
    count: {
        type: Number,
        required: true,
        default: 0
    },
});

module.exports = mongoose.model('File', File);