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

  chapterTitle(inputString) {
    // Regular expression to find the pattern: Green/<SomeText>
    let regex = /ChapterTitle\/<([^>]+)>/g;

    // Replace the pattern with the styled text
    let replacedString = inputString.replace(regex, '<span style="color: green;">$1</span>');
  
    return replacedString;
  }

  applyStyling(inputString){
    let returnString = this.replaceNewLine(this.replaceExternalLinks(this.makeTextRed(this.makeTextGreen(this.chapterTitle(inputString)))));
    return returnString
  }
}

module.exports = Util