//event listeners
document.querySelector("#zip").addEventListener("change", displayCity);
document.querySelector("#state").addEventListener("change", displayCounties);
document.querySelector("#username").addEventListener("change", checkUsername);
document.querySelector("#signupForm").addEventListener("submit", function(event) {
    validateForm(event);
});

//functions

//Displaying city from Web API after entering a zip code
async function displayCity() {
    let zipCode = document.querySelector("#zip").value;
    let url = `https://csumb.space/api/cityInfoAPI.php?zip=${zipCode}`;
    let response = await fetch(url);
    let data = await response.json();

    if (data) {
        document.querySelector("#city").innerHTML = data.city;
        document.querySelector("#latitude").innerHTML = data.latitude;
        document.querySelector("#longitude").innerHTML = data.longitude;
    } else {
        document.querySelector("#city").innerHTML = "INVALID ZIP CODE";
        document.querySelector("#city").style.color = "red";
        document.querySelector("#latitude").innerHTML = "";
        document.querySelector("#longitude").innerHTML = "";
    }
}

//Displaying counties from Web API based on the two-letter abbreviation of a state
async function displayCounties() {
    let state = document.querySelector("#state").value;
    let url = `https://csumb.space/api/countyListAPI.php?state=${state}`;
    let response = await fetch(url);
    let data = await response.json();
    let countyList = document.querySelector("#county");

    countyList.innerHTML = "<option>Select County</option>";
    for (let i = 0; i < data.length; i++) {
        countyList.innerHTML += `<option>${data[i].county}</option>`;
    }
}

// checking whether the username is available
async function checkUsername() {
    let username = document.querySelector("#username").value;
    let url = `https://csumb.space/api/usernamesAPI.php?username=${username}`;
    let response = await fetch(url);
    let data = await response.json();
    let usernameError = document.querySelector("#usernameError");

    if (username.length === 0) {
        usernameError.innerHTML = "";
        return;
    }

    if (data.available) {
        usernameError.innerHTML = "Username available!";
        usernameError.style.color = "green";
    } else {
        usernameError.innerHTML = "Username taken";
        usernameError.style.color = "red";
    }
}

// Display suggested password
document.querySelector("#password").addEventListener("focus", async function() {
    let url = "https://webspace.csumb.edu/~lara4594/ajax/suggestedPwd.php?length=8";
    let response = await fetch(url);
    let data = await response.text();
    document.querySelector("#suggestedPwd").innerHTML = "Suggested: " + data;
    document.querySelector("#suggestedPwd").style.color = "#3498db";
    document.querySelector("#suggestedPwd").style.fontSize = "0.9em";
});

//Validating form data
function validateForm(e) {
    let isValid = true;
    let username = document.querySelector("#username").value;
    let password = document.querySelector("#password").value;
    let passwordAgain = document.querySelector("#passwordAgain").value;
    let passwordError = document.querySelector("#passwordError");

    // Reset error messages
    passwordError.innerHTML = "";

    // Validate username
    if (username.length == 0) {
        document.querySelector("#usernameError").innerHTML = "Username Required!";
        document.querySelector("#usernameError").style.color = "red";
        isValid = false;
    }

    // Validate password length
    if (password.length < 6) {
        passwordError.innerHTML = "Password must be at least 6 characters";
        passwordError.style.color = "red";
        isValid = false;
    }

    // Validate password match
    if (password !== passwordAgain) {
        passwordError.innerHTML = "Passwords do not match";
        passwordError.style.color = "red";
        isValid = false;
    }

    if (!isValid) {
        e.preventDefault();
    }
}