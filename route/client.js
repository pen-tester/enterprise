var express = require('express');
var router = express.Router();
var md5 = require('md5');
var twilio = require('twilio');

var global_area = require('../config/global');  

var Util = require('../utils/utils');
var MessageCode = require('../config/message_code');
var Config  = require('../config/config');

var twilio_helper = require('../utils/twilio_helper');

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
     if(!req.headers.authorization){
         res.json({status:'error', code:MessageCode.error, error:"Authorization failed" ,headers:req.headers});
         return;
     }
 
     var auth_token = req.headers.authorization || '';
 
     var result = Util.check_authentification(auth_token);
 
     if(result.status == 'error'){
         res.json(result);
         return;
     }
 
     res.locals.userdata = result.data;
     next();
 });


 router.get("/profile/logo", function(req,res){
    //Check if there are pending requests.

    if(res.locals.userdata.optionid == 2){
        res.json({status:'error', error:'The customer Id is not set', code:MessageCode.error, info:error});
        return;        
    }

    var sql = Customer_model.sql_select_profile_logo(res.locals.userdata.identification);

    Vaultdbpool.getConnection(function(err, Vaultdb) {
        if(err){
            console.log("Error from geting connection from vault db", err);
            res.json({status:'error', error:'Server DB error', code:MessageCode.error, info:err});
            return;            
        }
        // Use the connection
        Vaultdb.query(sql, function (error, results, fields) {
            try{
                Vaultdb.release();
            }
            catch(e){
                
            }
            if(error) {
                 res.json({status:'error', error:'Server DB error', code:MessageCode.error, info:error});
                 return;
            }
            //check the results if there are pending requests
            var profile_logo ={};
            if(results.length>0){
                profile_logo=results[0];
            }
            res.json({status:'ok', error:'', code:MessageCode.ok, result:profile_logo });
            return;
        });        
      });    
//res.json({status:'error', error:'The checkout has to be post method', code:MessageCode.error});
});



module.exports = router;