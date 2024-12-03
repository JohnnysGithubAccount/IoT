import network
import urequests
import time
from random import randint
import json

# Replace with your own credentials and Firebase URL
WIFI_SSID = 'Wokwi-GUEST'
WIFI_PASSWORD = ''
FIREBASE_URL = 'https://test-147e9-default-rtdb.firebaseio.com/test/temperature_humidity.json'

# Connect to Wi-Fi
def connect_wifi():
    wlan = network.WLAN(network.STA_IF)
    wlan.active(True)
    wlan.connect(WIFI_SSID, WIFI_PASSWORD)
    
    while not wlan.isconnected():
        print("Connecting to Wi-Fi...")
        time.sleep(1)
    
    print("Connected to Wi-Fi:", wlan.ifconfig())

# Send data to Firebase
def send_data(data):
    try:
        # Convert the data to JSON format
        json_data = json.dumps(data)
        response = urequests.put(FIREBASE_URL, data=json_data)
        
        print("Response Code:", response.status_code)
        print("Response Text:", response.text)
        
        response.close()  # Close the response to free up resources
    except Exception as e:
        print("Error sending data:", e)

def read_data():
    try:
        response = urequests.get(FIREBASE_URL)
        
        if response.status_code == 200:
            data = response.json()  # Parse the JSON response
            print("Data retrieved from Firebase:", data)
        else:
            print("Error reading data, Response Code:", response.status_code)
        
        response.close()  # Close the response
    except Exception as e:
        print("Error reading data:", e)

# Main function
def main():
    connect_wifi()
    
    while True:
        data = {
            'temperature': randint(24, 40),
            'humidity': randint(50, 60)
        }
        send_data(data)
        print(read_data())
        time.sleep(1)  # Send data every 30 seconds

# Run the main function
if __name__ == '__main__':
    main()