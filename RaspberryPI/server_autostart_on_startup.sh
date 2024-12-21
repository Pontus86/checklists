#!/bin/bash

# Logfile paths
LOGFILE="pm2_server_status.log"
ETH_LOGFILE="ethernet_status.log"
LED_GREEN=17  # GPIO pin number for the green LED
LED_RED=27    # GPIO pin number for the red LED

# Setup GPIO pins
python3 -c "import RPi.GPIO as GPIO; GPIO.setmode(GPIO.BCM); 
GPIO.setup([$LED_GREEN, $LED_RED], GPIO.OUT)"

# Function to set LED status
set_leds() {
    if [ "$1" = "GREEN" ]; then
        python3 -c "import RPi.GPIO as GPIO; GPIO.output($LED_GREEN, 
GPIO.HIGH); GPIO.output($LED_RED, GPIO.LOW)"
    else
        python3 -c "import RPi.GPIO as GPIO; GPIO.output($LED_GREEN, 
GPIO.LOW); GPIO.output($LED_RED, GPIO.HIGH)"
    fi
}

# Function to get the combined status of pm2 and the "server" application
get_combined_status() {
    # Check if pm2 process itself is running
    if ! pgrep -x "pm2" > /dev/null; then
        echo "PM2_DOWN"
    else
        # Check if the "server" application is listed in pm2
        if pm2 list | grep -q "\[online\].*server"; then
            echo "SERVER_UP"
        else
            echo "SERVER_DOWN"
        fi
    fi
}

# Function to check the Ethernet status
get_ethernet_status() {
    IP_ADDRESS="169.254.136.91"
    if ifconfig eth0 | grep -q "inet $IP_ADDRESS "; then
        echo "ETHERNET_UP"
    else
        echo "ETHERNET_DOWN"
    fi
}

# Initialize last status
LAST_STATUS="NONE"
LAST_ETH_STATUS="NONE"

# Infinite loop to check the status every 30 seconds
while true; do
    # Get the current status
    CURRENT_STATUS=$(get_combined_status)
    ETH_STATUS=$(get_ethernet_status)

    # Get the current time
    CURRENT_TIME=$(date '+%Y-%m-%d %H:%M:%S')

    # Compare the current status with the last status logged
    if [ "$CURRENT_STATUS" != "$LAST_STATUS" ]; then
        # Status has changed or is the first run, update the log
        echo "$CURRENT_TIME - $CURRENT_STATUS" >> "$LOGFILE"
        # Update last status
        LAST_STATUS=$CURRENT_STATUS

        # Handle LEDs and restart server if needed
        case $CURRENT_STATUS in
            "SERVER_UP")
                set_leds "GREEN"
                ;;
            *)
                set_leds "RED"
                if [ "$CURRENT_STATUS" = "SERVER_DOWN" ]; then
                    cd /Users/Pontus/Documents/Forskning/checklists
                    authbind --deep pm2 start server.js
                fi
                ;;
        esac
    fi

    # Log Ethernet status if it has changed
    if [ "$ETH_STATUS" != "$LAST_ETH_STATUS" ]; then
        echo "$CURRENT_TIME - $ETH_STATUS" >> "$ETH_LOGFILE"
        LAST_ETH_STATUS=$ETH_STATUS
    fi

    # Sleep for 30 seconds
    sleep 30
done

