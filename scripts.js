let Id = "d10af5e69d3a63af594b8e984295139c";
let units="metric";
let zoom = 3;

let daysArr = [];
let tempArr = [];

function getCurrentWeather(searchText)
{
    console.log("getting current weather for: " + searchText);
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${searchText}&APPID=${Id}&units=${units}`)
    .then(response => {
        if(!response.ok) {
            console.log(response.statusText);
            alert(response.statusText);
            throw new Error("Weather data error.");
        }
        return response.json();
    }).then(response => {
        daysArr = [];
        tempArr = [];
        console.log("Got current weather for: " + searchText);
        console.log(response);
        getWeatherForecast(searchText);
        showCurrentWeather(response);
        
        
        
    })
    .catch( error => "ERROR");
}




function showCurrentWeather(response) {
    
    console.log("Showing current weather");
    let iconElement = document.getElementById("currentIcon");
        iconElement.src = "https://openweathermap.org/img/wn/"+ response.weather[0].icon  +".png";
    
    let temperatureElement = document.getElementById("currentTemp");
        temperatureElement.innerHTML = Math.round(response.main.temp*10)/10 + "°C";
    
    let cityElement = document.getElementById("currentCity")
        cityElement.innerHTML = response.name;
    
    let descElement = document.getElementById("currentDesc");
        descElement.innerHTML = response.weather[0].description;
    
    let flElement = document.getElementById("currentFeelsLike");
        flElement.innerHTML = Math.round(response.main.feels_like) + "°C";

    let humidityElement = document.getElementById("currentHumidity");
        humidityElement.innerHTML = response.main.humidity + "%";
    
    let windElement = document.getElementById("currentWind");
        windElement.innerHTML = Math.round(response.wind.speed) + " km/h";
    
   
   
    
    let sunrise = new Date(response.sys.sunrise*1000);
    let sunriseElement = document.getElementById("currentSunrise");
        sunriseElement.innerHTML =sunrise.getHours()+":"+addZero(sunrise.getMinutes());

    
    let sunset = new Date(response.sys.sunset*1000);
    let sunsetElement = document.getElementById("currentSunset");
        sunsetElement.innerHTML =sunset.getHours()+":"+addZero(sunset.getMinutes());   
    

    document.getElementById("currentWrapper").style.display = "inline-block";
    
    daysArr.push("NOW");
    tempArr.push(Math.round(response.main.temp));
}

function getWeatherForecast(searchText)
{
    console.log("getting forecast for: " + searchText);
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${searchText}&APPID=${Id}&units=${units}`)
    .then(response => {
        if(!response.ok) {
            alert("FORECAST DATA: " + response.statusText);
            throw new Error("Forecast data error.");
        }
        return response.json();
    }).then(response => {
        console.log("Got forecast for: " + searchText);
        console.log(response);
        showWeatherForecast(response);
        drawChart();
        
        
    })
    .catch( error => "ERROR");
}

function getDayName(date)
{
    
    
        var dayName;

        var day = date.getUTCDay()

        if(day == 0)
        {
            dayName = "SUN";
        }
        else if(day == 1)
        {
            dayName = "MON";
        }
        else if(day == 2)
        {
            dayName = "TUE";
        }
        else if(day == 3)
        {
            dayName = "WED";
        }
        else if(day == 4)
        {
            dayName = "THU";
        }
        else if(day == 5)
        {
            dayName = "FRI";
        }
        else if(day == 6)
        {
            dayName = "SAT";
        }

             
    return dayName;
}

function showWeatherForecast(response)
{    
    var j = 1;
    for(var i = 0; i < response.list.length; i++) 
    {
        
        var item = response.list[i];
        var date = new Date(item.dt*1000);
        if(date.getUTCHours() == 12)
        {
            var dayName = getDayName(date);

            var dayElement = document.getElementById("f"+j+"day")
            dayElement.innerHTML = dayName;

            var imgElement = document.getElementById("f"+j+"img");
            imgElement.src = "https://openweathermap.org/img/wn/"+ item.weather[0].icon  +".png";

            var tempElement = document.getElementById("f"+j+"temp");
            tempElement.innerHTML = Math.round(item.main.temp) + "°C";

            daysArr.push(dayName);
            tempArr.push(Math.round(item.main.temp));

            j++;
            if(j == 6)
            {
                return;
            }
        }
            
    }
}

function drawChart(labels, data)
{
    var ctx = document.getElementById('lineChart').getContext('2d');
    var max = Math.max.apply(Math, data) +2;
    var min =  Math.min.apply(Math, data) - 2;
    var chart = new Chart(ctx, {
    type: 'bar',


    data: {
        
        labels: daysArr,
        datasets: [{
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgb(0,100,255)',
            data: tempArr
        }]
    },
        
    options: 
    {
        responsive:true,
        scales: 
        {
            yAxes: 
            [{
                scaleLabel:
                {
                    display:true,
                    labelString: "°C",
                    fontSize:30

                },
                ticks: 
                {
                    fontSize: 45,
                    suggestedMin: 0,
                    suggestedMax: 20 
                }
            }],
            xAxes: 
            [{

                ticks: 
                {
                    fontSize: 40,
                    padding:10
                }
            }]
        },
        legend: {
            display: false
        }
        
    }
});
    

}

function addZero(x)
{
    if(x<10)
        {
            x = "0" + x;
        }
    return x;
}

function validateInput(text) {
    var regex = "^([a-zA-Z0-9- ]+)+$";
    if(text.match(regex)) {
        return true;
    }
    else {
        alert("The text you entered contains invalid characters")
        return false;
    }
}

document.getElementById("searchButton").addEventListener("click",function(){
    let city = document.getElementById("searchCity").value;
    if(city) {
        if(validateInput(city)) {
            getCurrentWeather(city);
        }
    }else {
        alert("Please specify city name")
    }
});

