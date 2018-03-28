var express = require('express');
var router = express.Router();
var md5 = require('md5');
var twilio = require('twilio');

var global_area = require('../config/global');  

var Util = require('../utils/utils');
var MessageCode = require('../config/message_code');
var UserCode  = require('../config/user_code');
var Config  = require('../config/config');


var twilio_helper = require('../utils/twilio_helper');

//Middleware for this router
router.use(function timeLog (req,res, next){
   // console.log('Time: ', Date.now(), 'Requests: ', req);
    next();
});

//Middleware for this router
 router.use(function authorization (req,res, next){
     // console.log('Time: ', Date.now(), 'Requests: ', req);
     var session = req.session;
     if(session.authorization == true){
        if(session.usertype==UserCode.type.client){
            res.redirect("/client/dashboard");
        }else if(session.usertype==UserCode.type.customer){
            res.redirect("/customer/dashboard");
        }else if(session.usertype==UserCode.type.admin){
            res.redirect("/admin/dashboard");
        }
        
     }     
     //res.locals.userdata = result.data;
     next();
 });


router.get("/login", function(req,res){
    res.render('layouts/user',
    {
       pagename:"login", 
    }
   );    
});


router.all("/register", function(req,res){
    var email="";
    if(req.body.email) email=req.body.email;
    res.render('layouts/user',
    {
       pagename:"register", 
       email:email
    }
   );    
});

router.all("/forgetpass", function(req,res){
    res.render('layouts/user',
    {
       pagename:"forgetpass", 
    }
   );    
});

module.exports = router;