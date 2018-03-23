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
 
 router.use(function authorization (req,res, next){
     // console.log('Time: ', Date.now(), 'Requests: ', req);
     var session = req.session;
     if(session.authorization == true){

     }else{
        res.redirect("/user/login");
     }
     
     //res.locals.userdata = result.data;
     next();
 });


 router.get("/dashboard", function(req,res){
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