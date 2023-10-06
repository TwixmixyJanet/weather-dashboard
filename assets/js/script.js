//     Weather App

// API - connect to Weather and Geolocation
    // HINT: need to register for an API key for the geolocation for lat and long
    // Need to register for weather API key - could take 2hrs to activate
var weatherAPIKey = "b2da1db112f5ef2d52f8606a017dc730";
var weatherAPIURL = `https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid=${weatherAPIKey}`;
    // FETCH API url
    // give it a variable
    // parse data
var cityInputElement = document.getElementById("city-input");
var searchForm = document.getElementById("search-form");
var searchedCities = document.getElementById("search-history")
var clearButton = document.getElementById("clear-btn");
var todaysWeather = document.getElementById("todays-weather");
var fiveDayForecast = document.getElementById("five-day-forecast");
var searchHistory = [];

// Query search
    // Add city based off search
    // Create new button for search
    // limit to top 10
    // prevent adding same city multiple times, if possible
    // Only allow a button to be added if it’s a valid search/location

// Local Storage
    // Search history is what persists

// Today's Weather
    // City / Date / Emoji /  Temp / Wind / Humidity

// 5-Day Forecase
    // 5-day forecast begins at tomorrow
    // Date / Emoji / Temp / Wind / Humidity
function dashboard(e) {
    console.log("dashboard initates")
    e.preventDefault();
    var cityName = cityInputElement.value;
    displayWeather(cityName);
}

function displayWeather(cityName) {
    console.log("display weather initates")
    fetch(weatherAPIURL)
        .then(function (response) {
            console.log("api response initates")
            return response.json();
        })
        .then(function (currentData) {
            console.log("current data initates")
            var currentCallURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${currentData.coord.lat}&lon=${currentData.coord.lon}&appid=${weatherAPIKey}&units=imperial`;
            fetch(currentCallURL)
                .then(function (response) {
                    console.log("current call initates")
                    return response.json();
                })
                .then (function (fiveDayData) {
                    console.log("five day initates")
                    if (searchHistory.includes(currentData.name) === false) {
                        searchHistory.push(currentData.name);
                        localStorage.setItem("city", JSON.stringify(searchHistory));
                    }
                    displayCity();
                    console.log(fiveDayData);
                    todaysWeather.innerHTML = 
                    `
                    <ul>
                        <li class="title">${currentData.name} ||<span> ${dayjs(currentData.dt, "X").format(" dddd, MMM D YYYY retrieved at h:mm:ssA")} </span></li>
                        <li><img src="https://openweathermap.org/img/wn/${currentData.weather[0].icon}@2x.png" /></li>
                        <li>Temperature: ${currentData.main.temp}</li>
                        <li>Wind: ${currentData.wind.speed}</li>
                        <li>Humidity: ${currentData.main.humidity}</li>
                        <li>UV Index: ${currentData.current.uvi}</li>
                    </ul>
                    `;
                    var days = "";
                    for (var i = 1; i < 6; i++) {
                        days = days +
                        `
                        <ul class="col-12 col-xl-2 day">
                            <li><img src="https://openweathermap.org/img/wn/${fiveDayData.daily[i].weather[0].icon}@2x.png" /></li>
                            <li>Temperature: ${fiveDayData.main.temp}</li>
                            <li>Wind: ${fiveDayData.wind.speed}</li>
                            <li>Humidity: ${fiveDayData.main.humidity}</li>
                        </ul>
                        `;
                    }
                    fiveDayForecast.innerHTML = days;
                });
        });
}

function displayCity() {
    console.log("display city initates")
    if (localStorage.getItem("city")) {
        searchHistory = JSON.parse(localStorage.getItem("city"));
    }

    var cityList = "";
    for (var i = 0; i < searchHistory.length; i++) {
        cityList = cityList + `<button class="btn btn-secondary my-2" type="submit">${searchHistory[i]}</button>`;
    }

    searchedCities.innerHTML = cityList;
    var marginSelector = document.querySelectorAll(".my-2");
    for (var i = 0; i < marginSelector.length; i++) {
        marginSelector[i].addEventListener("click", function() {
            displayWeather(this.textContent);
        });
    }
}

displayCity();

searchForm.addEventListener("submit", dashboard);

function clearSavedCities() {
    console.log("clear cities initates")
    localStorage.clear();
    searchedCities.innerHTML = "";
    searchHistory = [];
}

clearButton.addEventListener("click)", function() {
    clearSavedCities();
});



