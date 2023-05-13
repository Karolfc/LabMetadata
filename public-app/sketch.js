import { request, response } from "express";

const NGROK = `${window.location.hostname}`;
console.log('Server IP: ', NGROK);
let socket = io(NGROK, { path: '/real-time' });

function setup() {
    frameRate(60);
    canvas = createCanvas(windowWidth, windowHeight);
    canvas.style('z-index', '-1');
    canvas.style('position', 'fixed');
    canvas.style('top', '0');
    canvas.style('right', '0');
    background(0);
}

function draw() {
    background(0, 5);
    newCursor(pmouseX, pmouseY);
    fill(255);
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function newCursor(x, y) {
    noStroke();
    fill(255);
    ellipse(x, y, 10, 10);
}

/* Form Inputs */

let nameInput = document.getElementById("name");
let emailInput = document.getElementById("email");
let dobIntput = document.getElementById("dob");
let phoneInput = document.getElementById("phone");
let privacyCheckbox = document.getElementById("privacy-agreement");

/* Button condition */

function checkInputs() {
    let filledUp = true;

    formInputs.forEach(input => {
        if (input.value === '') {
            filledUp = false;
        }
    });

    if (filledUp && privacyCheckbox.checked) {
        submitBtn.disabled = false;
    } else {
        submitBtn.disabled = true;
    }
}

formInputs.forEach(input => {
    input.addEventListener('input', checkInputs());
});

privacyCheckbox.addEventListener('change', checkInputs);

form.addEventListener('submit', (e) => {
    e.preventDefault();
    newUser = { name: inputName.value, email: `${inputName.value}@gmail.com`, Birth_Date: inputBirth_Date.value, Phone: inputPhone.value};

    console.log(`submited: ${inputName.value}`);
    console.log(newUser);
    sendUserData(newUser);
    resetInputs();
});

/* User inputs */

let userData = {
    Name: '',
    Email: '',
    Phone: '',
    Birth_Date: '',
    Location: '',
    Submission_Date: '',
    Interaction_Time: '',
    Submission_Time: '',
    Duration: '',
    Device_Type: '',
};

/* User metadata */

let locationTaken = false;
navigator.geolocation.getCurrentPosition(function(position) {
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;
    userData.location = 'latitude: ' + latitude + ' longitude: ' + longitude;
    locationTaken = true;  
});

/* Interaction_Time */

let loadTime = 0;
window.onload =  function() {
    var InteractionTime = new Date();
    userData.Interaction_Time = InteractionTime.toLocaleTimeString();
    loadTime = new Date().getTime();   
};

submitButton.addEventListener("click", function() {
    userData.Name = nameInput.value;
    userData.Email = emailInput.value;
    userData.Phone = phoneInput.value;
    userData.Birth_Date = dobIntput.value;

    userData.Submission_Date = new Date().toLocaleDateString();
    userData.Submission_Time = new Date().toLocaleTimeString();

    let submitTime = new Date().getTime();
    let durationTotal = Math.floor((submitTime - loadTime) / 1000);
    userData.Duration = `${durationTotal} seconds`; 

    const userAgent = window.navigator.userAgent;
    let deviceType;

    if (/iPhone|iPad|iPod/.test(navigator.userAgent) && !window.MSStream) {
        userData.Device_Type = 'iOS';
    } else if (/Android/.test(navigator.userAgent)) {
        userData.deviceType = 'Android';
    } else {
        userData.deviceType = 'Other';
    }

    if (locationTaken) {
        console.log(userData);
        socket.emit('userData', userData);
        sendData(userData);        
    } else {
        alert('The location is not available. Try again later');
    }
});

/* post user data */

async function sendData(data) {
    const request = {
        method: "POST",
        headers: {
            "Content-Type" : "application/json"
        },
        body: JSON.stringify(data),
    }    
    return await fetch(`/Forms-Array`, request);
}