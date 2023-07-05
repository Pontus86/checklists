/**
*@module RSAdecrypt.js
*/

const crypto = require('crypto');
const fs = require('fs').promises;

//This delimiter ensures that there are no incorrect datasplits. 
//Incorrect splits were introduced when only one \n was used.
//This led to a failure to decrypt messages.
const DELIMITER = '\n\n\n\n\n\n\n\n\n\n';

async function decryptData(privateKey, fileName) {
    try {
      const encryptedDataFile = await fs.readFile(fileName, { encoding: 'binary' });
      const encryptedDataString = encryptedDataFile.toString('binary');
      const encryptedDataArray = encryptedDataString.split(DELIMITER);
      //console.log(encryptedDataString);
      //console.log(encryptedDataArray);
  
      const decryptedData = encryptedDataArray
        .filter(data => !!data) // Filter out empty strings
        .map(data => crypto.privateDecrypt(privateKey, Buffer.from(data, 'binary')))
        .join('\n');
  
      return decryptedData.toString('utf8');
    } catch (err) {
      throw new Error(`Error reading encrypted data from file: ${err}`);
    }
  }

  async function loadPrivateKey() {
    // Load the private key
    const privateKeyPem = await fs.readFile('../../../checklist-keys/private_key.pem', 'utf8');
    const privateKey = crypto.createPrivateKey(privateKeyPem);
  
    return privateKey;
  }

  async function saveToCSV(fileNameBinary, decryptedData, delimiter="\n") {
    // Extract the name of the binary file without the extension
    const baseName = fileNameBinary.substring(0, fileNameBinary.lastIndexOf('.'));
    // Create a new CSV filename by appending .csv to the base name
    const subfolder = "./decrypted/"
    const csvFileName = subfolder + baseName + '.csv';

    // Split the decrypted data by commas and join it with a new line character
    const decryptedDataCSV = decryptedData.split(delimiter).join('\n');

    // Write the decrypted data to a new CSV file
    await fs.writeFile(csvFileName, decryptedDataCSV);

    console.log(`Decrypted data saved to ${csvFileName}`);
  }

  async function main(fileName) {
    try {
      const privateKey = await loadPrivateKey();
      const decryptedData = await decryptData(privateKey, fileName);
      await saveToCSV(fileName, decryptedData);
    } catch (err) {
      console.error(err);
    }
  }

// Get the filename from the command line arguments
const args = process.argv.slice(2);
const fileName = args[0];

main(fileName);