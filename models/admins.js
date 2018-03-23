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
},{collection:'admins'});

var users = mongoose.model('admins', users_schema);

module.exports  = users;