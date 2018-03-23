var express = require('express');
var router = express.Router();
var md5 = require('md5');
var twilio = require('twilio');

var global_area = require('../config/global');  

var Util = require('../utils/utils');
var MessageCode = require('../config/message_code');
var Config  = require('../config/config');

var twilio_helper = require('../utils/twilio_helper');

//Shopping DB model
var category_collection = require('../models/categorys');
var product_collection = require('../models/products');

//Middleware for this router
router.use(function timeLog (req,res, next){
   // console.log('Time: ', Date.now(), 'Requests: ', req);
    next();
});

//Middleware for this router
router.use(function origin_set (req,res, next){
    // console.log('Time: ', Date.now(), 'Requests: ', req);
    res.set("Access-Control-Allow-Credentials", true);
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Methods", "POST, GET");
    res.set("Access-Control-Allow-Headers","Content-Type, Authorization, X-Requested-With, Origin");   
     next();
 });
 
 router.use(function authorization (req,res, next){
     // console.log('Time: ', Date.now(), 'Requests: ', req);
     next();
 });


router.all("/product/feature", function(req,res){
    //Check if there are pending requests.

    //res.json({status:'error', error:'The checkout has to be post method', code:MessageCode.error});
});

router.all("/product/latest", function(req,res){
    product_collection.find({}).sort({created: -1}).limit(9).exec()
    .then(products =>
    {
        console.log(products);
        res.json({
            status:MessageCode.code.success, data:products
        })
    })
    .catch(error=>{
        console.log("get error", error);
        res.json({
            status:MessageCode.code.fail, code:MessageCode.error.db_get_error, error:error
        })       
    }); 
});


module.exports = router;