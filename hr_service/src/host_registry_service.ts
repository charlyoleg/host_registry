// host_registry_service.ts

"use strict";

import {Ivhost, hrs_config} from "./hrs_config";

import * as express from "express";
import * as morgan from "morgan";
import * as rfs from "rotating-file-stream";
import * as path from "path";
import * as fs from "fs";
import * as http from "http";
import * as https from "https";



// ####################################
// Initialize hrs_config2
// ####################################

interface Ivhost2 extends Ivhost {
  regex: RegExp;
}

let hrs_config2: Ivhost2[] = [];
hrs_config.forEach( (item) => {
  if(item.hasOwnProperty('rehost')){
    const regex = RegExp(item.rehost, 'i');
    let one_entry = <Ivhost2> Object.assign({}, item);
    one_entry['regex'] = regex;
    hrs_config2.push(one_entry);
  }
});


// ####################################
// Initialization of the express-app
// ####################################

let default_app_http_port = 8442;
let default_app_https_port = 8443;
let default_key_filename = './server_dev.key';
let default_certificate_filename = './server_dev.crt';

if(process.env.NODE_ENV == "production"){
  console.log("Running in ENV production ...");
  let default_port_offset = 0;
  default_port_offset += 1000;
  default_app_http_port = default_port_offset + 80;
  default_app_https_port = default_port_offset + 443;
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

let g_count_redirection = 0;
let g_count_not_found = 0;

app.use(function (req, res, next) {
  //console.log('hostname: ' + req.hostname);
  //console.dir(req.subdomains);
  //console.log('client ip: ' + req.ip);
  console.log('REQUEST from client-ip ' + req.ip +  ' for hostname: ' + req.hostname);
  // get the hostname without optional port number
  //const re_port = RegExp(':.*$'); // not needed, port-number seems to be already removed by expressjs
  //const host_pure_name = req.hostname.replace(re_port, '');
  const host_pure_name = req.hostname;
  //
  let new_host: any = {};
  hrs_config2.forEach( (item) => {
    if(item.regex.test(host_pure_name)){
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
    g_count_redirection += 1;
    const tmp_sum = g_count_redirection + g_count_not_found;
    console.log("redirects to new url: " + new_url + ". Stat: " + tmp_sum + " - " + g_count_redirection + " - " + g_count_not_found);
    res.redirect(new_url);
  } else {
    g_count_not_found += 1;
    const tmp_sum = g_count_redirection + g_count_not_found;
    console.log("default no matching message. Stat: " + tmp_sum + " - " + g_count_redirection + " - " + g_count_not_found);
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
    console.log('http_app  : listening at http port ' + app_http_port);
  });
}

// ===> with https
https.createServer(ssl_options, app).listen(app_https_port, () => {
  console.log("https_app : listening at https port " + app_https_port);
});


