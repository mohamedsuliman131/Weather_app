var url1 = "https://geocoding-api.open-meteo.com/v1/search";
var url2 = "https://api.open-meteo.com/v1/forecast";

window.addEventListener("load", function () {
  var x = navigator.geolocation;
  if (x) {
    x.getCurrentPosition(
      function (pos) {
        var lat = pos.coords.latitude;
        var lon = pos.coords.longitude;
        getWeather(lat, lon, null);
      },
      function () {
        searchCity();
      },
    );
  } else {
    searchCity();
  }
});

function searchCity() {
  var input = document.getElementById("cityInput");
  var city = input.value;

  if (city == "") {
    return;
  }

  document.getElementById("loading").style.display = "block";
  document.getElementById("error").style.display = "none";

  var req = new XMLHttpRequest();
  var fullUrl = url1 + "?name=" + city + "&count=1&language=en&format=json";

  req.open("GET", fullUrl, true);

  req.onreadystatechange = function () {
    if (req.readyState == 4) {
      if (req.status == 200) {
        var data = JSON.parse(req.responseText);
        if (data.results && data.results.length > 0) {
          var r = data.results[0];
          var lat = r.latitude;
          var lon = r.longitude;
          var name = r.name;
          getWeather(lat, lon, name);
        } else {
          document.getElementById("error").textContent = "City not found";
          document.getElementById("error").style.display = "block";
          document.getElementById("loading").style.display = "none";
          document.getElementById("weather").style.display = "none";
        }
      } else {
        document.getElementById("error").textContent = "Error happened";
        document.getElementById("error").style.display = "block";
        document.getElementById("loading").style.display = "none";
        document.getElementById("weather").style.display = "none";
      }
    }
  };

  req.send();
}

function getWeather(lat, lon, cityName) {
  var req = new XMLHttpRequest();
  var fullUrl =
    url2 +
    "?latitude=" +
    lat +
    "&longitude=" +
    lon +
    "&daily=temperature_2m_max,temperature_2m_min,weather_code,precipitation_probability_max";

  req.open("GET", fullUrl, true);

  req.onreadystatechange = function () {
    if (req.readyState == 4) {
      if (req.status == 200) {
        var data = JSON.parse(req.responseText);
        var daily = data.daily;

        var city = cityName;
        if (city == null) {
          city = "Your Location";
        }

        document.getElementById("cityName").textContent = city;

        for (var i = 0; i < 3; i++) {
          var d = new Date();
          d.setDate(d.getDate() + i);
          var dateStr = d.toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
          });
          document.getElementById("dateDisplay" + i).textContent = dateStr;

          var tMax = Math.round(daily.temperature_2m_max[i]);
          var tMin = Math.round(daily.temperature_2m_min[i]);
          var tAvg = Math.round((tMax + tMin) / 2);
          var cond = daily.weather_code[i];
          var condText = getCondition(cond);
          var rain = daily.precipitation_probability_max[i];

          document.getElementById("temperature" + i).textContent = tAvg + "°C";
          document.getElementById("condition" + i).textContent = condText;
          document.getElementById("tempMax" + i).textContent = tMax + "°C";
          document.getElementById("tempMin" + i).textContent = tMin + "°C";
          document.getElementById("rain" + i).textContent = rain + "%";
        }

        document.getElementById("weather").style.display = "block";
        document.getElementById("loading").style.display = "none";
        document.getElementById("error").style.display = "none";
      } else {
        document.getElementById("error").textContent = "Failed to get weather";
        document.getElementById("error").style.display = "block";
        document.getElementById("loading").style.display = "none";
        document.getElementById("weather").style.display = "none";
      }
    }
  };

  req.send();
}

function getCondition(x) {
  if (x == 0) return "Clear";
  if (x == 1) return "Mainly Clear";
  if (x == 2) return "Partly Cloudy";
  if (x == 3) return "Overcast";
  if (x == 45) return "Foggy";
  if (x == 48) return "Foggy";
  if (x == 51) return "Light Drizzle";
  if (x == 53) return "Moderate Drizzle";
  if (x == 55) return "Dense Drizzle";
  if (x == 61) return "Slight Rain";
  if (x == 63) return "Moderate Rain";
  if (x == 65) return "Heavy Rain";
  if (x == 71) return "Slight Snow";
  if (x == 73) return "Moderate Snow";
  if (x == 75) return "Heavy Snow";
  if (x == 77) return "Snow Grains";
  if (x == 80) return "Slight Rain Showers";
  if (x == 81) return "Moderate Rain Showers";
  if (x == 82) return "Violent Rain Showers";
  if (x == 85) return "Slight Snow Showers";
  if (x == 86) return "Heavy Snow Showers";
  if (x == 95) return "Thunderstorm";
  if (x == 96) return "Thunderstorm with Hail";
  if (x == 99) return "Thunderstorm with Hail";
  return "Unknown";
}

document.addEventListener("DOMContentLoaded", function () {
  var input = document.getElementById("cityInput");
  input.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      searchCity();
    }
  });
});
