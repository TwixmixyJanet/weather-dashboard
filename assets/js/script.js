var cityInputText = document.getElementById("city-input");
var searchForm = document.getElementById("search-form");
var searchButton = document.getElementById("search-btn")
var savedSearches = document.getElementById("saved-searches")
var clearButton = document.getElementById("clear-button");
var todaysWeather = document.getElementById("todays-weather");
var forecast = document.getElementById("forecast");
var forecastHeader = document.querySelector(".forecast-header")
var loggedSearches = [];

function dashboard(e) {
    console.log("dashboard initates")
    e.preventDefault();
    var cityName = cityInputText.value;
    displayWeather(cityName);
}

function displayWeather(cityName) {

    console.log("display weather initates")
    var url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=b2da1db112f5ef2d52f8606a017dc730&units=imperial`;
    fetch(url)
        .then(function (response) {
            console.log("api response initates")
            return response.json();
        })
        .then(function (currentData) {
            var forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${currentData.coord.lat}&lon=${currentData.coord.lon}&appid=b2da1db112f5ef2d52f8606a017dc730&units=imperial`;
            fetch(forecastUrl)
                .then(function (response) {
                    console.log("current call initates")
                    return response.json();
                })
                .then (function (fiveDayData) {
                    console.log("five day initates")
                    if (loggedSearches.includes(currentData.name) === false) {
                        loggedSearches.push(currentData.name);
                        localStorage.setItem("city", JSON.stringify(loggedSearches));
                    }
                    displayCity();
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
                    console.log("5 day data: ", fiveDayData)
                    var cards = "";
                    for (var i = 1; i < 6; i++) {
                        // days = dayjs().add(1, 'day').format(" dddd, MMM D YYYY ");
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
                    forecast.innerHTML = cards;
                    forecastHeader.style.display = "block";
                });
        });
}

function displayCity() {
    console.log("display city initates")
    if (localStorage.getItem("city")) {
        loggedSearches = JSON.parse(localStorage.getItem("city"));
    }

    var cityList = "";
    for (var i = 0; i < loggedSearches.length; i++) {
        cityList = cityList + `<button class="btn btn-secondary my-2" type="submit">${loggedSearches[i]}</button>`;
    }

    savedSearches.innerHTML = cityList;
    var myDashTwo = document.querySelectorAll(".my-2");
    for (var i = 0; i < myDashTwo.length; i++) {
        myDashTwo[i].addEventListener("click", function() {
            displayWeather(this.textContent);
        });
    }
}

displayCity();

searchForm.addEventListener("submit", dashboard);

function clearloggedSearches() {
    console.log("clear cities initates")
    localStorage.clear();
    savedSearches.innerHTML = "";
    loggedSearches = [];
}

clearButton.addEventListener("click", function() {
    clearloggedSearches();
});



