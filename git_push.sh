#!/bin/sh
echo -e "Preparing push to git\n"

#read -p 'Write your commit message here' msg

msg=''

while [[ $msg == '' ]]
do
  read -e -p 'Write your commit message here: ' msg
if [[ $msg != '' ]]; then
    echo -e "adding files to commit. This might take a while..\n"
    git add --all
    git commit -m "$msg"

    echo -e "\n"
    read -p 'Do you wish to push to remote? Type Y/N: ' varname
    if [ $varname != 'Y' ] && [ $varname != 'y' ]; then
      echo -e '\nDid not push to remote'
      $SHELL
    else
      echo -e '\nPushing to remote'
      git push origin master


      $SHELL
    fi

  else
    echo -e 'Commit message cannot be empty.\n'
fi

done
