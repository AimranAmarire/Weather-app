
const searchBtn = document.querySelector('.search-btn')
const cityInp = document.querySelector('.city-inp')
const locationEl = document.querySelector('.location')
const datetimeEl = document.querySelector('.datetime')
const currentWeatherTempEl = document.querySelector('.weather-info-container .temp')
const currentWeatherDescEl = document.querySelector('.weather-info-container .desc')
const windContainerEl = document.querySelector('.wind-container .data')
const humidityContainerEl = document.querySelector('.humidity-container .data')
const errorSearchEl = document.querySelector('.error-search')

const hourlyWeatherContainerEl = document.querySelector('.hourly-weather-container')

const dailyWeatherContainer = document.querySelector('.daily-weather')
async function getWeatherData(city){
  if (!city.trim()) return;
  searchBtn.innerHTML=`
    <div class="loader">
      <i class="fa-solid fa-hourglass-end"></i>
    </div>
  `

  let response
  try{
    response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=5670bb9fa05e816589c164d7ba8c288f`)
    console.log(response)
  }catch{
    searchBtn.innerHTML="Search"
    errorSearchEl.innerHTML = 'Check your internet connection, then try again.'
    setTimeout(()=>{
      errorSearchEl.innerHTML =''
    },3000)
    return
  }
  if(!response.ok){
    errorSearchEl.innerHTML = "We couldn't find that city. Double-check the name and try again."
    setTimeout(()=>{
      errorSearchEl.innerHTML =''
    },3000)
    searchBtn.innerHTML="Search"
    return
  }
  let weather = await response.json()
  let datetime = new Date(weather.list[0].dt_txt)
  let formatedDate = datetime.toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric'})

  locationEl.innerHTML = `
    <i class="fa-solid fa-location-dot"></i>
    ${weather.city.name} , ${weather.city.country}
  `;

  let icon = weather.list[0].weather[0].icon;
  let temp = Math.ceil(weather.list[0].main.temp);
  currentWeatherTempEl.innerHTML = `
  <img src="https://openweathermap.org/img/wn/${icon}@4x.png">
  ${temp}°C
  `
  
  let desc = weather.list[0].weather[0].description;

  currentWeatherDescEl.innerHTML = desc

  let wind = weather.list[0].wind.speed
  windContainerEl.innerHTML = `${wind}Km/h`
  
  let humidity = weather.list[0].main.humidity
  humidityContainerEl.innerHTML = `${humidity}%`
  

  datetimeEl.innerHTML = `(${formatedDate})`

  let hourlyWeatherHtml = ''
  weather.list.forEach(element => {
    let elementDateTime = new Date(element.dt_txt);
    let reformatedHour = elementDateTime.toLocaleTimeString('en-US',{hour:'numeric',hour12:false});

    let elementIcon = element.weather[0].icon

    let elementTemp = Math.ceil(element.main.temp)
    hourlyWeatherHtml += `
      <div class="weather-element">
        <div class="time">${reformatedHour}</div>
        <img src="https://openweathermap.org/img/wn/${elementIcon}@4x.png">
        <div class="temp">${elementTemp}°C</div>
      </div>
    `
  });

  hourlyWeatherContainerEl.innerHTML = hourlyWeatherHtml

  const dailyWeather = weather.list.filter(element => element.dt_txt.includes("12:00:00"));
  let dailyWeatherHtml = ''
  dailyWeather.forEach(element => {
    const elementIcon = element.weather[0].icon;
    const elementTemp = Math.ceil(element.main.temp)
    const elementWeatherDesc = element.weather[0].description
    const elementDateTime = new Date(element.dt_txt);
    const weekday = elementDateTime.toLocaleDateString('en-US',{weekday:'long'});
    dailyWeatherHtml += `
      <div class="day-weather">

        <div class="icon">
          <img src="https://openweathermap.org/img/wn/${elementIcon}@4x.png" alt="">
        </div>

        <div class="data">
          <div class="day">${weekday}</div>
          <div class="desc">${elementWeatherDesc}</div>
        </div>

        <div class="temp">
          ${elementTemp}°
        </div>

      </div>
    `
  })
  dailyWeatherContainer.innerHTML = dailyWeatherHtml;

  searchBtn.innerHTML='Search'
}



searchBtn.addEventListener('click',()=>{
  getWeatherData(cityInp.value);
})
cityInp.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') getWeatherData(cityInp.value);
});

getWeatherData('casablanca');