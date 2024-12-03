// temperature
function animateNumbers(start, end, duration) {
    const element = document.getElementById('temperature-display');
    const startTime = performance.now();

    function update() {
        const currentTime = performance.now();
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1); 

        const currentValue = Math.round(start + (end - start) * progress);

        element.innerHTML = `${currentValue}<span>C</span><strong>&deg;</strong>`;

        if (progress < 1) {
            requestAnimationFrame(update); 
        }
    }
    requestAnimationFrame(update);
}

function updateTemperature(newTemperature) {
    const temperatureDisplay = document.getElementById('temperature-display');
    const currentTemperature = parseFloat(temperatureDisplay.innerText);
    animateNumbers(currentTemperature, newTemperature, 1000); 
}

// humidity
function setWaterDisplay(targetPercent) {
    const countElement = document.getElementById("count");
    const waterElement = document.getElementById("water");
    const currentPercent = parseInt(countElement.innerHTML) || 0;
    const increment = targetPercent > currentPercent ? 1 : -1; 
    const duration = 3000; 
    const steps = Math.abs(targetPercent - currentPercent);
    const interval = duration / steps;
    
    let current = currentPercent;

    const updateDisplay = () => {
        if (current !== targetPercent) {
            current += increment;
            countElement.innerHTML = current;
            waterElement.style.transform = 'translate(0,' + (100 - current) + '%)';
            requestAnimationFrame(updateDisplay);
        }
    };

    updateDisplay(); 
}

// Get random number in a fixed range
function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

var min_id = null;
var hour_id = null;

!function(d,w){
  calculateTime();
  getMinutes();
  getHours();                      
  setInterval(calculateTime, 1000);
}(document, window);		               

function calculateTime() {   
  $('.seconds .to')
    .addClass('hide')
    .removeClass('to')
    .addClass('from')
    .removeClass('hide')
    .addClass('n')
    .find('span:not(.shadow)').each(function (i, el) {
      $(el).text(getSeconds());
  });

  $('.seconds .from:not(.n)')
    .addClass('hide')
    .addClass('to')
    .removeClass('from')
    .removeClass('hide')
    .find('span:not(.shadow)').each(function (i, el) {
      $(el).text(getSeconds());
  });

  $('.seconds .n').removeClass('n');
}

function getHours() {
    var hour = new Date().getHours();  
    hour = (hour < 10) ? "0" + hour : hour;

    $('.hours .to')
    .addClass('hide')
    .removeClass('to')
    .addClass('from')
    .removeClass('hide')
    .addClass('n')
    .find('span:not(.shadow)').each(function (i, el) {
      $(el).text(hour);
    });

  $('.hours .from:not(.n)')
    .addClass('hide')
    .addClass('to')
    .removeClass('from')
    .removeClass('hide')
    .find('span:not(.shadow)').each(function (i, el) {
      $(el).text(hour);
  });

  $('.hours .n').removeClass('n');

  window.clearTimeout(hour_id);                        
}

function getMinutes() {                        
  var min = new Date().getMinutes();                         
  min = (min < 10) ? "0" + min : min;                        

  $('.minutes .to')
    .addClass('hide')
    .removeClass('to')
    .addClass('from')
    .removeClass('hide')
    .addClass('n')
    .find('span:not(.shadow)').each(function (i, el) {
      $(el).text(min);
  });

  $('.minutes .from:not(.n)')
    .addClass('hide')
    .addClass('to')
    .removeClass('from')
    .removeClass('hide')
    .find('span:not(.shadow)').each(function (i, el) {
      $(el).text(min);
  });

  $('.minutes .n').removeClass('n');                        
  window.clearTimeout(min_id);

  if ( (parseInt(min) === 0) && (parseInt(getSeconds()) === 0)) {                                   
    hour_id = window.setTimeout(getHours, 1000);
  }
}

function getSeconds() {
  var sec = new Date().getSeconds();                          
  if (parseInt(sec) >= 59) { 
    min_id = window.setTimeout(getMinutes, 1000);
  }    

  return (sec < 10 ? '0' + sec : sec);                               
}

// gadgets
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

// chart
google.charts.load('current', {'packages': ['corechart']});
google.charts.setOnLoadCallback(drawChart); 

// Sample data for each room (30 days)
const roomData = {
    'livingRoom': Array.from({ length: 30 }, () => Math.floor(Math.random() * 100) + 20), // Random values between 20-119
    'kitchen': Array.from({ length: 30 }, () => Math.floor(Math.random() * 100) + 10), // Random values between 10-109
    'bedroom': Array.from({ length: 30 }, () => Math.floor(Math.random() * 80) + 5), // Random values between 5-84
    'bathroom': Array.from({ length: 30 }, () => Math.floor(Math.random() * 50) + 5) // Random values between 5-54
};

function drawChart(selectedRoom = 'all') {
    let dataArray = [['Day', 'Power Consumption (kWh)']];
    const days = Array.from({ length: 30 }, (_, i) => (i + 1).toString()); // Days 1-30

    if (selectedRoom === 'all') {
        for (let i = 0; i < days.length; i++) {
            const total = roomData.livingRoom[i] + roomData.kitchen[i] + roomData.bedroom[i] + roomData.bathroom[i];
            dataArray.push([days[i], total]);
        }
    } else {
        for (let i = 0; i < days.length; i++) {
            dataArray.push([days[i], roomData[selectedRoom][i]]);
        }
    }

    var data = google.visualization.arrayToDataTable(dataArray);

    var options = {
        title: selectedRoom.charAt(0).toUpperCase() + selectedRoom.slice(1) + ' Power Consumption (Last 30 Days)',
        hAxis: {title: 'Day'},
        vAxis: {title: 'Power Consumption (kWh)'},
        legend: 'none',
        colors: ['#333'],
        backgroundColor: 'none' 
    };

    var chart = new google.visualization.ColumnChart(document.getElementById('chart-id'));
    chart.draw(data, options);
}

let currentRoom = 'all'; 

function updateDeviceList() {
    const deviceList = document.getElementById('deviceList');
    deviceList.innerHTML = ''; 

    const roomsToShow = currentRoom === 'all' ? Object.keys(devices) : [currentRoom];

    roomsToShow.forEach(room => {
        devices[room].forEach(device => {
            const deviceElement = document.createElement('div');
            deviceElement.className = 'device';
            deviceElement.innerHTML = `${device.icon} ${device.name}`;

            if (device.name.includes('Light') || device.name.includes('Lamp')) {
                const quantityContainer = document.createElement('div');
                const quantityInput = document.createElement('input');
                // const valueDisplay = document.createElement('span');

                quantityInput.type = 'number';
                quantityInput.min = 0;
                quantityInput.max = 5;
                quantityInput.value = 0;
                quantityInput.className = 'quantity-input';
                quantityInput.style.width = '50px'; // Shorter width
                quantityInput.id = `${room}_${device.name}`                

                quantityInput.oninput = function() {
                    let value = parseInt(quantityInput.value);
                    if (isNaN(value) || value < 0) {
                        quantityInput.value = 0;
                    } else if (value > 5) {
                        quantityInput.value = 5; 
                    }
                };

                quantityContainer.appendChild(quantityInput);
                deviceElement.appendChild(quantityContainer);
            } else {
                const toggle = document.createElement('div');
                toggle.className = 'toggle-button';
                toggle.onclick = function () {
                    toggle.classList.toggle('active');
                };
                toggle.id = `${room}_${device.name}`
                deviceElement.appendChild(toggle);
            } 
            deviceList.appendChild(deviceElement);
        });
    });
}

function toggleRoom(room) {
    currentRoom = room;
    const buttons = document.querySelectorAll('.room-toggle button');
    buttons.forEach(button => {
        button.classList.remove('active');
    });
    const activeButton = document.getElementById(room + 'Btn') || document.getElementById('allBtn');
    activeButton.classList.add('active');

    const highlight = document.getElementById('highlight');
    const buttonRect = activeButton.getBoundingClientRect();
    const containerRect = document.querySelector('.room-toggle').getBoundingClientRect();

    const offsetX = buttonRect.left - containerRect.left;  
    const width = buttonRect.width; 

    highlight.style.left = `${offsetX}px`;
    highlight.style.width = `${width}px`;

    updateDeviceList();

    drawChart(room);
    document.querySelectorAll('.room-toggle button').forEach(button => {
        button.classList.remove('active');
    });
    document.getElementById(room + 'Btn').classList.add('active');
}