You need to move the mybutton.service file to this folder, 
and change the path to your script in the file:

/etc/systemd/system/


Run this in terminal to enable autorun of the service, and then to run it immediately
sudo systemctl enable mybutton.service
sudo systemctl start mybutton.service
