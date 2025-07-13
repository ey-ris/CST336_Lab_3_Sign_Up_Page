// Event listeners
document.addEventListener("DOMContentLoaded", function() {
    loadStates(); // Load states when page loads
    document.querySelector("#zip").addEventListener("change", displayCity);
    document.querySelector("#state").addEventListener("change", displayCounties);
    document.querySelector("#username").addEventListener("change", checkUsername);
    document.querySelector("#password").addEventListener("focus", showSuggestedPassword);
    document.querySelector("#signupForm").addEventListener("submit", function(event) {
        validateForm(event);
    });
});

// Load all US states into dropdown
async function loadStates() {
    try {
        let response = await fetch("https://csumb.space/api/allStatesAPI.php");
        let data = await response.json();
        let stateSelect = document.querySelector("#state");

        // Clear existing options except the first one
        stateSelect.innerHTML = "<option value=''>Select One</option>";

        // Add all states sorted alphabetically
        data.sort((a, b) => a.state.localeCompare(b.state)).forEach(state => {
            stateSelect.innerHTML += `<option value="${state.usps}">${state.state}</option>`;
        });
    } catch (error) {
        console.error("Error loading states:", error);
    }
}

// Display city info from zip code
async function displayCity() {
    let zipCode = document.querySelector("#zip").value;
    let zipError = document.querySelector("#zipError");
    let url = `https://csumb.space/api/cityInfoAPI.php?zip=${zipCode}`;

    try {
        let response = await fetch(url);
        let data = await response.json();

        if (!data || data.error) {
            zipError.innerHTML = "Zip code not found";
            zipError.style.color = "red";
            document.querySelector("#city").innerHTML = "";
            document.querySelector("#latitude").innerHTML = "";
            document.querySelector("#longitude").innerHTML = "";
        } else {
            zipError.innerHTML = "";
            document.querySelector("#city").innerHTML = data.city;
            document.querySelector("#latitude").innerHTML = data.latitude;
            document.querySelector("#longitude").innerHTML = data.longitude;
        }
    } catch (error) {
        console.error("Error fetching city info:", error);
        zipError.innerHTML = "Error fetching zip code data";
        zipError.style.color = "red";
    }
}

// Display counties for selected state
async function displayCounties() {
    let state = document.querySelector("#state").value;
    let countySelect = document.querySelector("#county");

    if (!state) {
        countySelect.innerHTML = "<option value=''>Select County</option>";
        return;
    }

    try {
        let url = `https://csumb.space/api/countyListAPI.php?state=${state}`;
        let response = await fetch(url);
        let data = await response.json();

        countySelect.innerHTML = "<option value=''>Select County</option>";
        data.forEach(county => {
            countySelect.innerHTML += `<option>${county.county}</option>`;
        });
    } catch (error) {
        console.error("Error fetching counties:", error);
        countySelect.innerHTML = "<option value=''>Error loading counties</option>";
    }
}

// Check username availability
async function checkUsername() {
    let username = document.querySelector("#username").value;
    let usernameError = document.querySelector("#usernameError");

    if (username.length === 0) {
        usernameError.innerHTML = "";
        return;
    }

    try {
        let url = `https://csumb.space/api/usernamesAPI.php?username=${username}`;
        let response = await fetch(url);
        let data = await response.json();

        if (data.available) {
            usernameError.innerHTML = "Username available!";
            usernameError.style.color = "green";
        } else {
            usernameError.innerHTML = "Username taken";
            usernameError.style.color = "red";
        }
    } catch (error) {
        console.error("Error checking username:", error);
        usernameError.innerHTML = "Error checking username availability";
        usernameError.style.color = "red";
    }
}

// Show suggested password
async function showSuggestedPassword() {
    try {
        let response = await fetch("https://webspace.csumb.edu/~lara4594/ajax/suggestedPwd.php?length=8");
        let data = await response.json(); // Parse as JSON
        let password = data.password; // Extract just the password value
        document.querySelector("#suggestedPwd").innerHTML = `Suggested password: ${password}`;
        document.querySelector("#suggestedPwd").style.color = "green";
    } catch (error) {
        console.error("Error getting suggested password:", error);
        document.querySelector("#suggestedPwd").innerHTML = "Could not generate suggestion";
        document.querySelector("#suggestedPwd").style.color = "red";
    }
}

// Validate form before submission
function validateForm(e) {
    let isValid = true;
    let username = document.querySelector("#username").value;
    let password = document.querySelector("#password").value;
    let passwordAgain = document.querySelector("#passwordAgain").value;
    let passwordError = document.querySelector("#passwordError");

    // Reset error messages
    passwordError.innerHTML = "";

    // Validate username
    if (username.length === 0) {
        document.querySelector("#usernameError").innerHTML = "Username required";
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