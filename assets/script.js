


function getGeoLocation() {
    var cityLat;
    var cityLon; 
    var City = document.querySelector("input").value;
    //API url to get city's geolocation
    var urlGeoLoc = "https://api.openweathermap.org/geo/1.0/direct?q=" + City + "&limit=1&appid=a10da6f6b4acf36309c658a9bd76edff";

    //calls the geolocation API from openweathermap
    return fetch(urlGeoLoc)
     .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            console.log("There was an error with Geolocation API call");
        }
     })
     .then(data => { //data is an array of objects and need to access index 0 for lat and lon
        cityLat = data[0].lat;
        cityLon = data[0].lon;
        var Name = data[0].name;
        var State = data[0].state;
        var Country = data[0].country;
        displayLocation(Name, State, Country);
        getCurrWeather(cityLat, cityLon);
     })
     .catch(error => {
        console.error('There was an error with 1st fetch operation', error);
     })

         //API url for the future days forecast weather
         var urlFutureWeather = "https://api.openweathermap.org/data/2.5/forecast?lat=" + cityLat + "&lon=" + cityLon + "&appid=a10da6f6b4acf36309c658a9bd76edff";
}

//gets the Current weather
function getCurrWeather(Lat,Lon) {
    var urlCurrWeather = "https://api.openweathermap.org/data/2.5/onecall?lat=" + Lat + "&lon=" + Lon + "&exclude=minutely,hourly,daily,alerts&units=imperial&appid=4ab78489d29f98fdcfcf8fe40a55555c";
    //calls the current weather API, checks response and catch
    fetch(urlCurrWeather)
     .then(response => {
        if (response.ok) {
            return response.json()
        } else {
            console.log('There was an error with current weather API');
        }
    })
     .then(data => {
        console.log(data);
        displayWeather(data);
    })
     .catch(error => {
        console.error('There was an error with 2nd Fetch operation', error);
    })
}

function displayLocation(Name, State, Country) {
    var weatherBox = document.querySelector('.today-weather');
    if (weatherBox.children.length === 0) { //if there is nothing in the box
        var title = document.createElement('h1');
        title.textContent = Name + ', ' + State + ' ' + Country;
        document.querySelector('.today-weather').append(title);
    } else { 
        weatherBox.firstChild.remove();
        var title = document.createElement('h1');
        title.textContent = Name + ', ' + State + ' ' + Country;
        document.querySelector('.today-weather').append(title);
    }
}

//city name, the date, an icon representation of weather conditions,
//the temperature, the humidity, the wind speed, and the UV index
function displayWeather(data) {
    var city = data.name
    var date = new Date(data.current.dt * 1000); //date is in milliseconds so multiple 1000
    var icon = data.current.weather[0].icon;
    var temp = data.current.temp; //Fahrenheit
    var humid = data.current.humidity; //in percentage %
    var wind = data.current.wind_speed; //metre/sec
    var UV = data.current.uvi;


    //clears the input field
    document.querySelector('input').value = "";
}

//waits for the 'find weather' button to be clicked
document.querySelector("button").addEventListener('click', getGeoLocation);