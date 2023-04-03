/**
*@module rsa
*/

var p = 0;
var q = 0;
var n = 0;
var phin = 0;
var e = 0;
var d = 0;

function RSA(firstPrime, secondPrime){
  p = firstPrime;
  q = secondPrime;
  n = p * q;
  phin = phiN(p, q);
  e = calculateE(p, q);  //an integer, not a factor of n, 1 < e < sigma(n)
  d = calculateD(p, q);
  console.log("d is: " + d);
  console.log("n is: " + n);
  console.log("phin is: " + phin);
  console.log("e is: " + e);
  console.log("Done");
}
function greatestCommonDivisor(numberA, numberB){
  var a = numberA;
  var h = numberB;
  var temporary;
  while(true){
    temporary = a % h;
    if(temporary == 0){
      return h;
    }
    a = h;
    h = temporary;
  }
}

function phiN(p, q){
  //Total number of numbers that are not factors of n.
  return ((p-1) * (q-1));
}

function calculateE(p, q){
  var eTemp = 2;
  while(eTemp < phin){
    if(greatestCommonDivisor(eTemp, phin) == 1){
      break;
    }
    else{
      eTemp++;
    }
  }
  return eTemp;
}

function calculateD(p, q){
  var k = 2;
  return ((k * phin) + 1)/ e;
}

function encrypt(message){
  var unicodeArray = textToUnicode(message);
  var encryptedArray = [];
  for (var i = 0; i < unicodeArray.length; i ++){
    encryptedArray.push(Math.pow(unicodeArray[i], e) % n);
    console.log((Math.pow(unicodeArray[i], e)) % n);
  }
  console.log(encryptedArray);

  return encryptedArray;
  //return pow(message, e) % n;
}

function decrypt(message){
  var unicodeArray = message;
  console.log(unicodeArray);
  var decryptedArray = [];
  for (var i = 0; i < unicodeArray.length; i ++){
    decryptedArray.push(Math.pow(unicodeArray[i], d) % n);

    console.log(Math.pow(unicodeArray[i], d));
  }
  console.log(decryptedArray);
  return unicodeToText(decryptedArray);
  //return Math.pow(message, d) % n;
}

function textToUnicode(message){
  var unicodeArray = [];
  for(var i = 0; i < message.length; i++){
    unicodeArray.push(message.charCodeAt(i));
  }
  return unicodeArray;
}

function unicodeToText(unicodeArray){
  var messageArray = [];
  for(var i = 0; i < unicodeArray.length; i++){
    messageArray.push(String.fromCharCode(unicodeArray[i]));
  }
  return messageArray.join("");
}
