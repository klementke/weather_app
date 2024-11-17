const apiKey = "4eda01a85c6d298921efd47385ac7c92";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?&units=metric&q=";
const forecastApiUrl = "https://api.openweathermap.org/data/2.5/forecast?&units=metric&q=";

const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weatherIcon = document.querySelector(".weather-icon");
const card = document.querySelector(".card");
const forecastButton = document.getElementById("forecastButton");
const forecastElement = document.getElementById("forecast");

async function checkWeather(city) {
    if (!city) { // Check for empty search input
        alert("Please enter a city name!");
        return;
    }

    const response = await fetch(apiUrl + city + `&appid=${apiKey}`);
    if (response.status === 404) {
        document.querySelector(".error").style.display = "block";
        document.querySelector(".weather").style.display = "none";
    } else {
        const data = await response.json();
        console.log(data);

        // Display weather data
        document.querySelector('.city').innerHTML = data.name;
        document.querySelector('.temp').innerHTML = Math.round(data.main.temp) + " °C";
        document.querySelector('.humidity').innerHTML = data.main.humidity + " %";
        document.querySelector('.wind').innerHTML = data.wind.speed + " km/h";

        const iconCode = data.weather[0].icon;
        const iconUrl = `http://openweathermap.org/img/wn/${iconCode}@2x.png`;
        weatherIcon.src = iconUrl;

        // Check if it's day or night
        const isDay = iconCode.endsWith('d');
        card.style.background = isDay
            ? "linear-gradient(#14A6A6, #D99379)"
            : "linear-gradient(#170ce0, #5D4FB0)";

        document.querySelector(".weather").style.display = "block";
        document.querySelector(".error").style.display = "none";

        showForecastButton();
    }
}

let isForecastVisible = false; // State to track forecast visibility

async function getForecast(city) {
    if (!city) {
        alert("Please enter a city name!");
        return;
    }

    if (!isForecastVisible) { // Only fetch data if forecast is hidden
        const response = await fetch(forecastApiUrl + city + `&appid=${apiKey}`);
        if (response.status === 404) {
            document.querySelector(".error").style.display = "block";
            document.querySelector(".weather").style.display = "none";
        } else {
            const data = await response.json();
            console.log(data);

            let forecastHTML = `<h3 class="forecast-title">Forecast for the next 4 Days</h3>`;
            const today = new Date().getDate(); // Get the current day (numeric)

            let dayCount = 0; // To track how many days have been added
            for (let i = 0; i < data.list.length && dayCount < 4; i += 8) {
                const forecast = data.list[i];
                const date = new Date(forecast.dt * 1000);
                
                // Skip today's forecast
                if (date.getDate() === today) {
                    continue;
                }

                forecastHTML += `
                    <div class="forecast-item">
                        <p class="forecast-date"><strong>${date.toLocaleDateString('en-US', { weekday: 'long' })}</strong></p>
                        <p class="forecast-temp">${Math.round(forecast.main.temp)} °C</p>
                        <p class="forecast-humidity"><img class="mini-icon" src="/weather_app/img/humidity.png"> ${forecast.main.humidity.toFixed(0)} %</p>
                        <p class="forecast-wind"><img class="mini-icon" src="/weather_app/img/wind.png"> ${forecast.wind.speed.toFixed(1)} km/h</p>
                    </div>
                `;
                
                dayCount++; // Increment the day count only if it's not today's forecast
            }

            forecastElement.innerHTML = forecastHTML;
        }
    }

    // Toggle forecast visibility
    if (isForecastVisible) {
        forecastElement.style.display = "none";
        forecastButton.innerText = "Show Forecast";
    } else {
        forecastElement.style.display = "block";
        forecastButton.innerText = "Hide";
    }

    isForecastVisible = !isForecastVisible;
}



function showForecastButton() {
    forecastButton.style.display = 'inline-block';
}

searchBtn.addEventListener("click", () => {
    checkWeather(searchBox.value);
});

searchBox.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        searchBtn.click();
    }
});

forecastButton.addEventListener("click", () => {
    getForecast(searchBox.value);
});

