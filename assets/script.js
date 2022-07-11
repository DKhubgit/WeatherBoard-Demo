
var onecall = config.API_KEY_ONECALL;
var geoLoc = config.API_KEY_LOCATION;
var forecast = config.API_KEY_FORECAST;

var userHistory = JSON.parse(localStorage.getItem("WeatherHistory"));
displayHistory();
// need an async function to use await, executes asynchronously.
async function initWeather(event) {
    event.preventDefault();
    var City = document.querySelector("input").value;

    //waits for a value (in this case an object) from the resulting promise of the function
    //without an await it will just return the promise and not the actual object
    var locData = await getGeoLocation(City);
    var data = await getCurrWeather(locData.lat, locData.lon, locData);
    var otherData = await getForecast(locData.lat, locData.lon); //this returns an array of objects
    displayWeather(data);
    displayForecast(otherData);

    addHistory(locData);

    //clears the input field
    document.querySelector('input').value = "";
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
     })
     .catch(error => {
        console.error('There was an error with 1st fetch operation', error);
     })
}

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
        var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        var newData = locData;
        var date = new Date(data.current.dt * 1000); //date is in milliseconds so multiple 1000
        newData.date = '(' + (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear() + ') ' + days[date.getDay()];
        newData.icon = data.current.weather[0].icon;
        newData.temp = data.current.temp; //Fahrenheit
        newData.humid = data.current.humidity; //in percentage %
        newData.wind = data.current.wind_speed; // miles/hour units=imperial
        newData.UV = data.current.uvi;
        newData.main = data.current.weather[0].main;
        newData.des = data.current.weather[0].description;
        return newData;
    })
     .catch(error => {
        console.error('There was an error with 2nd Fetch operation', error);
    })
}

function getForecast(lat,lon) {
    var url = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&units=imperial&cnt=50&appid=" + forecast;

    return fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                console.log('There was an error with Forecast API');
            }
        })
        .then(data => {
            var forecast = [];
            var count = 0;
            for (var i = 0; i < data.list.length; i = i + 8) {
                forecast[count] = {
                    date: data.list[i].dt_txt,
                    icon: data.list[i].weather[0].icon,
                    wind: data.list[i].wind.speed, //miles/hour units=imperial
                    temp: data.list[i].main.temp,
                    humid: data.list[i].main.humidity,
                    main: data.list[i].weather[0].main,
                    des: data.list[i].weather[0].description
                }
                count++;
            }
            return forecast;
        })
        .catch(error => {
            console.error('There was an error with 3rd Fetch operation', error);
        })
}

//city name, the date, an icon representation of weather conditions,
//the temperature, the humidity, the wind speed, and the UV index
function displayWeather(data) {
    var weatherBox = document.querySelector('.today-weather');
    var tempBox = document.querySelector('.temp-box');
    if (weatherBox.children.length !== 0) {
        while (weatherBox.firstChild) {
            weatherBox.removeChild(weatherBox.firstChild);
        }
    }

    var tempBox = document.createElement('div');
    tempBox.setAttribute('class', "temp-box");
    weatherBox.append(tempBox);

    var temp = document.createElement('h1');
    temp.textContent = Math.floor(data.temp) + "°F ";
    temp.setAttribute('id', 'temperature');
    tempBox.append(temp);

    var icon = document.createElement('img');
    icon.setAttribute('id', 'icon');
    icon.setAttribute('src', "http://openweathermap.org/img/wn/" + data.icon + ".png")
    icon.setAttribute('alt', "Weather condition icon")
    tempBox.append(icon);

    var name = document.createElement('h2');
    name.textContent = data.name + ", " + data.state + ' ' + data.date;
    name.setAttribute('id', "city");
    weatherBox.append(name);

    var humid = document.createElement('h3');
    humid.setAttribute('class', 'small-data');
    humid.textContent = "Humidity: " + data.humid + "%";
    weatherBox.append(humid);

    var wind = document.createElement('h3');
    wind.setAttribute('class', 'small-data');
    wind.textContent = "Wind Speed: " + data.wind + " mph";
    weatherBox.append(wind);

    var uvi = document.createElement('h3');
    uvi.setAttribute('class', 'small-data index');
    var index = Math.floor(data.UV);
    uvi.textContent = "UV index: " + data.UV;
    weatherBox.append(uvi);
    if (index >= 0 && index <= 2) {
        var uviBox = document.querySelector('.index');
        var colorBox = document.createElement('div');
        colorBox.setAttribute('id', 'favorable');
        colorBox.textContent = "Favorable"
        uviBox.append(colorBox);
    } else if (index > 2 && index < 6) {
        var uviBox = document.querySelector('.index');
        var colorBox = document.createElement('div');
        colorBox.setAttribute('id', 'moderate');
        colorBox.textContent = "Moderate";
        uviBox.append(colorBox);
    } else {
        var uviBox = document.querySelector('.index');
        var colorBox = document.createElement('div');
        colorBox.setAttribute('id', 'severe');
        colorBox.textContent = "Severe";
        uviBox.append(colorBox);
    }

    var des = document.createElement('h3');
    des.setAttribute('class', 'small-data');
    des.textContent = "Condition: " + data.main + ' / ' + data.des;
    weatherBox.append(des);
    return;
}

//displays the 5-day forecast with the arrays of objects passed in.
//date, icon, wind, temp, humid
function displayForecast(data) {
    var otherBox = document.querySelector('.other-weather');

    if (otherBox.firstChild) {
        while (otherBox.firstChild) {
            otherBox.removeChild(otherBox.firstChild);
        }
    }

    for (var p = 0; p < data.length; ++p) {
        var smallBox = document.createElement('div');
        smallBox.setAttribute('class', 'entry-box' )
        otherBox.append(smallBox);

        var tempIcon = document.createElement('div')
        tempIcon.setAttribute('class', 'small-box');
        smallBox.append(tempIcon);

        var temp = document.createElement('h2');
        temp.textContent = Math.floor(data[p].temp) + "°F ";
        tempIcon.append(temp);

        var icon = document.createElement('img');
        icon.setAttribute('id', 'small-icon');
        icon.setAttribute('src', "http://openweathermap.org/img/wn/" + data[p].icon + ".png")
        icon.setAttribute('alt', "Weather condition icon")
        tempIcon.append(icon);

        var date = document.createElement('h4');
        var text = data[p].date.split(" ");
        date.textContent = '(' + text[0] + ')';
        date.setAttribute('class', 'tiny-data');
        smallBox.append(date);

        var humid = document.createElement('h4');
        humid.textContent = 'Humidity: ' + data[p].humid + '%';
        humid.setAttribute('class', 'tiny-data');
        smallBox.append(humid);

        var wind = document.createElement('h4');
        wind.textContent = 'Wind: ' + data[p].wind + ' mph';
        wind.setAttribute('class', 'tiny-data');
        smallBox.append(wind);

        var main = document.createElement('h4');
        main.textContent = data[p].main + ' / ' + data[p].des;
        main.setAttribute('class', 'tiny-data');
        smallBox.append(main);
    }
    return;
}

function displayHistory() {
    var historyBox = document.querySelector('.history-box');
    if (userHistory === null) {
        return;
    }
    for (x = 0; x < userHistory.length; ++x) {
        var item = document.createElement('div')
        item.textContent = userHistory[x];
        item.setAttribute('class', 'item');
        historyBox.append(item);
    }
    return;
}

function addHistory(locData) {
    var historyBox = document.querySelector('.history-box');
    var text = locData.name + ', ' + locData.state;
    if (userHistory !== null) { //checks for duplicates
        if (userHistory.includes(text)) {
            return;
        }
    }
    if (historyBox.children.length > 5) { //limit number of history items
        historyBox.removeChild(historyBox.children[1]);
    }
    var item = document.createElement('div')
    item.textContent = text;
    item.setAttribute('class', 'item');
    historyBox.append(item);

    addToStorage(locData);

    return;
}

function addToStorage(locData) {
    var entry = locData.name + ', ' + locData.state;
    if (userHistory === null) { // needs to go first so that there is no null reading
        userHistory = [entry];
    } else if (userHistory.includes(entry)) { //checks for duplicates
        return;
    } else {
        if (userHistory.length > 4) { // limit number of history items
            userHistory.shift();
            userHistory.push(entry);
        } else {
            userHistory.push(entry);
        }
    }
    localStorage.setItem('WeatherHistory', JSON.stringify(userHistory));
    return;
}

//waits for the 'find weather' button to be clicked
document.querySelector("button").addEventListener('click', initWeather);

//maybe add a event listener for when the "enter" key is pressed