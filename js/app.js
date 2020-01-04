// added strings for api
var googleAPI = "http://maps.googleapis.com/maps/api/geocode/json?latlng=";
var weatherAPI = "http://api.openweathermap.org/data/2.5/weather?";

//temperatures
var kelvinTemp = 0.0;
var celsiusTemp = 0.0;
var farhenTemp = 0.0;
var isItCelsius = true;

// when document loads, get location
$(document).ready(getLocation);

// function that handles the api calls
function getLocation() {

    // if bad browser
    if (!navigator.geolocation) {
        $('#out').html("<p>Geolocation is not supported by your browser</p>");
        return;
    }

    // if location is succesfully obtained
    function success(position) {
        // get coordinates
        var latitude = position.coords.latitude;
        var longitude = position.coords.longitude;

        //gets google API link
        googleAPI = googleAPI + latitude + "," + longitude + "&sensor=true";

        //gets location info through JSON by google API call
        $.getJSON(googleAPI).done(updateLocation).fail(errLocation);

        //function to get address from JSON
        function updateLocation(json) {
            var locationtext = JSON.stringify(json.results[0].formatted_address).replace(/"/g, "");
            console.log(locationtext);
            $('#locationinfo').html("<h3>" + locationtext + "</h3>");
        }

        // If google API call failed
        function errLocation(jqxhr, textStatus, err) {
            console.log("Location Request Failed: " + textStatus + ", " + err);
        }

        //gets weather api link
        weatherAPI = weatherAPI + "lat=" + latitude + "&lon=" + longitude + "&appid=3fafe423bf2638b8fa7a8077494f6a20";

        //API call to openweather to get JSON info
        $.getJSON(weatherAPI).done(updateWeather).fail(errWeather);

        //gets weather icon info and temperature (Kelvin) from JSON
        function updateWeather(json) {
            var weathermaintext = JSON.stringify(json.weather[0].main).replace(/"/g, "");
            console.log(weathermaintext);
            $('#weathermaininfo').html("<h3>" + weathermaintext + "</h3>");

            var weathertemptext = JSON.stringify(json.main.temp).replace(/"/g, "");
            console.log(weathertemptext);

            kelvinTemp = parseInt(weathertemptext);
            celsiusTemp = Math.round(kelvtinToCelsius(kelvinTemp));
            farhenTemp = Math.round(celsiusToFarhen(celsiusTemp));

            $('#weathertempinfo').html("<h2>" + celsiusTemp + String.fromCharCode(176) + " Celsius </h2>");
            isItCelsius = true;

            var weatheridtext = JSON.stringify(json.weather[0].id).replace(/"/g, "");
            console.log(weatheridtext);

            var weatherid = parseInt(weatheridtext);

            displayIcon(weatherid);
            $('#convert').show();
        };

        // If weather API call failed
        function errWeather(jqxhr, textStatus, err) {
            console.log("Weather Request Failed: " + textStatus + ", " + err);
        }

        //displays icon based off of id from api call
        function displayIcon(weather) {
            if (weather >= 200 && weather < 300) { //thunderstorm
                $('#iconshow').html(`<div class="icon thunder-storm"><div class="cloud"></div><div class="lightning"><div class="bolt"></div><div class="bolt"></div></div></div>`);
            } else if (weather < 500) { //drizzle
                $('#iconshow').html(`<div class="icon sun-shower"><div class="cloud"></div><div class="sun"><div class="rays"></div></div><div class="rain"></div></div>`);
            } else if (weather < 600) { //rain
                $('#iconshow').html(`<div class="icon rainy"><div class="cloud"></div><div class="rain"></div></div>`);
            } else if (weather < 700) { //snow
                $('#iconshow').html(`<div class="icon flurries"><div class="cloud"></div><div class="snow"><div class="flake"></div><div class="flake"></div></div></div>`);
            } else if (weather < 800) { //atmosphere
                $('#iconshow').html(`<div class="icon cloudy"><div class="cloud"></div><div class="cloud"></div></div>`);
            } else if (weather == 800) { //clear
                $('#iconshow').html(`<div class="icon sunny"><div class="sun"><div class="rays"></div></div></div>`);
            } else if (weather < 900) { //clouds
                $('#iconshow').html(`<div class="icon cloudy"><div class="cloud"></div><div class="cloud"></div></div>`);
            } else if (weather < 1000) { //other (extreme + additional)
                $('#iconshow').html(`<div class="icon cloudy"><div class="cloud"></div><div class="cloud"></div></div>`);
            } else { //default
                $('#iconshow').html(`<div class="icon sunny"><div class="sun"><div class="rays"></div></div></div>`);
            }
        }

        //Kelvin to Celsius
        function kelvtinToCelsius(kelvin) {
            return kelvin - 273.15;
        }

        //Celsius to Farhen
        function celsiusToFarhen(celsius) {
            return celsius * 1.8 + 32;
        }
    }

    // if error in obtaining location
    function error() {
        $('#out').html("Unable to retrieve your location");
    }

    // Loading symbol
    $('#out').html("<p>Locating…</p>");

    //gets position
    navigator.geolocation.getCurrentPosition(success, error);
}

//isItCelsius

$('#convert').click(function() {
    if (isItCelsius) {
        $('#weathertempinfo').html("<h2>" + farhenTemp + String.fromCharCode(176) + " Farhenheit </h2>");
        isItCelsius = false;
    } else {
        $('#weathertempinfo').html("<h2>" + celsiusTemp + String.fromCharCode(176) + " Celsius </h2>");
        isItCelsius = true;
    }
});

//Used to stop button focus - bootstrap
$(".btn").mouseup(function() {
    $(this).blur();
})