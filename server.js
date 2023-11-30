/**
 *@module server
 */

const https = require('https');
const express = require('express');
const path = require('path');
var fs = require('fs');
var ip = require("ip");
const RSA = require('./express/RSA.js');
const uploadController = require("./express/controllers/uploadChecklistController.js");




async function main() {

  const PORT = 443;
  const CHECKLIST_ENCRYPTION_PUBLIC_KEY = await RSA.loadPublicKey();
  //TODO:
  //Make sure to handle possible errors when loading the public key using await RSA.loadPublicKey() 
  //since this is an async operation.

  const APP_OPTIONS = {
    key: fs.readFileSync('./checklist-keys/serverkey.pem'),
    cert: fs.readFileSync('./checklist-keys/servercert.pem')
    //TODO:
    //It's a good idea to have a separate configuration file for APP_OPTIONS, 
    //but it would be better to define the file paths as constants to improve readability and maintainability.
    //TODO:
    //Add readFile callback if file reading fails. fs.readFileSync("Text", "utf-8", (err, text => {}))
  };

  var app = setupExpressApp(CHECKLIST_ENCRYPTION_PUBLIC_KEY);
  createServer(APP_OPTIONS, app, PORT);

}

//TODO: Getting the RSA Key for testing in server.test.js. Could be refactored out by letting test function call RSA itself.
async function getRSAKey(){
  let key = await RSA.loadPublicKey(); 
  return key; 
}




//CREATING THE EXPRESS APP
// TODO: add debug logs for both POST and GET requests

function setupExpressApp(CHECKLIST_ENCRYPTION_PUBLIC_KEY) {

  let app = express();

  //This is used for the formatting of uploaded data
  app.use(express.json({
    type: ['application/json' ] //removed , text/plain
  }))
  //This is used for getting all data from files such as the index file or checklists
  app.use(express.static("express"));

  //Handle uploads/POSTS
  app.use('/', async function (req, res) {

    if (req.url == '/upload') {
      //TODO: If this req has an empty body, something went wrong with the post and we should not call uploadController,
      //but instead issue some kind of error handling.
      uploadController.uploadChecklist(req, CHECKLIST_ENCRYPTION_PUBLIC_KEY);
      res.send("Uploaded");
      //TODO: 
      //Consider adding error handling and response messages when handling uploads/POST requests. 
      //Currently, when the upload is successful, 
      //it simply sends "Uploaded," but you might want to provide more informative responses to clients.
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
      const UNCAUGHT_FATAL_EXCEPTION = 1;
      process.exit(UNCAUGHT_FATAL_EXCEPTION);
  });

  server.listen(PORT, '0.0.0.0', function () {
    console.log('\nYour website can be found at: https://' + ip.address() + ':' + PORT);
    console.log('\nListening to PORT:  ' + PORT);

  });
}

/*This checks if server.js was run directly from the terminal. If so, it runs the main function.
If not, it is imported into another .js file and should not run the main function automatically. 
This lets us import this file into server.test.js for testing purposes, without starting a server at startup.*/
if (require.main === module){
  main();
}


module.exports = {setupExpressApp, getRSAKey}