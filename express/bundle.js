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

  replaceExternalLinks(inputString) {
    // Regular expression to find the pattern: ExternalLink/<TextToShow><urlToGoTo>
    let regex = /ExternalLink\/<([^>]+)><([^>]+)>/g;
  
    // Replace the pattern with the anchor tag
    let replacedString = inputString.replace(regex, '<a href="$2" class = "links" target="_blank" data-url="">$1</a>');
  
    return replacedString;
  }

  makeTextGreen(inputString) {
    // Regular expression to find the pattern: Green/<SomeText>
    let regex = /Green\/<([^>]+)>/g;

    // Replace the pattern with the styled text
    let replacedString = inputString.replace(regex, '<span style="color: green;">$1</span>');

    return replacedString;
  }
  
  makeTextRed(inputString) {
    // Regular expression to find the pattern: Green/<SomeText>
    let regex = /Red\/<([^>]+)>/g;

    // Replace the pattern with the styled text
    let replacedString = inputString.replace(regex, '<span style="color: red;">$1</span>');

    return replacedString;
  }

  makeTextColor(inputString) {
    // Regular expression to find the pattern: Green/<SomeText>
    let regex = /Color\/<([^>]+)><([^>]+)>/g;

    // Replace the pattern with the styled text
    let replacedString = inputString.replace(regex, '<span style="color: $1;">$2</span>');

    return replacedString;
  }

  chapterTitle(inputString) {
    // Regular expression to find the pattern: Green/<SomeText>
    let regex = /ChapterTitle\/<([^>]+)>/g;

    // Replace the pattern with the styled text
    let replacedString = inputString.replace(regex, '<span style="color: green;">$1</span>');
  
    return replacedString;
  }

  applyStyling(inputString){
    let returnString = this.replaceNewLine(this.replaceExternalLinks(this.makeTextColor(this.makeTextRed(this.makeTextGreen(this.chapterTitle(inputString))))));
    return returnString
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
async function run() {
  // createModal()
  // Usage
  getAllChecklists()
  .then(() => {
      console.log('All checklists fetched successfully');
  })
  .catch((error) => {
      console.error('Error fetching checklists:', error);
  });



  session.setUserRSID = "177575";
  viewHomePage();
  setMenuItemsOnClickEvents(MENU_NAMES);
  let homeButton = document.getElementById("homeButton")
  let homeButton2 = document.getElementById("homeButton2")
  //homeButton.onclick = viewHomePage;
  homeButton.addEventListener("click", function() {
    addToHistory("viewHomePage", [])
    viewHomePage();
  })
  homeButton2.addEventListener("click", function() {
    addToHistory("viewHomePage", [])
    viewHomePage();
  })
  //homeButton2.onclick = viewHomePage;

  // Get the search bar element and add event listener for input changes
  let searchBar = document.getElementById('searchBar');
  searchBar.addEventListener('input', function() {
    if (this.value.trim() !== '') {
      updateList(this.value);
    }
  });
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
      addToHistory("showMenu", [index])
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
      //console.log(xmlHttpRequest)
    }
    else{
      console.log("ReadyState: "+ xmlHttpRequest.readyState);
      console.log("Status: "+ xmlHttpRequest.status);
      //console.log(xmlHttpRequest);
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

  hideElementAndChildren(document.getElementById("ifNoImage"))
  hideElementAndChildren(document.getElementById("ifImage"))

  document.getElementById("recordsList").innerHTML = "";

  if (arrayOfItems.toString().includes("I/")) {
    ifImage(arrayOfItems);
  }
  else {
    ifNoImage(arrayOfItems);
  }
  console.log("Done creating List items");
}


function ifImage(arrayOfItems){
  showElementAndChildren(document.getElementById("ifImage"))
  document.getElementById("ifImage").style.display = "block";
  image_source = arrayOfItems.toString()
  image_source = image_source.substring(image_source.search("I/") + 2)
  image_path = "./checklists/" + image_source
  let elem = checklistItems.createImage(image_path);
  document.getElementById("ifImage").style.visibility = "hidden" ; // Make the image visible
  // Set the transition effect using JavaScript
  //document.getElementById("ifImage").style.transition = 'opacity 2s ease-in-out';

// Initially set the image opacity to 0
  //document.getElementById("ifImage").style.opacity = '0';
  document.getElementById("ifImage").appendChild(elem);
  elem.onload =  function(){
    document.getElementById("ifImage").style.visibility = 'visible'; // Make the image visible
    //document.getElementById("ifImage").style.opacity = '1';
  }
}


function ifNoImage(arrayOfItems){
    showElementAndChildren(document.getElementById("ifNoImage"))
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
    let sourceHeight = document.getElementById("checklistLeftCol").clientHeight; 
    document.getElementById("checklistCard").style.minHeight = sourceHeight + 'px';
    //document.getElementById("ifNoImage").style.display = "block";
}

function hideElementAndChildren(element) {
  element.style.display = 'none'; // Hide the current element

  // Loop through each child element and hide them as well
  let children = element.children;
  for (let i = 0; i < children.length; i++) {
      hideElementAndChildren(children[i]);
  }
}

function showElementAndChildren(element) {
  element.style.display = ''; // Reset the display property for the current element

  // Loop through each child element and show them as well
  let children = element.children;
  for (let i = 0; i < children.length; i++) {
      showElementAndChildren(children[i]);
  }
}



/**
* This function add OnClick events to checkboxes and list fields.
This ensures that data is sent to the server upon each click.
@param {Integer} i - the number of the current list item and checkbox to get OnClick event listeners.
*/
function setListItemOnClicks(i) {
  
  document.getElementById('checkbox_' + i).onclick = function (event) {
    event.stopPropagation();
    if(event.target.nodeName == "INPUT"){
      console.log("Klick på checkbox")
      //event.preventDefault();
      session.addEvent(event);
      session.saveChoices(events);
  }
  }
  
  document.getElementById('list_field_' + i).onclick = function (event) {
    console.log("Först klickas list field")
    event.preventDefault();
    if (event.target.value != null) {
      cardBackground = document.getElementById("checklistCardBackground");
      cardBackground.style.backgroundColor = 'rgb(248, 249, 250)';
      document.getElementById("cardTitle").innerHTML = event.target.textContent;
      session.addEvent(event);
      session.saveChoices(events);
      value = util.applyStyling(event.target.value)
      value = replaceInternalLinks(value)

      document.getElementById("itemText").innerHTML = value;
      //document.getElementById("itemText").innerHTML = util.replaceNewLine(event.target.value);
      setOnClickForATags("itemText");
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
  console.log(arrayOfChecklists)
  
  let menuTitles = ["Problem", "Ingrepp", "Diagnoser", "Fakta"];

  let ul = document.getElementById("menuList");
  document.getElementById("menuList").innerHTML = "";
  document.getElementById("menuTitle").innerText = menuTitles[menuIndexNumber];

  listOfUls = [];
  group = -1;

  for (i = 0; i < arrayOfChecklists.length; i++) {
    if (arrayOfChecklists[i].length == 0){
      arrayOfChecklists[i] = "---";
    }
    let li = document.createElement("div");
    li.className = "menu-item checklist-menu-item";
    li.setAttribute("id", "menu_field_" + i);
    li.value = arrayOfChecklists[i];
    //li.setAttribute('href', "#");
    innerText = util.applyStyling(arrayOfChecklists[i])
    li.innerHTML = innerText;
    ul2 = document.createElement("li");
    ul2.className = "vertical-stack";
    ul2.style.breakInside = 'avoid-column';
    
    if(arrayOfChecklists[i].includes("---") || innerText.startsWith("<span")){
      console.log(arrayOfChecklists[i].length)
      li.className = "non-clickable";
      if (innerText.startsWith("<span")){
        group += 1;
        listOfUls.push(ul2);
      }
    }
    //If first element isn't a title, create the first group anyway
    if(group == -1){ 
      group += 1;
        listOfUls.push(ul2);
    }
    listOfUls[group].appendChild(li);
    
  }
  for(j=0; j < listOfUls.length; j++){
    ul.appendChild(listOfUls[j]);
  }
  for(i=0; i < arrayOfChecklists.length; i++){
    document.getElementById('menu_field_' + i).onclick = async function (event) {
      addToHistory("getChecklistFromInternalLink", [event.target.value])
      getChecklistFromInternalLink(event.target.value)
    }
  }
}

function getChecklistFromInternalLink(checklistName){
  
  resetSearchList()
  checklistName = checklistName.charAt(0).toUpperCase() + checklistName.slice(1)
  document.getElementById("title").innerText = checklistName;
  document.getElementById("itemText").innerHTML = "";
  document.getElementById("cardTitle").innerHTML = "";
  currentChecklist = checklistName;
  session.checklist = checklistName;
  createListFromTextFile(checklistFolders.checklists + currentChecklist + ".txt");
  resetChecklist();
  showChecklist();
}

function replaceInternalLinks(inputString) {
  // Regular expression to find the pattern: ExternalLink/<TextToShow><urlToGoTo>
  let regex = /InternalLink\/<([^>]+)><([^>]+)>/g;

  // Replace the pattern with the anchor tag
  // <a href="#" onclick="myFunction()">Click me</a>
  let replacedString = inputString.replace(regex, '<a href="#" class="links" data-url="$2">$1</a>');

  return replacedString;
}

function setOnClickForATags(parentId) {
  // Get the parent element
  let parentElement = document.getElementById(parentId);

  // Find all <a> tags within the parent element
  let aTags = parentElement.querySelectorAll('a');

  // Loop through each <a> tag and set the onclick attribute
  aTags.forEach(function(aTag) {
      if(aTag.dataset.url != ""){
      aTag.onclick = function() {
        addToHistory("getChecklistFromInternalLink", [aTag.dataset.url])
        getChecklistFromInternalLink(aTag.dataset.url);}
    }
  });
}




let navigationHistory = []; // Array to store navigation history
let currentIndex = -1; // Index pointer for the current position in history
window.getChecklistFromInternalLink = getChecklistFromInternalLink;
window.showMenu = showMenu;
window.viewHomePage = viewHomePage;

window.onpopstate = function(event) {
  resetSearchList()
  console.log(event)
  //if(history.state){
    //console.log(history.state[currentIndex])
    //let func = window[history.state[currentIndex].funcName];
    //console.log(window)
    //console.log(func);
    //func.apply(null, history.state[currentIndex].params)
    //}
 // func.apply(null, history.state[currentIndex].params)
  if (event.state) {
    console.log("Step2")
    let currentStateIndex = event.state.length-1
    let func = window[event.state[currentStateIndex].funcName];
    console.log(func)
    if (typeof func === 'function') {
        console.log("Step3")
          func.apply(null, event.state[currentStateIndex].params);
      }
  }
};

function addToHistory(funcName, params) {
  console.log("AddedToHistory")

  let historyState = { funcName: funcName, params: params };
  navigationHistory.push(historyState);
  //history.pushState(historyState, '');
  history.pushState(navigationHistory, '');
  currentIndex++;
  console.log(navigationHistory)
}


function navigateBackward() {
    if (currentIndex > 0) {
        currentIndex--;
        let historyItem = navigationHistory[currentIndex];
        historyItem.func.apply(null, historyItem.params);
    }
}

function navigateForward() {
    if (currentIndex < navigationHistory.length - 1) {
        currentIndex++;
        let historyItem = navigationHistory[currentIndex];
        historyItem.func.apply(null, historyItem.params);
    }
}



function updateList(searchTerm) {
  let filteredChecklists = []
  if(searchTerm.length == 1){
    filteredChecklists = allChecklists.filter(checklist =>
      checklist.toLowerCase().startsWith(searchTerm.toLowerCase())
    )
  }
  else{
    filteredChecklists = allChecklists.filter(checklist =>
        checklist.toLowerCase().includes(searchTerm.toLowerCase()) && searchTerm.length >= 2
    )
  }
  filteredChecklists.sort()
  let checklistResults = document.getElementById('checklistResults');
  checklistResults.innerHTML = ''; // Clear previous results

  filteredChecklists.forEach(checklist => {
      let listItem = document.createElement('li');
      listItem.textContent = checklist;
      listItem.className = "checklist-menu-item"
      listItem.style.margin = "24px"
      listItem.addEventListener('click', function() {
          getChecklistFromInternalLink(checklist);
          window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth' // Optional: Adds smooth scrolling effect
          });
      });
      checklistResults.appendChild(listItem);
  });
}

function resetSearchList(){
  let checklistResults = document.getElementById('checklistResults');
  let searchbar = document.getElementById('searchBar');
  searchbar.value = "";
  checklistResults.innerHTML = ''; // Clear previous results
}





let allChecklists = []

function getAllChecklists() {
  return new Promise((resolve, reject) => {
      let menus = [problem, ingrepp, diagnoses, fakta];
      let promises = [];

      for (let i = 0; i < menus.length; i++) {
          let file = checklistFolders.checklists + menus[i] + index;
          
          // Assuming createXMLHttpRequest returns a promise
          let promise = fetch(file)
              .then(response => {
                  if (!response.ok) {
                      throw new Error('Network response was not ok');
                  }
                  return response.text();
              })
              .then(data => {
                  // Process the data here
                  //console.log(`Checklist ${menus[i]}:`, data);
                  //allChecklists.push(data.split("\n"))
                  allChecklists = allChecklists.concat(data.split("\n"))
                  allChecklists = [...new Set(allChecklists.filter(str => !str.includes("ChapterTitle") && !str.includes("---") && str !== ''))];
                  return data; // Return data if needed
              })
              .catch(error => {
                  console.error('There was a problem with the fetch operation:', error);
                  throw error; // Propagate the error
              });

          promises.push(promise);
      }

      Promise.all(promises)
          .then(() => {
              resolve(); // Resolve the outer promise once all requests are completed
              console.log("Promises fulfilled");
          })
          .catch((error) => {
              reject(error); // Reject the outer promise if any request fails
          });
  });
}


function createModal() {
  // Create modal container
  const modal = document.createElement('div');
  modal.classList.add('modal');
  document.body.appendChild(modal);

  // Create modal content
  const modalContent = document.createElement('div');
  modalContent.classList.add('modal-content');
  modal.appendChild(modalContent);

  // Create close button
  const closeBtn = document.createElement('span');
  closeBtn.classList.add('close');
  closeBtn.innerHTML = '&times;';
  modalContent.appendChild(closeBtn);

  // Create form
  const form = document.createElement('form');
  form.id = 'popupForm';
  modalContent.appendChild(form);

  // Form elements
  const heading = document.createElement('h2');
  heading.textContent = 'Fyll i till forskningsprojektet';
  form.appendChild(heading);

  const nameLabel = document.createElement('label');
  nameLabel.setAttribute('for', 'name');
  nameLabel.textContent = 'RSID:';
  form.appendChild(nameLabel);

  const nameInput = document.createElement('input');
  nameInput.type = 'text';
  nameInput.id = 'name';
  nameInput.name = 'name';
  nameInput.required = true;
  form.appendChild(nameInput);

  // Create a div for displaying the error message
  const errorDiv = document.createElement('div');
  errorDiv.style.color = 'red';
  form.appendChild(errorDiv);

  form.appendChild(document.createElement('br'));
  form.appendChild(document.createElement('br'));

  const levelLabel = document.createElement('label');
  levelLabel.setAttribute('for', 'level');
  levelLabel.textContent = 'Läkare Nivå:';
  form.appendChild(levelLabel);

  const selectInput = document.createElement('select');
  selectInput.id = 'level';
  selectInput.name = 'level';
  form.appendChild(selectInput);
      

  const levels = ['junior', 'st', 'specialist'];

  levels.forEach(level => {
    const option = document.createElement('option');
    option.value = level;
    option.textContent = level.charAt(0).toUpperCase() + level.slice(1);
    selectInput.appendChild(option);
  });

  form.appendChild(document.createElement('br'));
  form.appendChild(document.createElement('br'));

  const submitInput = document.createElement('input');
  submitInput.type = 'submit';
  submitInput.value = 'Submit';
  form.appendChild(submitInput);
  modal.style.display = 'block';

  // Event listeners
  /*
  const openBtn = document.getElementById('openModal');
  openBtn.addEventListener('click', function() {
    
  });
  
  closeBtn.addEventListener('click', function() {
    modal.style.display = 'none';
  });
  */

  window.addEventListener('click', function(event) {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  });

  form.addEventListener('submit', function(event) {
    event.preventDefault();
    if(!validateInput(nameInput.value.trim())){
      errorDiv.textContent = 'Fyll i fullständigt RSID';
    }
    else{
      session.setUserRSID = event.target.name.value.toString()
      session.setPhysicianLevel = event.target.level.value.toString()
      errorDiv.textContent = ''; // Clear error message if validation passes
      modal.style.display = 'none';
    }
  });
}

// Function to validate the input value as exactly six numbers
function validateInput(inputValue) {
  const regex = /^\d{6}$/; // Regular expression for exactly 6 digits

  if (!regex.test(inputValue)) {
    return false; // Validation fails
  } else {
    return true; // Validation passes
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
        this.phycisianLevel = "";
        this.checklist = "";
        this.events = [];
    }
    set setUserRSID(userRSID){
        this.userRSID = userRSID;
    }
    set setPhysicianLevel(level){
        this.phycisianLevel = level;
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
            this.events.push([this.getCurrentTime(), "__" + this.userRSID, "__" + this.checklist, "__" + this.phycisianLevel]);
        }
        if (event.target.nodeName == "INPUT") {
            this.events.push([this.getCurrentTime(), this.userRSID, this.checklist, event.target.outerText, event.target.value]);
        }
        else this.events.push([this.getCurrentTime(), this.userRSID, this.checklist, event.target.outerText, 9]);
        this.removeCommas();
    }

    removeCommas() {
        // Assuming this.events is an array containing string elements with commas

        for (let i = 0; i < this.events.length; i++) {
            for (let j = 0; j < this.events[i].length; j++){
                if (typeof this.events[i][j] == 'string') {
                    this.events[i][j] = this.events[i][j].replace(",", '_'); // Remove commas using regex
                    this.events[i][j] = this.events[i][j].replace("\n", ''); // Remove commas using regex
                }
            }
        }
    }


    /**
    * This function sends a POST request to the server, with attached event data.
    @returns {Integer} - returns the server response. 200 means OK, everything worked out.
    */
    async saveChoices() {
        var response = await fetch('/upload', { method: "POST", body: JSON.stringify({ array: this.events }) });
        console.log(JSON.stringify({ array: this.events }))
        console.log("data sent");
        console.log(response)
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
  /**
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
  */

  createCircle(color, index, number) {
    // Create the container for the circle
    let container = document.createElement("label");
    container.className = "circle-container-" + color;

    // Create the radio button
    let radio = document.createElement("input");
    radio.type = "radio";
    radio.name = "radioButton" + index;
    radio.value = number;
    //radio.style.display = "none";

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

      container.appendChild(this.createCircle("green", index, 0));
      container.appendChild(this.createCircle("yellow", index, 1));
      container.appendChild(this.createCircle("red", index, 2));
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

    let li = document.createElement("div");

    li.id = "list_field_" + index;
    li.style.display = "flex";
    li.style.flexDirection = "row";
    li.className = "list-group-item list-group-item-action checklist-item";
    //li.href = "#";
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
