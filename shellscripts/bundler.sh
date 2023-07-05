#!/bin/sh
echo "Bundling javascript files"
browserify ./../express/index.js -o ./../express/bundle.js
echo "Done."
