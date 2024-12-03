import network
import urequests
import time
from random import randint
import json
from machine import Pin, PWM


WIFI_SSID = 'Johnny'
WIFI_PASSWORD = 'thanhtai2907'
FIREBASE_URL = 'https://test-147e9-default-rtdb.firebaseio.com/test/temperature_humidity.json'


devices = {
    "outsideLights": Pin(12, Pin.OUT),
    "heater": Pin(14, Pin.OUT),
    "wifi": Pin(15, Pin.OUT),
    "wifiExtenders": Pin(16, Pin.OUT),
    "livingRoomLock": Pin(18, Pin.OUT),
    "livingRoomAirConditioner": Pin(19, Pin.OUT),
    "livingRoomLamp": PWM(Pin(23), freq=2000),
    "kitchenCeilingLight": PWM(Pin(25), freq=200),
    "kitchenRefrigerator": Pin(26, Pin.OUT),
    "bedroomConditioner": Pin(27, Pin.OUT),
    "bathroomLock": Pin(17, Pin.OUT)
}


def mapping(x,in_min,in_max,out_min,out_max):
    return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min


def connect_wifi():
    wlan = network.WLAN(network.STA_IF)
    wlan.active(True)
    wlan.connect(WIFI_SSID, WIFI_PASSWORD)
    
    while not wlan.isconnected():
        print("Connecting to Wi-Fi...")
        time.sleep(1)
    
    print("Connected to Wi-Fi:", wlan.ifconfig())


rooms = ['livingRoom', 'bedroom', 'bathroom', 'kitchen']


def test_devices():
    print("Testing devices status...")
    for device_name, device in devices.items():
        try:
            # Read the current status of the device
            if isinstance(device, PWM):  # For PWM devices
                # Read the duty cycle (assuming you want to print its current duty cycle)
                current_duty = device.duty()  # Get the current duty cycle
                print(device_name + " (PWM) Duty Cycle: " + str(current_duty))
            else:  # For digital output devices
                current_value = device.value()  # Get the current value (0 or 1)
                status = "ON" if current_value else "OFF"
                print(device_name + " (Digital) Status: " + status)
        except Exception as e:
            print("Error reading status of " + device_name + ": " + str(e))


def main():
    connect_wifi()
    
    while True:
        url = "https://dashboard-7543e-default-rtdb.firebaseio.com/my-device.json"
        try:
            response = urequests.get(url)
            
            if response.status_code == 200:
                data = response.json()
                data = dict(data)
                print("Data retrieved from Firebase:", data)
                
                for key, value in data.items():
                    try:
                        if 'lamp' in key.lower() or 'light' in key.lower():
                            devices.get(key).duty(mapping(value, 0, 5, 0, 1023))
                        else:
                            devices.get(key).value(value)
                    except:
                        pass
                    
            else:
                print("Error reading data, Response Code:", response.status_code)
            
            response.close() 
        except Exception as e:
            print("Error reading data:", e)
            
            
        
        for room in rooms:
            url = "https://dashboard-7543e-default-rtdb.firebaseio.com/rooms/"
            url += (room + "/devices.json")
            try:
                response = urequests.get(url)
                
                if response.status_code == 200:
                    data = response.json()
                    data = dict(data)
                    print("Data retrieved from Firebase:", data)
                    
                    for key, value in data.items():
                        try:
                            if 'lamp' in key.lower() or 'light' in key.lower():
                                devices.get(key).duty(mapping(value['quantity'], 0, 5, 0, 1023))
                            else:
                                devices.get(key).value(value['status'])
                        except:
                            pass
                        
                else:
                    print("Error reading data, Response Code:", response.status_code)
                
                response.close() 
            except Exception as e:
                print("Error reading data:", e)
        
        time.sleep(1)
        test_devices()

if __name__ == '__main__':
    main()


