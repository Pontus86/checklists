/**
 *@module Session
 */
class Session {

    constructor() {
        this.userRSID = "";
        this.patientID = "";
        this.physicianLevel = "";
        this.checklist = "";
        this.events = [];
        this.checklistUse = false;
        this.do_confirm = "";
        this.likert_scale = "";
        this.no_use = "";
        this.discuss = "No";
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
        console.log(event);
        if (this.events.length == 0) {
            this.events.push([this.getCurrentTime(), "__" + this.userRSID," " , "__" + this.checklist, "", "__" + this.physicianLevel, "", "", "", "", "", "", ""]);
        }
        if (event.length == 1 && event[0].includes("I/")) {
            console.log("Event contains 'I/'");
            let sessionEvent = [this.getCurrentTime(), this.userRSID, this.patientID, this.checklist, "Image", "", "", "", "", "", "", "", ""];
            this.events.push(sessionEvent);
            this.removeCommas();
            return;
        }

        if (event == "logout") {
            console.log("User logged out");
            let sessionEvent = [this.getCurrentTime(), this.userRSID, this.patientID, this.checklist, "Logout", "", "", this.physicianLevel, this.checklistUse,
                this.do_confirm, this.likert_scale, this.no_use, this.discuss]
            this.events.push(sessionEvent);
            this.removeCommas();
            return;
        }

        if (event.target.nodeName == "INPUT") {
            console.log(event)
            console.log(event.target.parentNode.parentNode.parentNode.outerText)
            let sessionEvent = [this.getCurrentTime(), this.userRSID, this.patientID, this.checklist, "Checkbox", event.target.parentNode.parentNode.parentNode.outerText, event.target.value, "", "", "", "", "", ""];
        
            this.events.push(sessionEvent);
        }
        else this.events.push([this.getCurrentTime(), this.userRSID, this.patientID, this.checklist, "Read", event.target.outerText, 9, "", "", "", "", "", ""]);
        this.removeCommas();
        console.log("Sesstion events", this.events);
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
        return response;
    }

/**
* This function gets the current time, creates a string of date and time of day, and returns that string.
@returns {String} - Returns a string containing the current time in the format YYYY-MM-DD_HH-MM-SS.
*/
getCurrentTime() {
  var today = new Date();
  var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
  var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  var dateTime = date + ' ' + time;

  return dateTime;
}
}

module.exports = Session