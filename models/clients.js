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
},{collection:'clients'});

var users = mongoose.model('clients', users_schema);

module.exports  = users;