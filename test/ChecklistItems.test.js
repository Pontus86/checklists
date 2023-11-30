const ChecklistItems = require("../express/views/ChecklistItems");

let checklistItems = new ChecklistItems();

//Checkbox tests
describe('CreateCheckbox tests', () => {
    it("sets checkbox ID correctly", () => {
        let checkbox = checklistItems.createCheckbox(4);
        expect(checkbox.id).toBe("checkbox_4");
    });

    it("must insert integer for checkbox creation", () => {
        const invalidIndices = [-1, 3.14, "string", null, undefined, [], {}, true]
        invalidIndices.forEach(index => {
            expect(() => checklistItems.createCheckbox(index)).toThrow(TypeError)
        })
    })
});

//LI tests
describe('createLI tests', () => {
    it("sets LI ID and content correctly", () => {

        let LI = checklistItems.createLI(["1", "2"], 42);
        expect(LI.id).toBe("list_field_42");
        expect(LI.innerText).toEqual("1");
        expect(LI.value).toEqual("2");
    })

    it('should create a list item with valid content and index', () => {
        const index = 42;
        const content = ['Item 1', 'Value 1'];
        const li = checklistItems.createLI(content, index);

        // Test the properties of the created list item
        expect(li.id).toBe(`list_field_${index}`);
        expect(li.className).toBe('list-group-item list-group-item-action checklist-item');
        expect(li.innerText).toBe(content[0]);
        expect(li.value).toBe(content[1]);
    });

    it('should throw a TypeError with invalid index', () => {
        // Test invalid indices here
        const invalidIndices = [-1, 3.14, 'string', null, undefined];

        invalidIndices.forEach(index => {
            expect(() => checklistItems.createLI(['Item 1', 'Value 1'], index)).toThrow(TypeError);
        });
    });

    it('should throw a TypeError with invalid content', () => {
        // Test invalid content here
        const invalidContents = [
            [123, 'string'], // Invalid: first element is not a string
            ['Item 1', true], // Invalid: second element is not a string
            'string', // Invalid: content is not an array
            [], // Invalid: content array is empty
        ];

        invalidContents.forEach(content => {
            expect(() => checklistItems.createLI(content, 0)).toThrow(TypeError);
        });
    });
});



//Image Tests
describe('createImage', () => {
    it('should create an image element with valid image_path', () => {
        const image_path = 'http://localhost/checklists/02_ingrepp/Coniotomi%20Exemple%20JPEG.jpg';
        const imageElement = checklistItems.createImage(image_path);

        // Test the properties of the created image element
        expect(imageElement.tagName).toBe('IMG');
        expect(imageElement.src).toBe(image_path);
        expect(imageElement.getAttribute('height')).toBe('768');
        expect(imageElement.getAttribute('width')).toBe('1024');
        expect(imageElement.getAttribute('alt')).toBe('Image not loaded');
    });

    it('should throw a TypeError with invalid image_path', () => {
        // Test invalid image_path here
        const invalidImagePaths = [
            123, // Invalid: not a string
            null, // Invalid: null value
            undefined, // Invalid: undefined value
        ];

        invalidImagePaths.forEach(image_path => {
            expect(() => checklistItems.createImage(image_path)).toThrow(TypeError);
        });
    });
});
