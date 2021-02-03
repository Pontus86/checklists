(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
/**
*@module index
*/

let checklists = "checklists/";
let index = "index.txt";
var currentUser = 177575;
var currentChecklist = "adrenalin";
var events = [];


/**
* This code gets executed when the document content is loaded.
* Calls the functions readTextFile() and readIndex() to load the dropdown menu and the first checklist.
*/
function run(){
    createListFromTextFile(checklists + "adrenalin.txt");

    document.getElementById("title").innerText = currentChecklist;
    document.getElementById("currentUser").innerHTML = "RS-ID: " + currentUser;
    readIndex(checklists + index);

      document.getElementById('btnSave').onclick = function(){
        currentUser = document.getElementById('inputUser').value;
        document.getElementById('inputUser').value = "";
        document.getElementById('currentUser').innerHTML = "RS-ID: " + currentUser;
      }

}
document.addEventListener('DOMContentLoaded', run);

/**
* This method first reads a specified text file,
* then invokes the splitSections() to cut the text into section.
* createListItems() is then invoked to create DOM elements for each section.
@param {String} file - takes a file-path as input.
*/
function createListFromTextFile(file)
{
    var rawFile = new XMLHttpRequest();
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                var allText = rawFile.responseText;
                createListItem(splitSections(allText));
            }
        }
    }
    rawFile.open("GET", file, true);
    rawFile.send(null);
}

/**
* This method makes a 'GET' http request to the server, asking for the index file.
* The server returns the text contained in that file.
* createDropdown() is then called, to instantiate the dropdown elements of the checklists in the navbar.
@param {String} file - takes a file-path as input.
*/
function readIndex(file)
{
    var rawFile = new XMLHttpRequest();
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                var allText = rawFile.responseText;
                createDropdown(allText.split(/\n/ig));
            }
        }
    }
    rawFile.open("GET", file, true);
    rawFile.send(null);
}

/**
* This method splits an input-string into sections by "Title/"
* Then it calls .slice on the input to remove the first section, as this is an empty string.
@param {String} input - takes a string as input.
@returns {Array} - Returns an array of strings after the split and slice operations.
*/
function splitSections(input){
  input = input.split("Title/");
  input = input.slice(1, input.length);
  return input;
}

/**
* This method splits an input-string into sections by "Text/"
@param {String} input - takes a string as input.
@returns {Array} - Returns an array of strings after the split operation.
*/
function splitItems(input){
  return input.split("Text/");
}

/**
* This method replaces all occurences of \n with <br>, to create line breaks in HTML.
@param {String} input - takes a string as input.
@returns {String} - returns the modified string.
*/
function replaceNewLine(input){
  return input.replace(/\n/ig, '<br>');
}

/**
* This method takes an array of strings and creates a dropdown menu containing links
* based on these. This is used to create links to the different checklists.
@param {Array} arrayOfChecklists - takes an array of strings as input.
*/
function createDropdown(arrayOfChecklists){
  var ul = document.getElementById("dropdown");
    for(i=0; i < arrayOfChecklists.length; i++){
      var li = document.createElement("a");
      li.className = "dropdown-item";
      li.setAttribute("id", "dropdown_field_" + i);
      //li.setAttribute("value", content[1]);
      li.value = arrayOfChecklists[i];
      //console.log(li.value);
      li.setAttribute('href', "#");
      li.innerText = arrayOfChecklists[i];
      ul.appendChild(li);
      document.getElementById('dropdown_field_' + i).onclick = function(event){
        //alert(event.target.text);
        document.getElementById("title").innerText = event.target.text;
        document.getElementById("itemText").innerHTML = "";
        document.getElementById("cardTitle").innerHTML = "";
        currentChecklist = event.target.text;
        createListFromTextFile(checklists + event.target.text + ".txt");
      }
    }
}

function createListItem(arrayOfItems){
  console.log("Creating List items");
  document.getElementById("recordsList").innerHTML="";
  var ul = document.getElementById("recordsList");

  for(i=0; i < arrayOfItems.length; i++){
    var content = splitItems(arrayOfItems[i]);
    var checkbox = document.createElement("input");
    var li = document.createElement("a");

    checkbox.id = "checkbox_" + i;
    checkbox.className = "form-check-input";
    checkbox.type = "checkbox";
    checkbox.style.cssFloat = "right";
    checkbox.style.transform = "translate(-40px,-21px)";
    checkbox.value = "checkbox";

    li.id = "list_field_" + i;
    li.className = "list-group-item list-group-item-action floatcontainer";
    li.href = "#";
    li.style.transform = "translate(40px, 0px)"
    li.innerText = content[0];
    li.value = content[1];

    li.appendChild(checkbox);
    ul.appendChild(li);
    setListItemOnClicks(i);
  }
console.log("Done creating List items");
}

function setListItemOnClicks(i){
  document.getElementById('checkbox_' + i).onclick = function(event){
    addEvent(event);
    console.log(event.target.outerHTML);
    saveChoices(events);
  }
  document.getElementById('list_field_' + i).onclick = function(event){
    if(event.target.text != null){
      document.getElementById("cardTitle").innerHTML = event.target.text;
      addEvent(event);
      saveChoices(events);
      document.getElementById("itemText").innerHTML = replaceNewLine(event.target.value);
    }
  }
}


function currentTime(){
  var today = new Date();
  var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
  var time = today.getHours() + "-" + today.getMinutes() + "-" + today.getSeconds();
  var dateTime = date+'_'+time;

  return dateTime;
}

function addEvent(event){
  if(events.length == 0){
    events.push([currentTime(), "__" + currentUser, "__" + currentChecklist]);
  }
  if(event.target.value == "checkbox"){
    var checked = 0;
    if (event.target.checked) checked = 1;
    events.push([currentTime(), currentUser, currentChecklist, event.target.id, checked]);
  }
  else events.push([currentTime(), currentUser, currentChecklist, event.target.text, 9]);

}

/**
* This method sends a POST request to the server, with attached event data.
@param {Array} eventData - takes an array of event data as input
@returns {Integer} - returns the server response. 200 means OK, everything worked out.
*/
async function saveChoices(eventData){
    var response = await fetch('/upload', {method: "POST", body: JSON.stringify({array : eventData})});
    //console.log(response);
    console.log("data sent");
    return response.status;
}

function createCSV(data){
  let csvContent = "data:text/csv;charset=utf-8,";
  data.forEach(function(rowArray) {
      let row = rowArray.join(",");
      csvContent += row + "\r\n";
  });
  return csvContent;
}

module.exports = {splitSections, splitItems, saveChoices};

},{}]},{},[1]);
