const apiKey = "4b1c74254d5d4cb1b6273023241806"; // WeatherAPI key
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

// Fetch weather data based on the query (city name or coordinates)
async function search(query) {
  try {
    const response = await fetch(`${baseUrl}?key=${apiKey}&q=${query}&days=3`);
    if (response.ok) {
      const data = await response.json();
      displayCurrent(data.location, data.current);
      displayForecast(data.forecast.forecastday);
    } else {
      console.error("Error fetching weather data");
    }
  } catch (error) {
    console.error("Fetch error:", error);
  }
}

// Display current weather details
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
        <img src="https:${current.condition.icon}" alt="Weather Icon" />
        <span class="my-3">${current.condition.text}</span>
        <div class="bottom d-flex align-items-center gap-3">
          <div class="icon d-flex align-items-center gap-2">
            <img src="image/icon-umberella.png" alt="Umbrella Icon" />
            <p>20%</p>
          </div>
          <div class="icon d-flex align-items-center gap-2">
            <img src="image/icon-wind.png" alt="Wind Icon" />
            <p>18km/h</p>
          </div>
          <div class="icon d-flex align-items-center gap-2">
            <img src="image/icon-compass.png" alt="Compass Icon" />
            <p>East</p>
          </div>
        </div>
      </div>
    `;
    document.getElementById("current-weather").innerHTML = html;
  }
}

// Display weather forecast for the next days
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
        }" class="m-auto mb-2" alt="Forecast Icon" />
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

search("Cairo");
// Get user's location and translate it to a city name using OpenCage API
function getLocationAndTranslate(doSomething) {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        // Use OpenCage Data API to translate coordinates to city name
        fetch(
          `https://api.opencagedata.com/geocode/v1/json?q=${latitude},${longitude}&key=481b030aa64f478bb23578c612db4e2d`
        )
          .then((response) => response.json())
          .then((data) => {
            console.log("Geocoding response:", data); // Debugging line to show the full response
            if (data.results && data.results.length > 0) {
              const city =
                data.results[0].components.city ||
                data.results[0].components.town ||
                "Unknown Location";
              doSomething(city);
            } else {
              doSomething("Unknown Location");
            }
          })
          .catch((error) => {
            console.error("Geocoding error:", error);
            doSomething("Geocoding Error");
          });
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          console.log("User denied geolocation. Defaulting to Cairo.");
          search("Cairo");
        }
      }
    );
  } else {
    console.log("Geolocation is not supported by this browser.");
    search("Cairo");
  }
}

// Function to be called with the city name
function doSomething(city) {
  console.log("User's city:", city);
  search(city); // Call search function with the obtained city
}

// Call the function to initiate the process
getLocationAndTranslate(doSomething);

// Add event listener for search input
document.getElementById("search").addEventListener("keyup", (event) => {
  search(event.target.value);
});
