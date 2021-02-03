These are instructions for using this node server.


To setup Node.js on your computer
1. Download the latest node.js installer from this page:
    nodejs.org/en/download/
2. Run the installer


To start a server for testing
1. Download the repository
2. Open the node command prompt
3. Go to your project folder
    ex: cd C:/Users/Pontus/Documents/Medicin/Forskning/Checklistor/
4. Start the server by running the server.js file:
    node server.js
5. Find the computer IP-address by running:
    windows:        ipconfig
    mac:            curl ifconfig.me
6. IP will show as ex:
    windows:  IPv4 Address. . . . . . . . . . . : 192.168.10.145
    mac:      192.168.10.145.....
7. Open the web-browser and go to:
    https://your-ip-adress:8443

    "ex: https://192.168.10.145:8443"



To bundle code for use in the browser:
1. Open the node command prompt
2. install browserify:
    npm install -g browserify
3. Navigate to your project folder
4. Make sure the uniq module is installed, if not, run:
    npm install uniq
5. bundle all required .js files into one bundle.js starting with index.js to be referenced in the html page.
    browserify index.js -o bundle.js



To create a jsdoc page:
1. Open the node command prompt
2. Make sure jsdoc is installed on your computer. If not, run:
    npm install - g jsdoc
3. Go to the project folder
    ex: cd C:\Users\Pontus\Documents\Medicin\Forskning\Checklistor\express
4. Run jsdoc yourfile.js
5. A folder called /out is created. in this folder, index.html takes you to the jsdoc page.
6. To use jsdoc with config file use the command below:
    jsdoc -c jsdoc-conf.json


To run tests:
1. Open the node command prompt
2. Navigate to your project folder
2. Make sure the testing framework jest is installed, if not, run:
    npm install --save-dev jest
3. Run:
    npm run test
