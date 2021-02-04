/**
*@module server
*/

const https = require('https');
const express = require('express');
const path = require('path');
const formidable = require('formidable');
var fs = require('fs');
var ip = require("ip");



const options = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
};

const app = express();
//app.use(express.json());
app.use(express.json({
  type: ['application/json', 'text/plain']
}))
app.use(express.static("express"));

//Send index html data
app.use('/', function(req, res){
  console.debug('Request:');
  console.debug('URL: ' + req.url);
  console.debug('Method: ' + req.method);
  console.debug('Body: ' + req.body);
  console.debug(req.body)
  if(req.url == '/upload'){
    //console.debug(req);
    var name = req.body.array[0].toString();
    var newpath = __dirname + "/express/database/" + name + ".csv"
    csv = createCSV(req.body.array);
    fs.writeFile(newpath, csv, function(err){
      if(err) return console.log(err);
      console.log("File saved");
    });
  }
  if (req.url == '/fileupload') {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
      var oldpath = files.filetoupload.path;
      var newpath = __dirname + "/express/database/" + files.filetoupload.name;
      fs.rename(oldpath, newpath, function (err) {
        if (err) throw err;
        //res.write('File uploaded and moved!');
        //res.end();
      });
 });}
 else{
  res.sendFile(path.join(__dirname+'/express/index.html'));
};

});
const server = https.createServer(options, app);
const port = 8443;

server.on('error', function(err) {
    if(err.code === 'EADDRINUSE')
         console.log("\nServer failed to start. \n"
                      + "Port " + port + " is already in use on this address."
                      + "\nMake sure you have not already started this server in another terminal.\n"
                      + "Other issues could be that other programs, such as skype, \nare listening on the same port.");
    else
         console.log(err);
    process.exit(1);
});

server.listen(port, '0.0.0.0', function() {
    console.debug ('\nYour website can be found at: https://' + ip.address() + ':' + port);
    console.debug('\nListening to port:  ' + port);
});

//console.debug('Server listening on port' + port);

/**
* This function takes an array of data and generates a string representation of a csv file.
@param {Array} data - takes an array of data for generating the csv string.
@returns {String} - returns a csvContent string.
*/
function createCSV(data){
  data.shift(); //Remove first line as this is the title
  let csvContent = "Time,User,Checklist,Event, checked\n"
  + data.map(e => e.join(",")).join("\n");

  return csvContent;
}

/**
* This function gets the current time, creates a string of date and time of day, and returns that string.
@returns {String} - Returns a string containing the current time in the format YYYY-MM-DD_HH-MM-SS.
*/
function currentTime(){
  var today = new Date();
  var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
  var time = today.getHours() + "-" + today.getMinutes() + "-" + today.getSeconds();
  var dateTime = date+'_'+time;

  return dateTime;
}
