class sessionController {

    constructor(sessionModel){
        this.sessionModel = sessionModel
    }
/**
    * This function takes a generated event and adds it to the events-array.
    * If this array is empty, a header is first created, containing the current time, current user and current checklist.
    @param {String} event - takes an event as input. This event contains the item the user has clicked.
    */
    addEvent(event) {
        if (this.events.length == 0) {
            this.events.push([this.currentTime(), "__" + this.userRSID, "__" + this.checklist]);
        }
        if (event.target.value == "checkbox") {
            var checked = 0;
            if (event.target.checked) checked = 1;
            this.events.push([this.currentTime(), this.userRSID, this.checklist, event.target.id, checked]);
        }
        else this.events.push([this.currentTime(), this.userRSID, this.checklist, event.target.text, 9]);

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
currentTime() {
  var today = new Date();
  var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
  var time = today.getHours() + "-" + today.getMinutes() + "-" + today.getSeconds();
  var dateTime = date + '_' + time;

  return dateTime;
}
}

module.exports = sessionController