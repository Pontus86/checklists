const request = require('supertest');
const { setupExpressApp, getRSAKey} = require('../server'); // Assuming your server.js and test file are in the same directory




describe('Server Test', () => {
  let app;

  beforeAll(async () => {
    //TODO: Getting the RSA Key for testing in server.test.js. Could be refactored out by letting test function call RSA itself.
    const CHECKLIST_ENCRYPTION_PUBLIC_KEY = await getRSAKey(); // You can use a mock key for testing

    app = setupExpressApp(CHECKLIST_ENCRYPTION_PUBLIC_KEY);
  });

  test('should return "Uploaded" when sending a POST request to /upload', async () => {
    const response = await request(app).post('/upload').send({"array": ["test"]});
    //console.log(response);
    expect(response.status).toBe(200);
    expect(response.text).toBe('Uploaded');
  });

  test('should return index.html content when sending a GET request to /', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.type).toBe('text/html');
    // Add more specific checks for the content of the index.html file if needed.
  });

  // Add more test cases to cover other routes and scenarios as needed.

});
