import network
import urequests
import time
import json
import dht
import machine
from machine import Pin, ADC
from mq_135 import measuring


WIFI_SSID = 'Johnny'
WIFI_PASSWORD = 'thanhtai2907'

def connect_wifi():
    wlan = network.WLAN(network.STA_IF)
    wlan.active(True)
    wlan.connect(WIFI_SSID, WIFI_PASSWORD)
    
    while not wlan.isconnected():
        print("Connecting to Wi-Fi...")
        time.sleep(1)
    
    print("Connected to Wi-Fi:", wlan.ifconfig())
    
def send_data(data, FIREBASE_URL):
    try:
        json_data = json.dumps(data)
        response = urequests.put(FIREBASE_URL, data=json_data)
        
        print("Response Code:", response.status_code)
        print("Response Text:", response.text)
        
        response.close()  
    except Exception as e:
        print("Error sending data:", e)
        

# dht22 object
d = dht.DHT22(machine.Pin(25))
rooms = ['livingRoom', 'bedroom', 'bathroom', 'kitchen']
connect_wifi()
while True:    
    # update humidity, temperature
    d.measure()
    temperature = d.temperature()
    humidity = d.humidity()
    mq135_sensor = measuring(False)
    
    base_url = "https://dashboard-7543e-default-rtdb.firebaseio.com/rooms/"
    

    data = {
        'temperature': temperature,
        'humidity': humidity
    }
    
    for room in rooms:
        try:
            json_data = json.dumps(data)
            response = urequests.patch(base_url + room + "/temperatures_humidity/2023-09-30.json", data=json_data)
            
            print("Response Code:", response.status_code)
            print("Response Text:", response.text)
            
            response.close()  
        except Exception as e:
            print("Error sending data:", e)
            
    base_url = "https://dashboard-7543e-default-rtdb.firebaseio.com/rooms/"
    data = {
        'co2': mq135_sensor,
    }
    for room in rooms:
        try:
            json_data = json.dumps(data)
            response = urequests.patch(base_url + room + ".json", data=json_data)
            
            print("Response Code:", response.status_code)
            print("Response Text:", response.text)
            
            response.close()  
        except Exception as e:
            print("Error sending data:", e)
            break
    
    time.sleep(0.10)
    
    pass

