/**
*@module server
*/

const https = require('https');
const express = require('express');
const path = require('path');
const formidable = require('formidable');
var fs = require('fs');

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
server.listen(port, '0.0.0.0', function() {
    console.debug('Listening to port:  ' + port);
});

//console.debug('Server listening on port' + port);


function createCSV(data){
  data.shift(); //Remove first line as this is the title
  let csvContent = "Time,User,Checklist,Event, checked\n"
  + data.map(e => e.join(",")).join("\n");

  return csvContent;
}

function currentTime(){
  var today = new Date();
  var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
  var time = today.getHours() + "-" + today.getMinutes() + "-" + today.getSeconds();
  var dateTime = date+'_'+time;

  return dateTime;
}
