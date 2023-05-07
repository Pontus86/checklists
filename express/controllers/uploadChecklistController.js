/**
*@module uploadChecklistController.js
*/

const formidable = require('formidable');
const RSA = require('./../../RSA.js');
var fs = require('fs');


//Simple logger for request data. 
function logRequest(req) {
  console.log('Request:');
  console.log('URL: ' + req.url);
  console.log('Method: ' + req.method);
  console.log('Body: ' + req.body);
  console.log(req.body);
}


//Uploads checklist and an encrypted version of the checklist in a separate binaries folder.
async function uploadChecklist(req, publicKey) {
  logRequest(req);
  var name = req.body.array[0].toString();
  var newpath = __dirname + "/../database/" + name + ".csv";

  for (let i = 0; i < req.body.array.length; i++) {

    var fileName = "./express/database/binaries/" + name + ".bin";
    const dataToEncrypt = req.body.array[i].toString();
    //Needs to overwrite the file on first loop.
    var encryptedData = await RSA.encryptData(dataToEncrypt, publicKey, fileName, true);
    if( i == 0){
      var encryptedData = await RSA.encryptData(dataToEncrypt, publicKey, fileName, false);
    }
    
  }

  req.body.array.forEach(async (element) => {

  });
  csv = createCSV(req.body.array);
  fs.writeFile(newpath, csv, function (err) {
    if (err) return console.log(err);
    console.log("File saved");
  });

}

async function uploadFile(req) {
  var form = new formidable.IncomingForm();
  form.parse(req, function (err, fields, files) {
    var oldpath = files.filetoupload.path;
    var newpath = __dirname + "/express/database/" + files.filetoupload.name;
    fs.rename(oldpath, newpath, function (err) {
      if (err) throw err;
    });
  });
}


/**
* This function takes an array of data and generates a string representation of a csv file.
@param {Array} data - takes an array of data for generating the csv string.
@returns {String} - returns a csvContent string.
*/
function createCSV(data) {
  data.shift(); //Remove first line as this is the title
  let csvContent = "Time,User,Checklist,Event, checked\n"
    + data.map(e => e.join(",")).join("\n");

  return csvContent;
}

module.exports = {
  logRequest: logRequest,
  uploadChecklist: uploadChecklist,
  uploadFile: uploadFile
}