var mongoose = require("mongoose");

var product_schema = mongoose.Schema({
    name:String,
    created:String,
    info:String,
    material:mongoose.Schema.Types.Mixed,   //{color:#, width:# , height , otherinfo}
    type:String,
    product_id:String,
    category_subid:String,
    counts:Number,
    amount:String,
    previous_amount:String,
    currency:{type:String, default:"USD"},
    discount_date:String,
    image:[mongoose.Schema.Types.Mixed],     //{name:String, info:String, uploaded:String, type:String}
    comments:[mongoose.Schema.Types.Mixed]                 /*{
                                customer_id:String,
                                created:String,
                                comment:String,
                                rate:String  */
    }
,{collection:'products'});

var product = mongoose.model('product', product_schema);

module.exports  = product;