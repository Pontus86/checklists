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
  console.log("function1");
  logRequest(req);
  var name = req.body.array[0].toString();
  var newpath = __dirname + "/../database/" + name + ".csv";

  for (let i = 0; i < req.body.array.length; i++) {

    var fileName = "./express/database/binaries/" + name + ".bin";
    const dataToEncrypt = req.body.array[i].toString();
    //Needs to overwrite the file on first loop.
    let firstLoop = false;
    if(i==0){
      firstLoop = true;
    }
    var encryptedData = await RSA.encryptData(dataToEncrypt, publicKey, fileName, append=firstLoop);
  }

  req.body.array.forEach(async (element) => {

  });
  csv = createCSV(req.body.array);
  fs.writeFile(newpath, csv, function (err) {
    if (err) return console.log(err);
    console.log("File saved");
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
  uploadChecklist: uploadChecklist
}