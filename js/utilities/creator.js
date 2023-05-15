function locationCard(header) {
  return `<h1 class="header__title">${header.title}</h1>
        <p class="header__content" title='${header.locationType}'>
        <span class="header__titleContent">Location type: </span>${header.locationType}</p>
        <p class="header__content" title='${header.timezone}'>
        <span class="header__titleContent">Timezone: </span>${header.timezone}</p>`;
}
function weatherCard(location) {
  let options = {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  };
  return `<section class="card">
          <h1 class="card__title">${new Date(
            location.applicableDate
          ).toLocaleDateString('en-US', options)}</h1>
          <img
            src="https://www.metaweather.com/static/img/weather/png/${
              location.weatherStateAbbr
            }.png"
            alt="state icon"
            class="card__icon"
          />
          <p class="card__subTitle">${location.weatherStateName}</p>
          <div class="card__generalities">
            <p class="generalities_content"><span class="content__title">Min-temp: 
            </span> ${location.minTemp.toFixed(2)} &#176C</p>
            <p class="generalities_content"><span class="content__title">Max-temp: 
            </span> ${location.maxTemp.toFixed(2)} &#176C</p>
            <p class="generalities_content"><span class="content__title">Humidity: 
            </span> ${location.humidity}%</p>
            <p class="generalities_content"><span class="content__title">Predictability: 
            </span> ${location.predictability}%</p>
          </div>
        </section>`;
}
function autocompleteItem(item) {
  return `<li class="list__item" id="${item.woeid}">${item.title}</li>`;
}

function message(message) {
  return `<p class="container__weather--empty">${message}</p>`;
}
export { locationCard, weatherCard, autocompleteItem, message };
