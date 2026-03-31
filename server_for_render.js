/**
 *@module server
 */

const express = require('express');
const path = require('path');
var fs = require('fs');
const RSA = require('./express/RSA.js');
const uploadController = require("./express/controllers/uploadChecklistController.js");
const os = require('os');

async function main() {

  const CHECKLIST_ENCRYPTION_PUBLIC_KEY = await RSA.loadPublicKey();

  var app = setupExpressApp(CHECKLIST_ENCRYPTION_PUBLIC_KEY);
  createServer(app);

}

//TODO: Getting the RSA Key for testing in server.test.js.
async function getRSAKey(){
  let key = await RSA.loadPublicKey(); 
  return key; 
}

//CREATING THE EXPRESS APP
function setupExpressApp(CHECKLIST_ENCRYPTION_PUBLIC_KEY) {

  let app = express();

  // Parse JSON
  app.use(express.json({
    type: ['application/json' , "text/plain"]
  }));
  
  // Case-insensitive file serving middleware
  app.use(async (req, res, next) => {
    if (req.method === 'GET') {
      const requestedPath = path.join(__dirname, 'express', req.path);

      try {
        const files = await fs.promises.readdir(path.dirname(requestedPath));
        const requestedFileLower = path.basename(requestedPath).toLowerCase()
          .replace(/%20/g, ' ')
          .replace(/%c3%a5/g, 'å')
          .replace(/%c3%a4/g, 'ä')
          .replace(/%c3%b6/g, 'ö');
        
        const found = files.find(file => file.toLowerCase() === requestedFileLower);

        if (found) {
          return res.sendFile(path.join(path.dirname(requestedPath), found));
        }
      } catch (error) {
        console.error(error);
      }
    }
    next();
  });

  // Static files
  app.use(express.static("express"));

  // Handle uploads / routing
  app.use('/', async function (req, res) {

    if (req.url == '/upload') {
      const response = uploadController.uploadChecklist(req, CHECKLIST_ENCRYPTION_PUBLIC_KEY);
      res.send(response);
    }
    else {
      res.sendFile(path.join(__dirname, 'express', 'index.html'));
    }
  });

  return app;
}

//CREATING THE SERVER (Render-compatible)
function createServer(app) {

  const PORT = process.env.PORT || 3000;

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Listening on port ${PORT}`);
  });
}

/* Run only if started directly */
if (require.main === module){
  main();
}

module.exports = {setupExpressApp, getRSAKey};