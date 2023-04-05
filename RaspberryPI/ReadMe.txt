//Installing node and git on a new raspberry pi arm v61


The following will tell you the version of arm on your device:
    uname -m

Raspberry pi zero has arm v61. The latest version of node for this version is 10.
Install node using the following:
    wget https://nodejs.org/download/release/v10.0.0/node-v10.0.0-linux-armv6l.tar.gz
    tar -xzf node-v10.0.0-linux-armv6l.tar.gz
    cd node-v10.0.0-linux-armv6l/
    sudo cp -R * /usr/local/

Update:
    To use Promises correctly for v61, you need a later version than v10. 
    There is an experimental node version v12. Use the following:
        wget -O - https://raw.githubusercontent.com/sdesalas/node-pi-zero/master/install-node-v12.21.0.sh | bash


To install git run the following:
    sudo apt update
    sudo apt install git




//Enable autostart of button sensing script

You need to move the mybutton.service file to this folder, 
and change the path to your script in the file:

    /etc/systemd/system/

Run this in terminal to enable autorun of the service, and then to run it immediately
    sudo systemctl enable mybutton.service
    sudo systemctl start mybutton.service



//Copy local pem files to the raspberry pi
to get your local folder use:
    pwd
then copy all files in the keys folder using:
    scp -r local/checklist-keys pi@raspberrypi.local:/home/pi/yourfolder/