// charts
google.charts.load('current', {'packages':['corechart']});
let chart;
let data;

// temperature
function updateThermometer(temperature) {
    const sensorBar = document.querySelector('.sensor-bar');
    const temperatureValue = document.getElementById('temperature');

    const heightPercentage = Math.min(temperature, 100);
    sensorBar.style.height = heightPercentage * 2 + '%'; 
    
    temperatureValue.textContent = temperature + '°C';
}

// devices
const devices = {
    livingRoom: [
        { name: 'Lock', icon: '<i class="fa-solid fa-lock"></i>'},
        { name: 'Smart TV', icon: '<i class="fas fa-tv"></i>' },
        { name: 'Sofa Lights', icon: '<i class="fas fa-lightbulb"></i>' },
        { name: 'Air Conditioner', icon: '<i class="fas fa-snowflake"></i>' },
        { name: 'Lamp', icon: '<i class="fas fa-lightbulb"></i>' },
        { name: 'Curtains', icon: '<i class="fas fa-window-restore"></i>' }
    ],
    bedroom: [
        { name: 'Lock', icon: '<i class="fa-solid fa-lock"></i>'},
        { name: 'Bedside Lamp', icon: '<i class="fas fa-bed"></i>' },
        { name: 'Speaker', icon: '<i class="fas fa-volume-up"></i>' },
        { name: 'Air Purifier', icon: '<i class="fas fa-wind"></i>' },
        { name: 'Air Conditioner', icon: '<i class="fas fa-snowflake"></i>'},
    ],
    kitchen: [
        { name: 'Refrigerator', icon: '<i class="fas fa-ice-cream"></i>' },
        { name: 'Ceiling Light', icon: '<i class="fas fa-lightbulb"></i>' },
        { name: 'Oven', icon: '<i class="fa-solid fa-fire"></i>' },
    ],
    bathroom: [
        { name: 'Lock', icon: '<i class="fa-solid fa-lock"></i>'},
        { name: 'Heated Towel Rack', icon: '<i class="fa-solid fa-fire"></i>' },
        { name: 'Faucet', icon: '<i class="fa-solid fa-faucet"></i>'},
        { name: 'Shower', icon: '<i class="fa-solid fa-shower"></i>'},
    ]
};

let selectedRoom = "livingRoom";

function changeRoom(room) {
    selectedRoom = room;
    updateDeviceList();

    const rooms = document.querySelectorAll(".room");
    rooms.forEach(r => {
        r.style.border = 'solid 5px white'; 
        r.style.color = 'white'; 
    })

    const selectedRoomFunc = document.getElementById(room);
    selectedRoomFunc.style.border = 'solid 5px rgb(0, 255, 0)'; 
    selectedRoomFunc.style.color = 'rgb(0, 255, 0)'; 

    const contentElement = document.querySelector('.content');
    if (room == "livingRoom"){
        contentElement.style.backgroundImage = `
        linear-gradient(to left,
        rgba(0, 0, 0, 0) 0%,
        rgba(17, 17, 17, 0.6) 100%), 
        url(/images/living_room.jpg)`;
    }
    else if (room == "kitchen"){
        contentElement.style.backgroundImage = `
        linear-gradient(to left,
        rgba(0, 0, 0, 0) 0%,
        rgba(17, 17, 17, 0.6) 100%), 
        url(/images/kitchen.webp)`;
    }
    else if (room == "bathroom"){
        contentElement.style.backgroundImage = `
        linear-gradient(to left,
        rgba(0, 0, 0, 0) 0%,
        rgba(17, 17, 17, 0.6) 100%), 
        url(/images/bathroom.jpg)`;
    }
    else {
        contentElement.style.backgroundImage = `
        linear-gradient(to left,
        rgba(0, 0, 0, 0) 0%,
        rgba(17, 17, 17, 0.6) 100%), 
        url(/images/bedroom.jpg)`;
    }
}

function updateDeviceList() {
    const deviceNames = devices[selectedRoom];

    deviceList.innerHTML = '';

    deviceNames.forEach(device => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `${device.icon} <span>${device.name}</span>`;
        const controlContainer = document.createElement('div');

        if (device.name.toLowerCase().includes("light") || device.name.toLowerCase().includes("lamp")) {

            controlContainer.className = 'control-buttons-range';

            const decreaseButton = document.createElement('button');
            decreaseButton.textContent = '-';
            decreaseButton.className = 'arrow-button';
            decreaseButton.onclick = () => adjustLightLevel(device.name, -1);

            const lightLevelDisplay = document.createElement('span');
            lightLevelDisplay.className = 'light-level';
            lightLevelDisplay.textContent = '0'; 
            lightLevelDisplay.id = device.name

            const increaseButton = document.createElement('button');
            increaseButton.textContent = '+';
            increaseButton.className = 'arrow-button';
            increaseButton.onclick = () => adjustLightLevel(device.name, 1);
            controlContainer.appendChild(decreaseButton);
            controlContainer.appendChild(lightLevelDisplay);
            controlContainer.appendChild(increaseButton);
        } else {
            controlContainer.className = 'control-buttons';

            const toggleSwitch = document.createElement('label');
            toggleSwitch.className = 'switch';

            const input = document.createElement('input');
            input.type = 'checkbox';
            input.id = device.name
            // input.onclick = () => toggleDevice(input, device.name);

            const slider = document.createElement('span');
            slider.className = 'slider';

            toggleSwitch.appendChild(input);
            toggleSwitch.appendChild(slider);
            controlContainer.appendChild(toggleSwitch);
        }
        listItem.appendChild(controlContainer);
        deviceList.appendChild(listItem);
    });
}

function adjustLightLevel(device, change) {
    const listItems = deviceList.getElementsByTagName('li');
    for (let item of listItems) {
        if (item.textContent.includes(device)) {
            const lightLevelDisplay = item.querySelector('.light-level');
            let currentLevel = parseInt(lightLevelDisplay.textContent);

            currentLevel = Math.min(Math.max(currentLevel + change, 0), 5);
            lightLevelDisplay.textContent = currentLevel;
            break;
        }
    }
}

