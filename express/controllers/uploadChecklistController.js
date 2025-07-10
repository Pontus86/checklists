/**
*@module uploadChecklistController.js
*/

const formidable = require('formidable');
const RSA = require('../RSA.js');
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
  //TODO:
  //The name variable is derived from req.body.array[0].toString(), which may cause issues if the array is empty 
  //or doesn't have the expected structure. 
  //It's essential to handle potential errors when accessing array elements.
  //We should probably use some kind of ? conditional to either get the name or have some standard name? Maybe better to
  //induce an error if we have an empty array. Should not be called with empty array. Maybe Assertion?
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
  let csvContent = "Time,User,Checklist,Event,Checklist_item,checked,physician_level,checklist_used,do_confirm,likert_scale,reason_for_no_use,discuss\n"; // Header for the CSV file
  csvContent += data.map(e => e.join(",")).join("\n");

  console.log("CSV content generated:");
  console.log(data);
  console.log(csvContent);

  return csvContent;
  //TODO:
    //The createCSV function seems fine, but keep in mind that it assumes all elements of the input array are also arrays. 
    //Ensure that the input is properly formatted before using this function to avoid errors. Prob use Assert and check
    //if all input data elements is of type Array. 
}

module.exports = {
  logRequest: logRequest,
  uploadChecklist: uploadChecklist
}