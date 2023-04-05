#!/bin/bash

# Get a list of all binary files in the current folder
binaries=$(ls -1 | grep -E '\.bin$')

# Loop through each binary file and run node RSA.js
for binary in $binaries
do
  echo "Running RSAdecrypt.js on $binary ..."
  node RSAdecrypt.js $binary
done