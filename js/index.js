$("document").ready(function() {
  getData();
  //getWeatherInfo('-7.3384172','112.7572248');
});

// API Call to get location data based on user's IP address
function getData() {

  // Using ipinfo.io API
  var baseURL = "https://ipinfo.io";
  var request = "/json";

  // Use jQuery AJAX method to request JSON from server
  $.ajax({
    url: baseURL + request,
    dataType: "jsonp",

    // If we receive a reply from server
    success: function(response) {

      $("#location").text(""); // Clear location DIV Field
      $("#location").append("<i></i>"); // Add glyphicon for location field
      $("#location i").addClass("glyphicon glyphicon-globe");
      $("#location").append(response.city + ", " + response.country); // Extract data from JSON string & input location data  
      var locationData = response.loc.split(","); // Split loc into Longitude & Latitude
      getWeatherInfo(position.coords.latitude, position.coords.longitude); // Pass result into gerWeatherInfo()

    },
    // If we FAIL to receive a reply from server
    error: function(xhr, status, error) {
      $("#location").text("Unable to obtain IP Address"); // Report error message & terminate script                
      $("#wind").text("");
      $("#weather").text("");
      return
    }
  });
}

// API Call to get location data based on user's location coordinates
function getWeatherInfo(longitude, latitude) {

  // Using openweathermap API
  var baseURL = "https://api.openweathermap.org/data/2.5";
  var request = "/weather?lat=" + longitude + "&lon=" + latitude;
  var API_Key = "&APPID=06d45a853a7b0beeeb3d1fbde62487aa";

  // Use jQuery AJAX method to request JSON from server
  $.ajax({
    url: baseURL + request + API_Key,
    dataType: "jsonp",

    // If we receive a reply from server
    success: function(response) {

      $("#temperature").text(""); // Clear temperature DIV Field
      $("#temperature").append("<i></i>"); // Add weatherIcon for temperature field
      $("#temperature i").addClass("wi wi-thermometer");
      $("#temperature").append(convertTemperature(response.main.temp, "C")); // Extract data from JSON string, convert it & input temp data  
      $("#temperature").append("<i></i>"); // Add weatherIcon for temperature field (units)
      $("#temperature i").addClass("wi wi-celsius");

      $("#wind").text(""); // Clear wind DIV Field
      $("#wind").append("<i></i>"); // Add weatherIcon for wind field
      $("#wind i").addClass("wi wi-strong-wind");
      $("#wind").append(getCardinalDirection(response.wind.deg) + " " + (response.wind.speed * 3.6).toFixed(1) + "km/h"); // Extract data from JSON string, convert it & input wind data 

      changeWeatherIcon(response.weather[0].main); // Change weatherIcon for weather field
      $("#weather").append(titleCase(response.weather[0].description)); // Extract data from JSON string, convert it & input weather description
    },
    // If we FAIL to receive a reply from server
    error: function(xhr, status, error) {
      $("#wind").text("Fail to retrieve server data"); // Replace fields with error message
      $("#weather").text("");
    }
  });
}

// Converts the raw temperature data extracted from JSON API response into appropriate units
// "C" = Celsius, "F" = Fahrenheit, "K" = Kelvin
function convertTemperature(tempRaw, unit) {
  if (unit == "C")
    return (tempRaw - 273.15).toFixed(1).toString();
  else if (unit == "F")
    return ((tempRaw - 273.15) * 9 / 5 + 32).toFixed(1).toString() + "°F";
  else
    return tempRaw.toFixed(1).toString() + "K";
}

// Obtained from: https://gist.github.com/basarat/4670200
// Given "0-360" returns the nearest cardinal direction "N/NE/E/SE/S/SW/W/NW/N" 
function getCardinalDirection(angle) {

  var directions = 8;
  var degree = 360 / directions;
  angle = angle + degree / 2;

  if (angle >= 0 * degree && angle < 1 * degree)
    return "N";
  if (angle >= 1 * degree && angle < 2 * degree)
    return "NE";
  if (angle >= 2 * degree && angle < 3 * degree)
    return "E";
  if (angle >= 3 * degree && angle < 4 * degree)
    return "SE";
  if (angle >= 4 * degree && angle < 5 * degree)
    return "S";
  if (angle >= 5 * degree && angle < 6 * degree)
    return "SW";
  if (angle >= 6 * degree && angle < 7 * degree)
    return "W";
  if (angle >= 7 * degree && angle < 8 * degree)
    return "NW";
}

// Changes the weatherIcon in the weather field depending on the weatherType extracted from the JSON string
function changeWeatherIcon(weatherType) {

  weatherType = weatherType.toLowerCase();
  $("#weather").text("");
  $("#weather").append("<i></i>");

  if (weatherType.indexOf("clouds") != -1) {
    $("#weather i").addClass("wi wi-cloudy");
  } else if (weatherType.indexOf("rain") != -1) {
    $("#weather i").addClass("wi wi-rain");
  } else if (weatherType.indexOf("thunderstorm") != -1) {
    $("#weather i").addClass("wi wi-thunderstorm");
  } else if (weatherType.indexOf("snow") != -1) {
    $("#weather i").addClass("wi wi-snow");
  } else if (weatherType.indexOf("mist") != -1) {
    $("#weather i").addClass("wi wi-smoke");
  } else {
    $("#weather i").addClass("wi wi-day-sunny");
  }

}

// Changes 1st Char of each word (from input string) into Upper Case
function titleCase(str) {

  var array = str.split(" ");

  for (var i = 0; i < array.length; i++) {

    var temp_array = array[i].split(''); // "ab" => "a","b"
    temp_array[0] = temp_array[0].toUpperCase(); // "a","b" => "A","b"

    for (var j = 1; j < temp_array.length; j++)
      temp_array[j] = temp_array[j].toLowerCase(); // "a","b" => "A","b"

    array[i] = temp_array.join(''); // "A","b" => "Ab"
  }

  return array.join(' ');
}