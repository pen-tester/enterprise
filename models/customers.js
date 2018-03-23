var mongoose = require("mongoose");

var users_schema = mongoose.Schema({
    customerID:String,
    userInfo:String,
    userName:String,
    messages:[{
        date:String,
        message:[{
            adminID:String,
            adminName:String,
            adminInfo:String,
            content:String,    
            time:String,
        }]
    }],
    created:String,
    status:Number
},{collection:'customers'});

var users = mongoose.model('customers', users_schema);

module.exports  = users;