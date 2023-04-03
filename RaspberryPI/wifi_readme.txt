The wifi can be updated by changing the wpa_supplicant.conf file 

Comment out by using the # symbol.

use sudo cp wpa_supplicant.conf /boot 
to copy the updated file to the boot folder.
Then restart the pi to update the file in the /etc folder.
This updates the settings of the Pi. 

Then use sudo reboot to restart the pi. 

use  iwconfig to check the current wifi network
