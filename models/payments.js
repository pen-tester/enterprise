var mongoose = require("mongoose");

var product_schema = mongoose.Schema({
    shipping_address:String,
    created:String,
    orderid:String,
    total_amount:String,
    total_count:Number,
    products:[mongoose.Schema.Types.Mixed]      
   }
,{collection:'payments'});

var product = mongoose.model('payment', product_schema);

module.exports  = product;