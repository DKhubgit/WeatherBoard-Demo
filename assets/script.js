
var onecall = config.API_KEY_ONECALL;
var geoLoc = config.API_KEY_LOCATION;

// need an async function to use await, executes asynchronously.
async function initWeather() {
    var City = document.querySelector("input").value;

    //waits for a value (in this case an object) from the resulting promise of the function
    //without an await it will just return the promise (not the actual object)
    var locData = await getGeoLocation(City);
    var data = await getCurrWeather(locData.lat, locData.lon, locData);

    displayWeather(data);

}

function getGeoLocation(City) {
    //API url to get city's geolocation
    var urlGeoLoc = "https://api.openweathermap.org/geo/1.0/direct?q=" + City + "&limit=1&appid=" + geoLoc;

    //calls the geolocation API from openweathermap and returns object
    //if we did not put a return on fetch then the function will return 'undefined'
    return fetch(urlGeoLoc)
     .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            console.log("There was an error with Geolocation API call");
        }
     })
     .then(data => { //data is an array of objects and need to access index 0 for lat and lon
        var locData = {
            lat: data[0].lat,
            lon: data[0].lon,
            name: data[0].name,
            state: data[0].state,
            country: data[0].country
        }
        return locData;
        // displayLocation(Name, State, Country);
        // getCurrWeather(cityLat, cityLon);
     })
     .catch(error => {
        console.error('There was an error with 1st fetch operation', error);
     })
}

//gets the Current weather
function getCurrWeather(Lat,Lon,locData) {
    var urlCurrWeather = "https://api.openweathermap.org/data/2.5/onecall?lat=" + Lat + "&lon=" + Lon + "&exclude=minutely,hourly,daily,alerts&units=imperial&appid=" + onecall;
    //calls the current weather API and returns an object
    return fetch(urlCurrWeather)
     .then(response => {
        if (response.ok) {
            return response.json()
        } else {
            console.log('There was an error with current weather API');
        }
    })
     .then(data => {
        var newData = locData;
        newData.date = new Date(data.current.dt * 1000); //date is in milliseconds so multiple 1000
        newData.icon = data.current.weather[0].icon;
        newData.temp = data.current.temp; //Fahrenheit
        newData.humid = data.current.humidity; //in percentage %
        newData.wind = data.current.wind_speed; //metre/sec
        newData.UV = data.current.uvi;
        return newData;
        // displayWeather(data);
    })
     .catch(error => {
        console.error('There was an error with 2nd Fetch operation', error);
    })
}

//city name, the date, an icon representation of weather conditions,
//the temperature, the humidity, the wind speed, and the UV index
function displayWeather(data) {
    var weatherBox = document.querySelector('.today-weather');
    var tempBox = document.querySelector('.temp-box');
    console.log(data);

    //removes the previous info before display new info
    if (tempBox.children.length !== 0) {
        while (tempBox.firstChild) {
            tempBox.removeChild(temp.firstChild);
        }
    }

    var temp = document.createElement('h1');
    temp.textContent = data.temp;
    temp.setAttribute('id', 'temperature');
    tempBox.append(temp);

    var icon = document.createElement('img');
    icon.setAttribute('id', 'icon');
    icon.setAttribute('src', "http://openweathermap.org/img/wn/" + data.icon + ".png")
    icon.setAttribute('alt', "Weather condition icon")
    tempBox.append(icon);

    var name = document.createElement('h2');
    name.textContent = data.name + ", " + data.state;
    name.setAttribute('id', "city");
    weatherBox.append(name);

    //clears the input field
    document.querySelector('input').value = "";
}

//waits for the 'find weather' button to be clicked
document.querySelector("button").addEventListener('click', initWeather);