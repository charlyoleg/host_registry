// host_registry_service.ts

"use strict";

import hr_config from "./hrs_config";

import * as express from "express";
import * as morgan from "morgan";
import * as rfs from "rotating-file-stream";
import * as path from "path";
import * as fs from "fs";
import * as http from "http";
import * as https from "https";


// ####################################
// Initialization of the express-app
// ####################################

let default_app_http_port = 8442;
let default_app_https_port = 8443;
let default_key_filename = './server_dev.key';
let default_certificate_filename = './server_dev.crt';

if(process.env.NODE_ENV == "production"){
  console.log("Running in ENV production ...");
  default_app_http_port = 80;
  default_app_https_port = 443;
  default_key_filename = './server_prod.key';
  default_certificate_filename = './server_prod.crt';
} else {
  console.log("Running in ENV development ...");
}

const app_http_port = process.env.PORT_NUM || default_app_http_port;
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
// logger
// ####################################

// create a rotating write stream
let accessLogStream = rfs.createStream('access.log', {
  interval: '1d', // 1d: rotate daily
  path: path.join(__dirname, '../log')
});

app.use(morgan('combined', { stream: accessLogStream }))



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

app.use(function (req, res, next) {
  console.log('hostname: ' + req.hostname);
  console.dir(req.subdomains);
  console.log('client ip: ' + req.ip);
  // get the hostname without optional port number
  const re_port = RegExp(':.*$');
  const host_pure_name = req.hostname.replace(re_port, '');
  //
  let new_host: any = {};
  hr_config.forEach( (item) => {
    const regex = RegExp(item.rehost);
    if(regex.test(host_pure_name)){
      console.log('RegExp ' + item.rehost + ' matches ' + host_pure_name);
      new_host = Object.assign({}, item);
    }
  });
  let redirect_action = false;
  let new_url = "";
  if(new_host.hasOwnProperty('url')){
    redirect_action = true;
    new_url += new_host.url;
  } else {
    new_url = "https://" + req.hostname;
  }
  if(new_host.hasOwnProperty('port')){
    redirect_action = true;
    new_url += ":" + new_host.port;
  }
  new_url += req.originalUrl;
  if(redirect_action){
    console.log("redirects to new url: " + new_url);
    res.redirect(new_url);
  } else {
    //res.send(JSON.stringify(hr_config, null, ' '));
    res.end('No matching host for ' + req.hostname);
  }
});


// ####################################
// main while loop
// ####################################

if(process.env.HTTP_ENABLE){
  // ===> with http
  http.createServer(app).listen(app_http_port, () => {
    console.log('http_app  : listening at http port ' + app_http_port + ' to redirect to https');
  });
}

// ===> with https
https.createServer(ssl_options, app).listen(app_https_port, () => {
  console.log("https_app : listening at https port " + app_https_port);
});


