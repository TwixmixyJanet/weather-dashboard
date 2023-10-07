// ~~~~~~~~~~ DOCUMENT SELECTORS ~~~~~~~~~~ //
var cityInputText = document.getElementById("city-input");
var searchForm = document.getElementById("search-form");
var searchButton = document.getElementById("search-btn")
var savedSearches = document.getElementById("saved-searches")
var clearButton = document.getElementById("clear-button");
var todaysWeather = document.getElementById("todays-weather");
var forecast = document.getElementById("forecast");
var forecastHeader = document.querySelector(".forecast-header")
var loggedSearches = [];

// ~~~~~~~~~~ FUNCTIONS & EVENT LISTENERS ~~~~~~~~~~ //
// Initiates the form submit and leads to the display weather function
function formSubmit(e) {
    e.preventDefault();
    var cityName = cityInputText.value;
    displayWeather(cityName);
}

// Initiates the action to display weather
function displayWeather(cityName) {
    // today's weather API call, concatinating in the city name submitted thru the form. Using backticks to make it more concise
    var url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=b2da1db112f5ef2d52f8606a017dc730&units=imperial`;
    // fetching, then waiting for the response, and using json to parse the response
    fetch(url)
        .then(function (response) {
            return response.json();
        })
        // only then will the forecast API be called
        .then(function (currentData) {
            var forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${currentData.coord.lat}&lon=${currentData.coord.lon}&appid=b2da1db112f5ef2d52f8606a017dc730&units=imperial`;
            fetch(forecastUrl)
                .then(function (response) {
                    return response.json();
                })
                .then (function (fiveDayData) {
                    // if the existing searches do not contain the current name, then push it and store to localstorage
                    if (loggedSearches.includes(currentData.name) === false) {
                        loggedSearches.push(currentData.name);
                        localStorage.setItem("city", JSON.stringify(loggedSearches));
                    }
                    // then display the city by calling the function
                    displaySavedCities();
                    // display today's weather, with the following backtick code. Within the concatinated code it did take a lot of sleuthing through the API url data to determine the exact values which needed to be callled, especially the image. Determining the best way to display the date(dayjs) information took awhile as well.
                    todaysWeather.innerHTML = 
                    `
                    <ul class="card list-unstyled">
                        <li class="title">
                        ${currentData.name} 👉 
                        <span> ${dayjs().format(" dddd, MMM D YYYY ")} retrieved at ${dayjs().format("  h:mm:ssA")} </span>
                        </li>
                        <li><img src="https://openweathermap.org/img/wn/${currentData.weather[0].icon}@2x.png" /></li>
                        <li>${currentData.main.temp}° degrees</li>
                        <li>Wind: ${currentData.wind.speed}</li>
                        <li>Humidity: ${currentData.main.humidity}</li>
                        
                    </ul>
                    `;
                    // establishing cards for the forecast
                    var cards = "";
                    // the for loop worked pretty straight forward after figuring out how to use the API and setting up today's weather. Except for the date. The only way I could think to get the date to increment was to define it as an object and get it to iterate through the object.
                    for (var i = 1; i < 6; i++) {
                        daysInc = {
                            1: dayjs().add(1, 'day').format(" dddd, MMM D YYYY "),
                            2: dayjs().add(2, 'day').format(" dddd, MMM D YYYY "),
                            3: dayjs().add(3, 'day').format(" dddd, MMM D YYYY "),
                            4: dayjs().add(4, 'day').format(" dddd, MMM D YYYY "),
                            5: dayjs().add(5, 'day').format(" dddd, MMM D YYYY ")
                        }
                        cards = cards + 
                        `
                        <ul class="col-12 col-xl-2 day card list-unstyled m-2 bg-primary text-light">
                            <li class="title">${daysInc[i]}</li>
                            <li><img src="https://openweathermap.org/img/wn/${fiveDayData.list[i].weather[0].icon}@2x.png" /></li>
                            <li>${fiveDayData.list[i].main.temp}° degrees</li>
                            <li>Wind: ${fiveDayData.list[i].wind.speed}</li>
                            <li>Humidity: ${fiveDayData.list[i].main.humidity}</li>
                        </ul>
                        `;
                    }
                    // display forecast info in the forecast div
                    forecast.innerHTML = cards;
                    // defaulted the header to be display none, so switched to block when the forecast displays
                    forecastHeader.style.display = "block";
                });
        });
}

// Initiate displaying the save cities buttons
function displaySavedCities() {
    // pull them out of localstorage
    if (localStorage.getItem("city")) {
        loggedSearches = JSON.parse(localStorage.getItem("city"));
    }

    // establish the city list and iterate through the list displaying a button for each city
    var cityList = "";
    for (var i = 0; i < loggedSearches.length; i++) {
        cityList = cityList + `<button class="btn btn-secondary my-2" type="submit">${loggedSearches[i]}</button>`;
    }

    // display the saved searches to the city list
    savedSearches.innerHTML = cityList;
    // using the my-2 margin selector to loop through all the cities and assign them a click listener to display the weather
    var cityButtonMargin = document.querySelectorAll(".my-2");
    for (var i = 0; i < cityButtonMargin.length; i++) {
        cityButtonMargin[i].addEventListener("click", function() {
            displayWeather(this.textContent);
        });
    }
}

// call function to disply cities
displaySavedCities();

// submit event to call on the form submission function
searchForm.addEventListener("submit", formSubmit);

// clear saved cities function
function clearSavedSearches() {
    localStorage.clear();
    savedSearches.innerHTML = "";
    loggedSearches = [];
}

// click event to call on the clear searches function
clearButton.addEventListener("click", function() {
    clearSavedSearches();
});



