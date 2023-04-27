#!/bin/bash

# SSH into first computer and cd to a specific folder
# ssh pontus@puck.thep.lu.se "ssh pontus@orwell && conda activate mim && 
# cd Documents/kod/ && jupyter-lab --no-browser --port 1238 && bash"

#ssh pi@raspberrypi.local "cd Documents/checklists && jupyter notebook --no-browser --port=1234 & disown && bash"
#osascript -e 'tell application "Terminal" to do script "ssh pi@raspberrypi.local -NL 1234:127.0.0.1:1234'
# Open new terminal and SSH into second computer
# osascript -e 'tell application "Terminal" to do script "ssh user@second-computer"'

# Open new terminal and SSH into third computer
# osascript -e 'tell application "Terminal" to do script "ssh user@third-computer"'

#read -p "Enter the port number: " port
#ssh -L $port:localhost:$port pi@raspberrypi.local "cd Documents/checklists && jupyter notebook --no-browser --port=$port & disown && bash"
#"ps aux | grep jupyter | awk '{print $2}' | xargs kill && 

#read -p "Enter the port number: " port
#ssh -L $port:localhost:$port pi@raspberrypi.local "cd Documents/checklists && jupyter notebook --no-browser --port=$port & disown | grep 'http://localhost:' | awk '{print \$NF}' | xargs -I{} echo 'Jupyter Notebook URL: http://{}' && bash"
read -p "Enter the port number: " port
#ssh -L $port:localhost:$port pi@raspberrypi.local "ps aux | grep -v grep | grep jupyter | awk '{print \$2}' | xargs kill && cd Documents/checklists && jupyter notebook --no-browser --port=$port & disown && sleep 1 && jupyter notebook list | grep 'http://localhost:' | awk '{print $1}' | xargs -I{} echo 'Jupyter Notebook URL: {}' && bash"
ssh -L $port:localhost:$port pi@85.228.139.138 -p 60022 "ps aux | grep -v grep | grep jupyter | awk '{print \$2}' | xargs kill && cd Documents/checklists && jupyter notebook --no-browser --port=$port & disown && sleep 1 && jupyter notebook list | grep 'http://localhost:' | awk '{print $1}' | xargs -I{} echo 'Jupyter Notebook URL: {}' && bash"
