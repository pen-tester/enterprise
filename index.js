#!/usr/bin/env node


var express = require('express');
var session = require('express-session');

var customer = require('./route/customer');
var user = require('./route/user');
var main_route = require('./route/main');
var helper_route=require('./route/helper');
var checkout_route=require('./route/checkout');

var socketio = require('socket.io');
var notification_process = require('./server/notification');
var global_area = require('./config/global');

var mongoose = require("mongoose");
var config=require("./config/config");
var bodyParser = require("body-parser");
var path = require('path');

const options = {
    reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
    reconnectInterval: 500, // Reconnect every 500ms
    poolSize: 10, // Maintain up to 10 socket connections
    // If not connected, return errors immediately rather than waiting for reconnect
    bufferMaxEntries: 0
  };


mongoose.connect(config.mongodb_uri, options);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(){
    console.log("mongodb is connected to db",config.mongodb_uri);
})


var app=express();
//Set static files for js file..
app.use(express.static(path.join(__dirname, 'public')));
console.log(__dirname);
//Set view engine
app.set('view engine', 'ejs');


app.use(bodyParser.json());  //support json encoded bodies
app.use(bodyParser.urlencoded({extended:true}));  //support encoded bodies
app.use(session({secret:config.session_secretkey,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
}));

//For the url starts with report
app.use('/customer', customer);
app.use('/user', user);
app.use('/helper',helper_route);
app.use('/checkout', checkout_route);
app.use('/',main_route);


var server = app.listen(8090, function(){
        var host = server.address().address;
        var port = server.address().port;
        console.log("server started ", host, ":", port);
});

//For the socketio server
var socket_con = socketio(server);

//For the connected socket process
notification_process(socket_con);