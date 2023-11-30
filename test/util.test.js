const Util = require('./../express/Util');
let util = new Util();

/**
* Optimistic test cases, assuming modules work as intended.
*/
test('cuts at the text specified', () => {
  expect(util.splitSections("tralaTitle/Here is titleText/This is the textTitle/Here is second title"))
    .toStrictEqual(["Here is titleText/This is the text", "Here is second title"]);
});

test('cuts at the text specified', () => {
  expect(util.splitItems("Here is titleText/This is the text"))
    .toStrictEqual(["Here is title", "This is the text"]);
});
test("replaces \n with <br>", () => {
  expect(util.replaceNewLine("Testing\
    "))
    .toStrictEqual("Testing\
    ");
})

/**
 * Other test cases
 */

test("Inserting '' instead of string returns []", () => {
  expect(util.splitSections(""))
    .toStrictEqual([]);

});
test("Inserting other primitives or objects instead of string gives type error", () => {
  expect(() => { util.splitSections(null) })
    .toThrow(TypeError);
  expect(() => { util.splitSections(1) })
    .toThrow(TypeError);
  expect(() => { util.splitSections([]) })
    .toThrow(TypeError);
  expect(() => { util.splitSections({}) })
    .toThrow(TypeError);
});