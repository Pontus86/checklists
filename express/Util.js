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