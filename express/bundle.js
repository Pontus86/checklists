(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
/**
 *@module Util
 */
class Util{

/**
* This method splits an input-string into sections by "Title/"
* Then it calls .slice on the input to remove the first section, as this is an empty string.
@param {String} input - takes a string as input.
@returns {Array} - Returns an array of strings after the split and slice operations.
*/
splitSections(input) {
    input = input.split("Title/");
    input = input.slice(1, input.length);
    return input;
  }
  
  /**
  * This method splits an input-string into sections by "Text/"
  @param {String} input - takes a string as input.
  @returns {Array} - Returns an array of strings after the split operation.
  */
  splitItems(input) {
    return input.split("Text/");
  }
  
  /**
  * This method replaces all occurences of \n with <br>, to create line breaks in HTML.
  @param {String} input - takes a string as input.
  @returns {String} - returns the modified string.
  */
  replaceNewLine(input) {
    return input.replace(/\n/ig, '<br>');
  }


}

module.exports = Util
},{}],2:[function(require,module,exports){
/**
 *@module index
 */

let Session = require("./models/Session.js");
let Util = require("./Util.js");
let ChecklistItems = require("./views/ChecklistItems.js")

//TODO:
//The variable names like checklists, problem, ingrepp, etc., would be more meaningful if 
//they were written in lowercase or camelCase to adhere to the JavaScript naming conventions.
//TODO:
//The use of document.getElementById and related DOM manipulation functions is prevalent throughout the file. 
//It would be more maintainable to encapsulate these into separate functions for better organization and readability.
//TODO:
//The functions createListFromTextFile, readIndex, and readIndexMenu perform similar XMLHttpRequest operations. 
//Consider refactoring these into a single reusable function with additional parameters to handle different cases.
let checklistFolders = {
  "checklists" : "checklists/",
  "problem" : "01_problem/",
  "ingrepp" : "02_ingrepp/",
  "diagnoses" : "03_diagnos/",
  "fakta" : "04_fakta/" 
}
const SECTION_NAMES = ["homePage", "menuPage", "checklist"];

let problem = "01_problem/";
let ingrepp = "02_ingrepp/";
let diagnoses = "03_diagnos/";
let fakta = "04_fakta/";
let index = "index.txt";
let events = [];

const session = new Session();
const util = new Util();
const checklistItems = new ChecklistItems();

let menuTexts = [];
const MENU_NAMES = ['problemButton', 'ingreppButton', 'diagnosButton', 'faktaButton'];
//TODO:
//The variable declarations at the beginning of the file could be grouped together for better readability.


/**
 * This code gets executed when the document content is loaded.
 * Calls the functions readTextFile() and readIndex() to load the dropdown menu and the first checklist.
*/
function run() {
  session.setUserRSID = "177575";
  viewHomePage();
  setMenuItemsOnClickEvents(MENU_NAMES);
  let homeButton = document.getElementById("homeButton")
  let homeButton2 = document.getElementById("homeButton2")
  homeButton.onclick = viewHomePage;
  homeButton2.onclick = viewHomePage;
}
document.addEventListener('DOMContentLoaded', run);

function resetChecklist() {
  cardBackground = document.getElementById("checklistCardBackground");
  cardBackground.style.backgroundColor = 'rgb(255, 255, 255)';
}

function viewHomePage() {
  setVisibleSection(SECTION_NAMES[0]);
  resetChecklist();
}

function setMenuItemsOnClickEvents(menuNames) {
  menuNames.forEach((element, index) => {
    document.getElementById(element).onclick = async function () {
      await showMenu(index);
    }
  });
}



async function showMenu(menuIndexNumber) {
  await readIndexMenu(menuIndexNumber);
  setVisibleSection(SECTION_NAMES[1]);
}

async function createXMLHttpRequest(file, callbackFunction, ...callbackArgs){

  const DONE = 4;
  const STATUS_OK = 200;
  const STATUS_0 = 0;

  xmlHttpRequest = new XMLHttpRequest();
  xmlHttpRequest.onreadystatechange = function () {
    if (xmlHttpRequest.readyState === DONE && xmlHttpRequest.status === STATUS_OK) {
      callbackFunction(xmlHttpRequest, ...callbackArgs);
    }
    else if (xmlHttpRequest.readyState === DONE && xmlHttpRequest.status === STATUS_0){
    //This is the special case when we have a ready file but there is a status 0 meaning error.
      //TODO: We should implement some error logging or handling here.x
      console.log(xmlHttpRequest)
    }
    else{
      console.log("ReadyState: "+ xmlHttpRequest.readyState);
      console.log("Status: "+ xmlHttpRequest.status);
      console.log(xmlHttpRequest)
    }
  }
  xmlHttpRequest.open("GET", file, true);
  xmlHttpRequest.send(null);

}


async function readIndexMenu(menuIndexNumber) {
  let menus = [problem, ingrepp, diagnoses, fakta];
  
  let file = checklistFolders.checklists + menus[menuIndexNumber] + index;
  createXMLHttpRequest(file, createMenuList, menuIndexNumber);
}


function setVisibleSection(name){
  SECTION_NAMES.forEach(element => {
    let visibility = element === name ? "block" : "none"; 
    document.getElementById(element).style.display = visibility;
  })
}

/**
 * This method first reads a specified text file,
 * then invokes the splitSections() to cut the text into section.
 * createListItems() is then invoked to create DOM elements for each section.
@param {String} file - takes a file-path as input.
*/
function createListFromTextFile(file) {
  file = file.toLowerCase();
  createXMLHttpRequest(file, createListItem);
}



/**
* This method takes an array of strings and creates a list
* based on these. This is used to populate the webpage with a chosen checklist
@param {Array} arrayOfItems - takes an array of strings as input.
*/
function createListItem(rawFile) {
  arrayOfItems = util.splitSections(rawFile.responseText)
  
  document.getElementById("ifNoImage").style.display = "none";
  document.getElementById("ifImage").style.display = "none";
  document.getElementById("recordsList").innerHTML = "";

  if (arrayOfItems.toString().includes("I/")) {
    image_source = arrayOfItems.toString()
    image_source = image_source.substring(image_source.search("I/") + 2)
    image_path = "./checklists/" + image_source
    let elem = checklistItems.createImage(image_path);
    document.getElementById("ifImage").appendChild(elem);
    document.getElementById("ifImage").style.display = "block";
  }
  else {
    console.log("Creating List items");
    let ul = document.getElementById("recordsList");
    ul.className = "list-group list-group-flush checklist-list";
  
    for (i = 0; i < arrayOfItems.length; i++) {
      let content = util.splitItems(arrayOfItems[i]);
      let checkbox = checklistItems.createCheckbox(i);
      let li = checklistItems.createLI(content, i);
      li.style.display = "flex"; // Make the <li> a flex container
      li.appendChild(checkbox);
      ul.appendChild(li);
      setListItemOnClicks(i);
    }
    document.getElementById("ifNoImage").style.display = "block";
  }

  console.log("Done creating List items");
}



/**
* This function add OnClick events to checkboxes and list fields.
This ensures that data is sent to the server upon each click.
@param {Integer} i - the number of the current list item and checkbox to get OnClick event listeners.
*/
function setListItemOnClicks(i) {
  document.getElementById('checkbox_' + i).onclick = function (event) {
    session.addEvent(event);
    session.saveChoices(events);
  }
  document.getElementById('list_field_' + i).onclick = function (event) {
    if (event.target.text != null) {
      cardBackground = document.getElementById("checklistCardBackground");
      cardBackground.style.backgroundColor = 'rgb(248, 249, 250)';
      document.getElementById("cardTitle").innerHTML = event.target.text;
      session.addEvent(event);
      session.saveChoices(events);
      document.getElementById("itemText").innerHTML = util.replaceNewLine(event.target.value);
    }
  }
}


function showChecklist() {
  setVisibleSection(SECTION_NAMES[2]);
  document.getElementById("recordsList").innerHTML = "";
  document.getElementById("ifImage").innerHTML = "";
}

/**
* This method takes an array of strings and creates a dropdown menu containing links
* based on these. This is used to create links to the different checklists.
@param {Array} arrayOfChecklists - takes an array of strings as input.
*/
function createMenuList(rawFile, menuIndexNumber) {
  arrayOfChecklists = rawFile.responseText.split(/\n/ig);
  
  let menuTitles = ["Problem", "Ingrepp", "Diagnoser", "Fakta"];

  let ul = document.getElementById("menuList");
  document.getElementById("menuList").innerHTML = "";
  document.getElementById("menuTitle").innerText = menuTitles[menuIndexNumber];
  for (i = 0; i < arrayOfChecklists.length; i++) {
    let li = document.createElement("a");
    li.className = "menu-item checklist-menu-item";
    li.setAttribute("id", "menu_field_" + i);
    //li.setAttribute("value", content[1]);
    li.value = arrayOfChecklists[i];
    //console.log(li.value);
    li.setAttribute('href', "#");
    li.innerText = arrayOfChecklists[i];
    ul.appendChild(li);
    document.getElementById('menu_field_' + i).onclick = async function (event) {
      //alert(event.target.text);
      document.getElementById("title").innerText = event.target.text;
      document.getElementById("itemText").innerHTML = "";
      document.getElementById("cardTitle").innerHTML = "";
      currentChecklist = event.target.text;
      createListFromTextFile(checklistFolders.checklists + event.target.text + ".txt");
      showChecklist();

    }
  }
}



module.exports = {}



},{"./Util.js":1,"./models/Session.js":3,"./views/ChecklistItems.js":4}],3:[function(require,module,exports){
/**
 *@module Session
 */
class Session {

    constructor() {
        this.userRSID = "";
        this.checklist = "";
        this.events = [];
    }
    set setUserRSID(userRSID){
        this.userRSID = userRSID;
    }
    set setChecklist(checklist){
        this.checklist = checklist;
    }

    /**
    * This function takes a generated event and adds it to the events-array.
    * If this array is empty, a header is first created, containing the current time, current user and current checklist.
    @param {String} event - takes an event as input. This event contains the item the user has clicked.
    */
    addEvent(event) {
        if (this.events.length == 0) {
            this.events.push([this.getCurrentTime(), "__" + this.userRSID, "__" + this.checklist]);
        }
        if (event.target.value == "checkbox") {
            var checked = 0;
            if (event.target.checked) checked = 1;
            this.events.push([this.getCurrentTime(), this.userRSID, this.checklist, event.target.id, checked]);
        }
        else this.events.push([this.getCurrentTime(), this.userRSID, this.checklist, event.target.text, 9]);

    }

    /**
    * This function sends a POST request to the server, with attached event data.
    @returns {Integer} - returns the server response. 200 means OK, everything worked out.
    */
    async saveChoices() {
        var response = await fetch('/upload', { method: "POST", body: JSON.stringify({ array: this.events }) });
        console.log("data sent");
        return response.status;
    }

/**
* This function gets the current time, creates a string of date and time of day, and returns that string.
@returns {String} - Returns a string containing the current time in the format YYYY-MM-DD_HH-MM-SS.
*/
getCurrentTime() {
  var today = new Date();
  var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
  var time = today.getHours() + "-" + today.getMinutes() + "-" + today.getSeconds();
  var dateTime = date + '_' + time;

  return dateTime;
}
}

module.exports = Session
},{}],4:[function(require,module,exports){
/**
 *@module ChecklistItems
 */
class ChecklistItems {
  createCheckbox2(index) {

    if (typeof index !== "number" || !Number.isInteger(index) || index < 0) {
      throw new TypeError("Index must be a non-negative integer.");
    }
    let checkbox = document.createElement("input");
    checkbox.id = "checkbox_" + index;
    checkbox.className = "form-check-input checklist-checkbox";
    checkbox.type = "checkbox";
    checkbox.style.cssFloat = "right";
    checkbox.style.transform = "translate(0px,0px)";
    checkbox.value = "checkbox";
    checkbox.style.marginLeft = "auto";
    return checkbox;
  }


  createCircle(color, index) {
    // Create the container for the circle
    let container = document.createElement("label");
    container.className = "circle-container-" + color;

    // Create the radio button
    let radio = document.createElement("input");
    radio.type = "radio";
    radio.name = "" + index;
    radio.style.display = "none";

    // Create the circle element within the container
    let circle = document.createElement("div");
    circle.className = color + "-circle";
    circle.style.display = "flex";
    circle.style.alignItems = "center";
    circle.style.justifyContent = "center"; // Center horizontally and vertically


    // Append elements
    container.appendChild(radio);
    container.appendChild(circle);
    

    return container;
  }

  createCheckbox(index){
      let container = document.createElement("div");
      container.appendChild(this.createCircle("green", index));
      container.appendChild(this.createCircle("yellow", index));
      container.appendChild(this.createCircle("red", index));
      container.id = "checkbox_" + index;
      container.style.marginLeft = "auto";
      return container
  }


  createLI(content, index) {
    if (typeof index !== "number" || !Number.isInteger(index) || index < 0) {
      throw new TypeError("Index must be a non-negative integer.");
    }
    if (!Array.isArray(content) || content.length < 2 || typeof content[0] !== "string" || typeof content[1] !== "string") {
      throw new TypeError("Content must be an array with two strings as first and second argument");
    }

    let li = document.createElement("a");

    li.id = "list_field_" + index;
    li.style.display = "flex";
    li.style.flexDirection = "row";
    li.className = "list-group-item list-group-item-action checklist-item";
    li.href = "#";
    li.innerText = content[0];
    li.value = content[1];
    return li;
  }


  createImage(image_path) {
    if (typeof image_path !== "string") {
      throw new TypeError("Image path must be a string.");
    }
    let elem = document.createElement("img");

    //elem.src = './checklists/02_ingrepp/Coniotomi Exemple JPEG.jpg';
    elem.src = image_path;
    elem.setAttribute("height", "768");
    elem.setAttribute("width", "1024");
    elem.setAttribute("alt", "Image not loaded");
    return elem;
  }

  
}


module.exports = ChecklistItems
},{}]},{},[2]);
