var mongoose = require('mongoose');
var merchandiseSchema = mongoose.Schema({
    // _seller: {
    //     type: mongoose.Schema.ObjectId,
    //     ref: "UserModel",
    //     required:true
    // },
    _seller: {
        type: String,
        default:"123"
    },
    name: {type: String, required: true},
    description: String,
    image:String,
    price: Number,
    unit:String,
    comments: [{type:String}],
    dateCreated: {type: Date, default: Date.now, required:true}
}, {collection: "merchandise"});

module.exports = merchandiseSchema;