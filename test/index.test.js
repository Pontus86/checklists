const index = require('./../express/index');

//const splitSections = require('./../express/index.js/splitSections');
//const splitItems = require('./../express/index');

/**
* Optimistic test cases, assuming modules work as intended.
*/
test('cuts at the text specified', () => {
  expect(index.splitSections("tralaTitle/Here is titleText/This is the textTitle/Here is second title"))
  .toStrictEqual(["Here is titleText/This is the text","Here is second title"]);
});

test('cuts at the text specified', () => {
  expect(index.splitItems("Here is titleText/This is the text"))
  .toStrictEqual(["Here is title", "This is the text"]);
});

/**
test(' sends data to the server', () => {
  expect(index.saveChoices(["hello", 1, true])).toStrictEqual(200);
});
*/
