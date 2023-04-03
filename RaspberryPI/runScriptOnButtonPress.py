import RPi.GPIO as GPIO
import subprocess

GPIO.setmode(GPIO.BCM)
GPIO.setup(18, GPIO.IN, pull_up_down=GPIO.PUD_UP)

#Insert all button activations here
#Think git pull to get updates
#Reboot
#Start server
#show green light when server is running, and red light when it is not

#You need buttons for the rasppi that is the hotspot, and other buttons for 
#the one serving the website

while True:
    if GPIO.input(18) == GPIO.LOW:
        subprocess.run(["python3", "/path/to/your/script.py"])
