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

 router.all("/index", function(req,res){
    //Check if there are pending requests.
    //Getting the latest productions...
    product_collection.find({ $query: {}, $orderby: { created : -1 } }).limit(9).exec()
    .then(products =>
    {
        console.log(products);
        res.render('layouts/main',
        {
           user:res.locals.userdata,
           pagename:"index", 
           products:products}
       );
    })
    .catch(error=>{
        console.log("get error", error);
        res.json({
            status:MessageCode.code.fail, code:MessageCode.error.db_get_error, error:error
        })       
    });   
    
 });



 router.all("/:pagename", function(req,res){
    //Check if there are pending requests.
    var fs = require('fs');
    //console.log(__dirname+"/../views/main/"+req.params.pagename+".ejs");
    if (fs.existsSync(__dirname+"/../views/main/"+req.params.pagename+".ejs")) {
        // Do something
        if(req.params.pagename != "contact")
            res.render('layouts/main_no_ads', {user:res.locals.userdata, pagename:req.params.pagename});
        else 
            res.render('layouts/main_no_sidebar', {user:res.locals.userdata, pagename:req.params.pagename});
    }   
    else{
        res.send("Wrong Page");
    }
 });


 router.all("/category/:type/:name", function(req,res){
    //Check if there are pending requests.
    category_collection.findOne({uniqid:req.params.type}, function(err, category){
        if(err){
            console.log("error for find category", err);
            return;
        }
        console.log(category);

        if(category != null && category!==undefined){
            var subcategory = {
                name:req.params.name,
                created:Util.formatDate(Util.getcurrenttime(),"yyyy-MM-dd HH:mm:ss"),
                subid:mongoose.Types.ObjectId()+md5(mongoose.Types.ObjectId()),
                info:"Sub category"
            }
            if(category.subcategory === undefined || category.subcategory == null){
                category.subcategory=[];
            }
            category.subcategory.push(subcategory);
            category.save();
            
        }
        res.send({cat:category, params:req.params});
    });          
    
 });

 router.all("/product/:category_id/:name/:amount/:pamount", function(req,res){
    //Check if there are pending requests.
    product_collection.findOneAndUpdate({product_id:"---"},{ 
        name:req.params.name,
        created:"2018-03-09",
        info:req.params.name,
        type:"product",
        product_id:mongoose.Types.ObjectId()+md5(mongoose.Types.ObjectId()),
        category_subid:req.params.category_id,
        counts:40,
        amount:req.params.amount,
        previous_amount:req.params.pamount,
        currency:'USD'
    },{upsert:true, new:true}, function(err, product){
        if(err){
            console.log("error for find category", err);
            return;
        }
        console.log(product);
        res.send({cat:product, params:req.params});
    });

});


module.exports = router;