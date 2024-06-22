const apiKey = "4b1c74254d5d4cb1b6273023241806";
const baseUrl = "https://api.weatherapi.com/v1/forecast.json";
const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// !Fetch weather data
async function search(query) {
  try {
    const response = await fetch(`${baseUrl}?key=${apiKey}&q=${query}&days=3`);
    if (response.ok) {
      const data = await response.json();
      displayCurrent(data.location, data.current);
      displayForecast(data.forecast.forecastday);
    } else {
      console.error("Error fetching data");
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

// !Display current weather
function displayCurrent(location, current) {
  if (current) {
    const date = new Date(current.last_updated.replace(" ", "T"));
    const html = `
      <div class="top d-flex justify-content-between align-items-center p-2">
        <p>${days[date.getDay()]}</p>
        <p>${date.getDate()} ${monthNames[date.getMonth()]}</p>
      </div>
      <div class="center p-3">
        <h4>${location.name}</h4>
        <h2 class="text-white my-3">${current.temp_c}<sup>o</sup>C</h2>
        <img src="https:${current.condition.icon}" alt="" />
        <span class="my-3">${current.condition.text}</span>
        <div class="bottom d-flex align-items-center gap-3">
          <div class="icon d-flex align-items-center gap-2">
            <img src="image/icon-umberella.png" alt="" />
            <p>20%</p>
          </div>
          <div class="icon d-flex align-items-center gap-2">
            <img src="image/icon-wind.png" alt="" />
            <p>18km/h</p>
          </div>
          <div class="icon d-flex align-items-center gap-2">
            <img src="image/icon-compass.png" alt="" />
            <p>East</p>
          </div>
        </div>
      </div>
    `;
    document.getElementById("current-weather").innerHTML = html;
  }
}

// !Display weather forecast
function displayForecast(forecastDays) {
  for (let i = 1; i < forecastDays.length; i++) {
    const date = new Date(forecastDays[i].date.replace(" ", "T"));
    const html = `
      <div class="top p-2">
        <p>${days[date.getDay()]}</p>
      </div>
      <div class="center p-3">
        <img src="https:${
          forecastDays[i].day.condition.icon
        }" class="m-auto mb-2" alt="" />
        <h3 class="text-white">${
          forecastDays[i].day.maxtemp_c
        }<sup>o</sup>C</h3>
        <p class="my-2">${forecastDays[i].day.mintemp_c}<sup>o</sup>C</p>
        <span class="mt-3">${forecastDays[i].day.condition.text}</span>
      </div>
    `;
    document.getElementById(`forecast-day-${i}`).innerHTML = html;
  }
}

// !Add event listener for search input
document.getElementById("search").addEventListener("keyup", (event) => {
  search(event.target.value);
});

// !Initial search
search("cairo");
