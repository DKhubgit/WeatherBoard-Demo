

function getGeoLocation() {
    var userCity = document.querySelector('input').value;
    var cityLat;
    var cityLon; 

    //API url to get city's geolocation
    var urlGeoLoc = "https://api.openweathermap.org/geo/1.0/direct?q=" + userCity + "&limit=1&appid=a10da6f6b4acf36309c658a9bd76edff";

    //calls the geolocation API from openweathermap
    fetch(urlGeoLoc)
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
        getCurrWeather(cityLat, cityLon);
     })
     .catch(error => {
        console.error('There was an error with 1st fetch operation', error);
     })

         //API url for the future days forecast weather
         var urlFutureWeather = "https://api.openweathermap.org/data/2.5/forecast?lat=" + cityLat + "&lon=" + cityLon + "&appid=a10da6f6b4acf36309c658a9bd76edff";
    
    //clears the input field
    document.querySelector('input').value = "";
}

//gets the Current weather
function getCurrWeather(Lat,Lon) {
    var urlCurrWeather = "https://api.openweathermap.org/data/2.5/weather?lat=" + Lat + "&lon=" + Lon + "&appid=4ab78489d29f98fdcfcf8fe40a55555c";
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
    })
     .catch(error => {
        console.error('There was an error with 2nd Fetch operation', error);
    })
}

//waits for the 'find weather' button to be clicked
document.querySelector("button").addEventListener('click', getGeoLocation);