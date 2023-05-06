/**
*@module index
*/

let checklists = "checklists/";
let problem = "01_problem/";
let ingrepp = "02_ingrepp/";
let diagnoses = "03_diagnos/";
let fakta = "04_fakta/";
let index = "index.txt";
var currentUser = 177575;
var currentChecklist = "anafylaxi";
var events = [];
var problemList = "";


var menuTexts = [];

/**
* This code gets executed when the document content is loaded.
* Calls the functions readTextFile() and readIndex() to load the dropdown menu and the first checklist.
*/
function run() {
  homeButton();
  createListFromTextFile(checklists + "anafylaxi.txt");
    //createListItem(splitSections(allText));

  problemList = createListFromTextFile(checklists + "anafylaxi.txt");
  readIndex(checklists + index);


  const MENU_NAMES = ['problemButton', 'ingreppButton', 'diagnosButton', 'faktaButton'];
  setMenuItemsOnClickEvents(MENU_NAMES);

}
document.addEventListener('DOMContentLoaded', run);



function setMenuItemsOnClickEvents(menuNames) {
  menuNames.forEach((element, index) => {
    document.getElementById(element).onclick = async function () {
      await showMenu(index);
    }
  });
}


/**
* This method first reads a specified text file,
* then invokes the splitSections() to cut the text into section.
* createListItems() is then invoked to create DOM elements for each section.
@param {String} file - takes a file-path as input.
*/
function createListFromTextFile(file) {
  console.log("File request name is: " + file);
  file = file.toLowerCase();
  console.log("File: " + file);
  var allText = "Title/testing";
  var rawFile = new XMLHttpRequest();
  rawFile.onreadystatechange = function () {
    if (rawFile.readyState === 4) {
      if (rawFile.status === 200 || rawFile.status == 0) {
        allText = rawFile.responseText;
        //return allText;
        createListItem(splitSections(allText));

      }
    }
  }
  rawFile.open("GET", file, true);
  rawFile.send(null);
  return allText;
}

/**
* This method makes a 'GET' http request to the server, asking for the index file.
* The server returns the text contained in that file.
* createDropdown() is then called, to instantiate the dropdown elements of the checklists in the navbar.
@param {String} file - takes a file-path as input.
*/
function readIndex(file, dropdown = true) {
  var rawFile = new XMLHttpRequest();
  rawFile.onreadystatechange = function () {
    if (rawFile.readyState === 4) {
      if (rawFile.status === 200 || rawFile.status == 0) {
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
function splitSections(input) {
  input = input.split("Title/");
  input = input.slice(1, input.length);
  return input;
}

/**
* This method splits an input-string into sections by "Text/"
@param {String} input - takes a string as input.
@returns {Array} - Returns an array of strings after the split operation.
*/
function splitItems(input) {
  return input.split("Text/");
}

/**
* This method replaces all occurences of \n with <br>, to create line breaks in HTML.
@param {String} input - takes a string as input.
@returns {String} - returns the modified string.
*/
function replaceNewLine(input) {
  return input.replace(/\n/ig, '<br>');
}

/**
* This method takes an array of strings and creates a dropdown menu containing links
* based on these. This is used to create links to the different checklists.
@param {Array} arrayOfChecklists - takes an array of strings as input.
*/
function createDropdown(arrayOfChecklists) {
  var ul = document.getElementById("dropdown");
  for (i = 0; i < arrayOfChecklists.length; i++) {
    var li = document.createElement("a");
    li.className = "dropdown-item checklist-dropdown-item";
    li.setAttribute("id", "dropdown_field_" + i);
    //li.setAttribute("value", content[1]);
    li.value = arrayOfChecklists[i];
    //console.log(li.value);
    li.setAttribute('href', "#");
    li.innerText = arrayOfChecklists[i];
    ul.appendChild(li);
    document.getElementById('dropdown_field_' + i).onclick = function (event) {
      //alert(event.target.text);
      document.getElementById("title").innerText = event.target.text;
      document.getElementById("itemText").innerHTML = "";
      document.getElementById("cardTitle").innerHTML = "";
      currentChecklist = event.target.text;
      createListFromTextFile(checklists + event.target.text + ".txt");
      showChecklist();
    }
  }
}

/**
* This method takes an array of strings and creates a list
* based on these. This is used to populate the webpage with a chosen checklist
@param {Array} arrayOfItems - takes an array of strings as input.
*/
function createListItem(arrayOfItems) {
  document.getElementById("ifNoImage").style.display = "none";
  document.getElementById("ifImage").style.display = "none";

  console.log("Creating List items");
  document.getElementById("recordsList").innerHTML = "";
  var ul = document.getElementById("recordsList");
  ul.className = "list-group list-group-flush checklist-list";


  for (i = 0; i < arrayOfItems.length; i++) {
    var content = splitItems(arrayOfItems[i]);
    var checkbox = document.createElement("input");
    var li = document.createElement("a");


    checkbox.id = "checkbox_" + i;
    checkbox.className = "form-check-input checklist-checkbox";
    checkbox.type = "checkbox";
    checkbox.style.cssFloat = "right";
    checkbox.style.transform = "translate(0px,0px)";
    checkbox.value = "checkbox";
    checkbox.style.marginLeft = "auto";


    li.id = "list_field_" + i;
    li.style.display = "flex";
    li.style.flexDirection = "row";
    li.className = "list-group-item list-group-item-action checklist-item";
    li.href = "#";
    li.innerText = content[0];
    li.value = content[1];


    li.appendChild(checkbox);
    ul.appendChild(li);

    setListItemOnClicks(i);
  }


  if (arrayOfItems.toString().includes("I/")) {
    image_source = arrayOfItems.toString()
    image_source = image_source.substring(image_source.search("I/") + 2)
    image_path = "./checklists/" + image_source
    console.log(image_source)
    console.log(image_path)
    document.getElementById("recordsList").innerHTML = "";
    document.getElementById("ifImage").style.display = "block";
    var elem = document.createElement("img");

    //elem.src = './checklists/02_ingrepp/Coniotomi Exemple JPEG.jpg';
    elem.src = image_path;
    elem.setAttribute("height", "768");
    elem.setAttribute("width", "1024");
    elem.setAttribute("alt", "Image not loaded");
    document.getElementById("ifImage").appendChild(elem);
  }
  else {
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
    addEvent(event);
    console.log(event.target.outerHTML);
    saveChoices(events);
  }
  document.getElementById('list_field_' + i).onclick = function (event) {
    if (event.target.text != null) {
      document.getElementById("cardTitle").innerHTML = event.target.text;
      addEvent(event);
      saveChoices(events);
      document.getElementById("itemText").innerHTML = replaceNewLine(event.target.value);
    }
  }
}


/**
* This function gets the current time, creates a string of date and time of day, and returns that string.
@returns {String} - Returns a string containing the current time in the format YYYY-MM-DD_HH-MM-SS.
*/
function currentTime() {
  var today = new Date();
  var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
  var time = today.getHours() + "-" + today.getMinutes() + "-" + today.getSeconds();
  var dateTime = date + '_' + time;

  return dateTime;
}

/**
* This function takes a generated event and adds it to the events-array.
* If this array is empty, a header is first created, containing the current time, current user and current checklist.
@param {String} event - takes an event as input. This event contains the item the user has clicked.
*/
function addEvent(event) {
  if (events.length == 0) {
    events.push([currentTime(), "__" + currentUser, "__" + currentChecklist]);
  }
  if (event.target.value == "checkbox") {
    var checked = 0;
    if (event.target.checked) checked = 1;
    events.push([currentTime(), currentUser, currentChecklist, event.target.id, checked]);
  }
  else events.push([currentTime(), currentUser, currentChecklist, event.target.text, 9]);

}

/**
* This function sends a POST request to the server, with attached event data.
@param {Array} eventData - takes an array of event data as input
@returns {Integer} - returns the server response. 200 means OK, everything worked out.
*/
async function saveChoices(eventData) {
  var response = await fetch('/upload', { method: "POST", body: JSON.stringify({ array: eventData }) });
  //console.log(response);
  console.log("data sent");
  return response.status;
}


function homeButton() {
  document.getElementById("homePage").style.display = "block";
  document.getElementById("menuPage").style.display = "none";
  document.getElementById("checklist").style.display = "none";
}

async function showMenu(menuIndexNumber) {
  await readIndexMenu(menuIndexNumber);
  await delay(150);
  document.getElementById("homePage").style.display = "none";
  document.getElementById("menuPage").style.display = "block";
  document.getElementById("checklist").style.display = "none";
  console.log("show menu");

}

function showChecklist() {
  document.getElementById("homePage").style.display = "none";
  document.getElementById("menuPage").style.display = "none";
  document.getElementById("checklist").style.display = "block";
  document.getElementById("recordsList").innerHTML = "";
  document.getElementById("ifImage").innerHTML = "";

}

function showOnly(input){
  partsOfPage = ["homePage", "menuPage", "checklist"]
  partsOfPage.forEach((element) => {
    if (element == input){
      document.getElementById(input).style.display = "block";
    }
    else{
      document.getElementById(input).style.display = "none";
    }
  })
}


/**
* This method takes an array of strings and creates a dropdown menu containing links
* based on these. This is used to create links to the different checklists.
@param {Array} arrayOfChecklists - takes an array of strings as input.
*/
function createMenuList(menuIndexNumber, arrayOfChecklists) {
  let menuTitles = ["Problem", "Ingrepp", "Diagnoser", "Fakta"];

  var ul = document.getElementById("menuList");
  document.getElementById("menuList").innerHTML = "";
  document.getElementById("menuTitle").innerText = menuTitles[menuIndexNumber];
  for (i = 0; i < arrayOfChecklists.length; i++) {
    var li = document.createElement("a");
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
      createListFromTextFile(checklists + event.target.text + ".txt");
      showChecklist();

    }
  }
}

/**
* This method makes a 'GET' http request to the server, asking for the index file.
* The server returns the text contained in that file.
* createDropdown() is then called, to instantiate the dropdown elements of the checklists in the navbar.
@param {String} file - takes a file-path as input.
*/
async function readIndexMenu(menuIndexNumber) {
  let menus = [problem, ingrepp, diagnoses, fakta];

  var file = checklists + menus[menuIndexNumber] + index;
  var rawFile = new XMLHttpRequest();
  rawFile.onreadystatechange = await function () {
    if (rawFile.readyState === 4) {
      if (rawFile.status === 200 || rawFile.status == 0) {
        menuTexts.push(rawFile.responseText);
        //console.log(rawFile.responseText);
        createMenuList(menuIndexNumber, rawFile.responseText.split(/\n/ig));
      }
    }
  }
  rawFile.open("GET", file, true);
  rawFile.send(null);

}


function delay(milliseconds) {
  return new Promise(resolve => {
    setTimeout(resolve, milliseconds);
  });
}




module.exports = { splitSections, splitItems, saveChoices };
