#!/bin/sh
echo "Bundling javascript files"
browserify ./express/index.js -o ./express/bundle.js
echo "Done."

echo -e "\n\nUpdating documentation"

jsdoc -c jsdoc-conf.json
echo -e "Done. \nDocumentation can be found at docs/index.html"

echo -e "\n\nInitiating testing"

num=`jest --silent --json | grep -o '"numFailedTests":[^,]*' | grep -o ':[^,]*'`


if [ $num != ':0' ]; then
	echo -e '\n\nTests do not pass'
  read -p 'Do you still wish to proceed? Type Y/N: ' varname
  if [ $varname != 'Y' ] && [ $varname != 'y' ]; then
    echo 'aborting'
    $SHELL
  else
    echo 'starting server'
    node server.js
    $SHELL
  fi
else
  echo -e '\n\nAll tests passed, starting server'
  #node server.js
  #forever -o ../logs/out.log -e ../logs/err.log -w server.js
  pm2 start pm2-process.json --watch
  #authbind --deep pm2 start server.js --watch
  $SHELL
fi
