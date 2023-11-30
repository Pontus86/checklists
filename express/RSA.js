/**
*@module RSA.js
*/

const crypto = require('crypto');
const fs = require('fs').promises;


async function encryptData(dataToEncrypt, publicKey, fileName, append=true)  {

  //This delimiter ensures that there are no incorrect datasplits. 
  //Incorrect splits were introduced when only one \n was used.
  //This led to a failure to decrypt messages.
  let DELIM = '\n\n\n\n\n\n\n\n\n\n';

  const encryptedData = crypto.publicEncrypt(publicKey, Buffer.from(dataToEncrypt));
  let write = 'a';
  if(append == false){
    write = 'w';
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


async function loadPublicKey() {
  // Load the public key
  const publicKeyPem = await fs.readFile('./checklist-keys/public_key.pem', 'utf8');
  const publicKey = crypto.createPublicKey(publicKeyPem);

  return publicKey;
}


module.exports = {
  encryptData: encryptData,
  loadPublicKey: loadPublicKey,
};