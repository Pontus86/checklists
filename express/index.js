/**
 *@module index
 */

let Session = require("./models/Session.js");
let Util = require("./Util.js");
let ChecklistItems = require("./views/ChecklistItems.js")
let Modals = require("./modals.js");


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
const modals = new Modals();
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
  //createModal()
  // Usage
  getAllChecklists()
  .then(() => {
      console.log('All checklists fetched successfully');
  })
  .catch((error) => {
      console.error('Error fetching checklists:', error);
  });


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

  modals.showLoginModal(session);
  
  ['mousemove', 'keydown', 'click', 'scroll'].forEach(evt => {
    window.addEventListener(evt, () => modals.resetInactivityTimer(session));
  });
  
  modals.resetInactivityTimer(session); // starta direkt

  document.getElementById('logoutButton').addEventListener('click', () => {
    modals.showLogoutModal(session, (data) => {
      console.log('Logout-formulär skickades:', data);
      // Här kan du t.ex. skicka data till backend
      

    });
  });

  

  document.getElementById('checkbox_explainer').addEventListener('click', () => {
    console.log("Checkbox explainer clicked");
    modals.showCheckboxExplainerModal();
  });
  

  // Attempt to maximize the window on run (only works in browser environments)
    try {
      window.moveTo(0, 0);
      window.resizeTo(screen.availWidth, screen.availHeight);
    } catch (error) {
      console.warn("Window resizing is not supported in this environment:", error);
    }

    
    
  

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

async function createXMLHttpRequest2(file, callbackFunction, ...callbackArgs){

  const DONE = 4;
  const STATUS_OK = 200;
  const STATUS_0 = 0;

  xmlHttpRequest = new XMLHttpRequest();
  xmlHttpRequest.onreadystatechange = function () {
    if (xmlHttpRequest.readyState === DONE && xmlHttpRequest.status === STATUS_OK) {
      console.log(xmlHttpRequest.responseText)
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
async function createXMLHttpRequest(file, callbackFunction, ...callbackArgs) {
  try {
    const response = await fetch(file);
    if (response.ok) {
      const text = await response.text();
      const fakeXMLHttpRequest = {
        responseText: text,
        readyState: 4,
        status: response.status
      };
      callbackFunction(fakeXMLHttpRequest, ...callbackArgs);
    } else {
      console.log("Status: " + response.status);
      // TODO: Implement error logging or handling here.
    }
  } catch (error) {
    console.log("Error: " + error);
    // TODO: Implement error logging or handling here.
  }
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
    console.log(arrayOfItems.toString())
    ifImage(arrayOfItems);
  }
  else {
    ifNoImage(arrayOfItems);
  }
  console.log("Done creating List items");
}


function ifImage(arrayOfItems){
  parentDiv = document.getElementById("ifImage")
  parentDiv.style.display = 'flex';
  parentDiv.style.justifyContent = 'center';
  parentDiv.style.alignItems = 'center';
  showElementAndChildren(parentDiv)
  parentDiv.style.display = "block";
  image_source = arrayOfItems.toString()
  image_source = image_source.substring(image_source.search("I/") + 2)
  image_path = "./checklists/" + image_source
  let elem = checklistItems.createImage(image_path);
  elem.style.visibility = "hidden" ; // Make the image visible
  elem.style.display = "none";
  parentDiv.appendChild(elem);

  // Show loading icon
  let loadingIcon = document.createElement("img");
  loadingIcon.src = "./images/loading.gif";
  loadingIcon.className = "loading-icon";
  loadingIcon.style.height = "50px";
  loadingIcon.style.width = "50px";
  loadingIcon.style.marginTop = "200px"; // Center the loading icon
  loadingIcon.style.marginBottom = "200px"; // Center the loading icon
  loadingIcon.style.marginLeft = "400px"; // Center the loading icon
  parentDiv.appendChild(loadingIcon);

  elem.onload =  function(){
    // Hide loading icon
    parentDiv.removeChild(loadingIcon);
    elem.style.display = "block";
    elem.style.visibility = 'visible'; // Make the image visible

    session.addEvent(arrayOfItems);
    session.saveChoices(events);
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
    // const explanation = document.createElement('p');

    // const greenText = "Utfört innan checklistan öppnats.";
    // const yellowText = "Utfört tack vare checklistan.";
    // const redText = "Inte indicerat.";

    // explanation.innerHTML = '<span style=" background-color: #89bd9e; color: white; padding: 2px 5px; border-radius: 3px;">Grön checkbox:</span> ' + greenText + '<br>' +
    //   '<span style="background-color: #f3d250; color: white; padding: 2px 5px; border-radius: 3px;">Gul checkbox:</span> ' + yellowText + '<br>' +
    //   '<span style="background-color: #ea907a; color: white; padding: 2px 5px; border-radius: 3px;">Röd checkbox:</span> ' + redText;
    // explanation.style.textAlign = 'left';
    // explanation.style.margin = '20px';
    // ul.appendChild(explanation);
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

  // let hoverTimeout;
  // document.getElementById('checkbox_' + i).onmouseover = function () {
  //   hoverTimeout = setTimeout(() => {
  //     modals.showCheckboxExplainerModal();
  //   }, 3000); // 2 seconds
  // };

  // document.getElementById('checkbox_' + i).onmouseout = function () {
  //   clearTimeout(hoverTimeout);
  // };
  
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

  // Create a label and select input for physician level
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


  const patientIDLabel = document.createElement('label');
  patientIDLabel.setAttribute('for', 'name');
  patientIDLabel.textContent = 'PatientID:';
  form.appendChild(patientIDLabel);

  const patientIDLabelInput = document.createElement('input');
  patientIDLabelInput.type = 'text';
  patientIDLabelInput.id = 'patientID';
  patientIDLabelInput.name = 'patientID';
  patientIDLabelInput.required = true;
  form.appendChild(patientIDLabelInput);



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


