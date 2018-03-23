var mongoose = require("mongoose");

var category_schema = mongoose.Schema({
    name:String,
    created:String,
    info:String,
    type:String,
    uniqid:String,
    subcategory:[{
        name:String,
        created:String,
        subid:String,
        info:String
    }]
},{collection:'categories'});

var category = mongoose.model('category', category_schema);

module.exports  = category;