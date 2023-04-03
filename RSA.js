/**
*@module RSA.js
*/

const crypto = require('crypto');
const fs = require('fs').promises;

//This delimiter ensures that there are no incorrect datasplits. 
//Incorrect splits were introduced when only one \n was used.
//This led to a failure to decrypt messages.
const DELIMITER = '\n\n\n\n\n\n\n\n\n\n';

async function encryptData(dataToEncrypt, publicKey, fileName, append=true)  {
  var DELIM = '\n\n\n\n\n\n\n\n\n\n';
  const encryptedData = crypto.publicEncrypt(publicKey, Buffer.from(dataToEncrypt));
  var write = 'a';
  if(append == false){
    var write = 'w';
  }
  try {
    const encryptedDataFile = await fs.open(fileName, write);
    await encryptedDataFile.write(encryptedData);
    await encryptedDataFile.write(DELIM);
    await encryptedDataFile.close();
    
    return encryptedData;
  } catch (err) {
    throw new Error(`Error writing encrypted data to file: ${err}`);
  }
}

async function decryptData(privateKey, fileName) {
  var DELIM = '\n\n\n\n\n\n\n\n\n\n';
  try {
    const encryptedDataFile = await fs.readFile(fileName, { encoding: 'binary' });
    const encryptedDataString = encryptedDataFile.toString('binary');
    const encryptedDataArray = encryptedDataString.split(DELIM);
    //console.log(encryptedDataString);
    //console.log(encryptedDataArray);

    const decryptedData = encryptedDataArray
      .filter(data => !!data) // Filter out empty strings
      .map(data => crypto.privateDecrypt(privateKey, Buffer.from(data, 'binary')))
      .join('');

    return decryptedData.toString('utf8');
  } catch (err) {
    throw new Error(`Error reading encrypted data from file: ${err}`);
  }
}

async function loadPublicKey() {
  // Load the public key
  const publicKeyPem = await fs.readFile('../checklist-keys/public_key.pem', 'utf8');
  const publicKey = crypto.createPublicKey(publicKeyPem);

  return publicKey;
}

async function loadPrivateKey() {
  // Load the private key
  const privateKeyPem = await fs.readFile('../checklist-keys/private_key.pem', 'utf8');
  const privateKey = crypto.createPrivateKey(privateKeyPem);

  return privateKey;
}


async function main() {
  var fileName = "encryptedData.bin"

  //var fileName = "2023-3-30_22-17-39,__177575,__hypoxemi.bin"
  try {
    // Load the private key
    const privateKeyPem = await fs.readFile('../checklist-keys/private_key.pem', 'utf8');
    const privateKey = crypto.createPrivateKey(privateKeyPem);

    // Load the public key
    const publicKeyPem = await fs.readFile('../checklist-keys/public_key.pem', 'utf8');
    const publicKey = crypto.createPublicKey(publicKeyPem);

    // Data to encrypt
    const dataToEncrypt = 'This is a secret message';
    
    // Encrypt the data with the public key
    const encryptedData = await encryptData(dataToEncrypt, publicKey, fileName);
    await console.log('Encrypted data:', encryptedData.toString('base64'));
    await console.log("");

    // Encrypt the data with the public key again
    await encryptData(dataToEncrypt, publicKey, fileName);
    
    // Decrypt the data with the private key
    const decryptedData = await decryptData(privateKey, fileName);
    await console.log('Decrypted data:', decryptedData);
  } catch (err) {
    console.error(err);
  }
}


//main();

module.exports = {
  encryptData: encryptData,
  loadPublicKey: loadPublicKey,
  loadPrivateKey: loadPrivateKey,
  decryptData: decryptData
};