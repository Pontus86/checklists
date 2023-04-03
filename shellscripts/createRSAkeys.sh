#!/bin/sh

# This script creates a private and public RSA key and moves the keys 
# to outside the project folder.

# The idea is that the device receiving data from users will have access to
# the public key and encrypt all data with this key. 
# The private key will be stored in a safe location.

echo "creating RSA keys"

openssl genrsa -out private_key.pem 4096
openssl rsa -pubout -in private_key.pem -out public_key.pem
openssl req -newkey rsa:4096 -new -nodes -x509 -days 3650 -keyout serverkey.pem -out servercert.pem

mkdir ../../checklist-keys
mv private_key.pem ../../checklist-keys
mv public_key.pem ../../checklist-keys
mv serverkey.pem ../../checklist-keys
mv servercert.pem ../../checklist-keys

echo "Done. Keys are located in a newly created folder called checklist-keys, 
outside the project folder."