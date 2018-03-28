var express = require('express');
var router = express.Router();
var md5 = require('md5');
var twilio = require('twilio');

var global_area = require('../config/global');  

var Util = require('../utils/utils');
var MessageCode = require('../config/message_code');
var Config  = require('../config/config');

var twilio_helper = require('../utils/twilio_helper');

//Category Db
var mongoose = require('mongoose');
var category_collection = require('../models/categorys');
var product_collection = require('../models/products');
var payment_collection = require('../models/payments');

//Middleware for this router
router.use(function timeLog (req,res, next){
   // console.log('Time: ', Date.now(), 'Requests: ', req);
    next();
});

//Middleware for this router
 router.use(function authorization (req,res, next){
    var session = req.session;
    if(session.authorization == true){
        res.locals.userdata = session.user_info;
    }else{
        res.locals.userdata = null;
    }     
     //res.locals.userdata = result.data;
     next();
 });

 router.post("/charge", function(req,res){
    if(!req.body.amount || req.body.amount == "" || !req.body.shipping_address || !req.body.cart_info){
        res.render('layouts/main_no_sidebar',
        {
           user:res.locals.userdata,
           pagename:"error", 
        });       
    }

    var cart_info={};
    try{
        cart_info = JSON.parse(req.body.cart_info);
    }catch(ex){
        res.render('layouts/main_no_sidebar',
        {
           user:res.locals.userdata,
           pagename:"error",
           error:ex 
        }); 
    }

    var stripe = require("stripe")("sk_live_QFbyU7AGqWXhacuD9YousZZF");

    // Token is created using Checkout or Elements!
    // Get the payment token ID submitted by the form:
    var token = req.body.stripeToken; // Using Express

    var amount = Math.round(+req.body.amount * 100);
    var shipping_address = req.body.shipping_address;
    cart_info.shipping_address = shipping_address;
    cart_info.created = Util.formatDate(Util.getcurrenttime(), "yyyy-MM-dd HH:mm:ss");
    cart_info.orderid = md5(cart_info.created);
    // Charge the user's card:
    stripe.charges.create({
            amount: amount,
            currency: "usd",
            description: "Shopping Charge for order" +cart_info.orderid ,
            metadata:{
                orderid:cart_info.orderid
            },
            source: token,
        }, 
        function(err, charge) {
            // asynchronously called
            if(err){
                res.render('layouts/checkout',
                {
                   user:res.locals.userdata,
                   pagename:"error",
                   error:err 
                });       
                return;         
            }
            payment_collection = new payment_collection(cart_info);
            payment_collection.save();
            res.render('layouts/checkout',
            {
               user:res.locals.userdata,
               pagename:"success",
               charge:JSON.stringify(charge)
            });             
        }
    );
    
 });




 router.all("/", function(req,res){
    //Check if there are pending requests.
    //Getting the latest productions...
    res.render('layouts/checkout',
    {
       user:res.locals.userdata,
       pagename:"checkout", 
    }
   );
    
 });




module.exports = router;