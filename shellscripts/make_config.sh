#!/bin/sh
echo -e "Recreating config file\n"

name=''
token=''
while [[ $name == '' ]]
do
  read -e -p 'Write your username here: ' name
  read -e -p 'Insert your access token here: ' token
  
  
if [[ $name != '' ]]; then
    echo -e "Updating config file.\n"
	
	echo "[core]" > config
	echo "	repositoryformatversion = 0" >> config
	echo "	filemode = false" >> config
	echo "	bare = false" > config
	echo "	logallrefupdates = true" >> config
	echo "	symlinks = false" >> config
	echo "	ignorecase = true" >> config
	echo "[remote \"origin\"]" >> config
	echo "	url = https://$name:$token@github.com/Pontus86/checklists.git" >> config
	echo "	fetch = +refs/heads/*:refs/remotes/origin/*" >> config
	echo "[branch \"master\"]" >> config
	echo "	remote = origin" >> config
	echo "	merge = refs/heads/master" >> config
	mv config ./../.git
	
	
fi
$SHELL
done

