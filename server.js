/**
 *@module server
 */

const https = require('https');
const express = require('express');
const path = require('path');
var fs = require('fs');
var ip = require("ip");
const RSA = require('./RSA.js');
const uploadController = require("./express/controllers/uploadChecklistController.js");



async function main() {

  const PORT = 443;
  const CHECKLIST_ENCRYPTION_PUBLIC_KEY = await RSA.loadPublicKey();

  const APP_OPTIONS = {
    key: fs.readFileSync('../checklist-keys/serverkey.pem'),
    cert: fs.readFileSync('../checklist-keys/servercert.pem')
  };

  let app = setupExpressApp(CHECKLIST_ENCRYPTION_PUBLIC_KEY);
  createServer(APP_OPTIONS, app, PORT);

}




//CREATING THE EXPRESS APP
function setupExpressApp(CHECKLIST_ENCRYPTION_PUBLIC_KEY) {

  let app = express();

  //This is used for the formatting of uploaded data
  app.use(express.json({
    type: ['application/json', 'text/plain']
  }))
  //This is used for getting all data from files such as the index file or checklists
  app.use(express.static("express"));

  //Handle uploads/POSTS
  app.use('/', async function (req, res) {

    //uploadController.logRequest(req);
    if (req.url == '/upload') {
      uploadController.uploadChecklist(req, CHECKLIST_ENCRYPTION_PUBLIC_KEY);
    }
    else {
      res.sendFile(path.join(__dirname + '/express/index.html'));
    };
  });

  return app;
}




//CREATING THE SERVER
function createServer(APP_OPTIONS, app, PORT) {

  const server = https.createServer(APP_OPTIONS, app);

  server.on('error', function (err) {
    if (err.code === 'EADDRINUSE')
      console.log("\nServer failed to start. \n"
        + "PORT " + PORT + " is already in use on this address."
        + "\nMake sure you have not already started this server in another terminal.\n"
        + "Other issues could be that other programs, such as skype, \nare listening on the same PORT.");
    else
      console.log(err);
    process.exit(1);
  });

  server.listen(PORT, '0.0.0.0', function () {
    console.debug('\nYour website can be found at: https://' + ip.address() + ':' + PORT);
    console.debug('\nListening to PORT:  ' + PORT);

  });
}

main();