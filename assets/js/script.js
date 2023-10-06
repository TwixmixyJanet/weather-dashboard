var cityInputEl = document.getElementById("city-input");
var searchForm = document.getElementById("search-form");
var searchBtn = document.getElementById("search-btn")
var pastSearchedCitiesEl = document.getElementById("search-history")
var clearBtn = document.getElementById("clear-history-button");
var presentDayWeather = document.getElementById("present-day-weather");
var fiveDayForecast = document.getElementById("five-day-forecast");
var searchHistory = [];

function dashboard(e) {
    console.log("dashboard initates")
    e.preventDefault();
    var cityName = cityInputEl.value;
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
            console.log("current data initates")
            var oneCallUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${currentData.coord.lat}&lon=${currentData.coord.lon}&appid=b2da1db112f5ef2d52f8606a017dc730&units=imperial`;
            fetch(oneCallUrl)
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
                    presentDayWeather.innerHTML = 
                    `
                    <ul>
                        <li class="title">
                        ${currentData.name} 👉 
                        <span> ${dayjs().format(" dddd, MMM D YYYY ")} retrieved at ${dayjs().format("  h:mm:ssA")} </span>
                        </li>
                        <li><img src="https://openweathermap.org/img/wn/${currentData.weather[0].icon}@2x.png" /></li>
                        <li>Temperature: ${currentData.main.temp}</li>
                        <li>Wind: ${currentData.wind.speed}</li>
                        <li>Humidity: ${currentData.main.humidity}</li>
                        
                    </ul>
                    `;
                    // <li>UV Index: ${currentData.current.uvi}</li>
                    var cards = "";
                    for (var i = 1; i < 6; i++) {
                        cards = cards +
                        `
                        <ul class="col-12 col-xl-2 day">
                            <li>${dayjs(fiveDayData.list[i]).format(" dddd, MMM D YYYY ")}</li>
                            <li><img src="https://openweathermap.org/img/wn/${fiveDayData.list[i].weather[0].icon}@2x.png" /></li>
                            <li>Temperature: ${fiveDayData.list[i].main.temp}</li>
                            <li>Wind: ${fiveDayData.list[i].wind.speed}</li>
                            <li>Humidity: ${fiveDayData.list[i].main.humidity}</li>
                        </ul>
                        `;
                    }
                    fiveDayForecast.innerHTML = cards;
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

    pastSearchedCitiesEl.innerHTML = cityList;
    var myDashTwo = document.querySelectorAll(".my-2");
    for (var i = 0; i < myDashTwo.length; i++) {
        myDashTwo[i].addEventListener("click", function() {
            displayWeather(this.textContent);
        });
    }
}

displayCity();

searchForm.addEventListener("submit", dashboard);

function clearSearchHistory() {
    console.log("clear cities initates")
    localStorage.clear();
    pastSearchedCitiesEl.innerHTML = "";
    searchHistory = [];
}

clearBtn.addEventListener("click", function() {
    clearSearchHistory();
});



