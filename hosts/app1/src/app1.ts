// app1.ts

"use strict";


import * as express from "express";
import * as path from "path";
import * as fs from "fs";
import * as https from "https";


// ####################################
// Initialization of the express-app
// ####################################

const default_app_https_port = 8001;
const default_key_filename = './server_dev.key';
const default_certificate_filename = './server_dev.crt';
const default_app_keyword = "app1";

if(process.env.NODE_ENV == "production"){
  console.log("Running in ENV production ...");
} else {
  console.log("Running in ENV development ...");
}

const app_https_port = process.env.PORT_NUM || default_app_https_port;
const key_filename = process.env.KEY_FILE || default_key_filename;
const certificate_filename = process.env.CERT_FILE || default_certificate_filename;

console.log("Using files: " + key_filename + " and " + certificate_filename);

const ssl_options = {
    key: fs.readFileSync( path.join(__dirname, key_filename) ),
    cert: fs.readFileSync( path.join(__dirname, certificate_filename) )
};


const app = express();



// ####################################
// Browser security policy: Access-Control-Allow-Origin
// ####################################

app.use("/", (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    next();
});



// ####################################
// http-app just to redirect http to https
// ####################################

const app_keyword = process.env.KEYWORD || default_app_keyword;

app.use(function (req, res, next) {
  console.log('hostname: ' + req.hostname);
  console.dir(req.subdomains);
  console.log (req.originalUrl);
  console.log('client ip: ' + req.ip);
  res.end('Hello from '+ app_keyword + '!');
});


// ####################################
// main while loop
// ####################################


// ===> with https
https.createServer(ssl_options, app).listen(app_https_port, () => {
  console.log("https_app : listening at https port " + app_https_port);
});


