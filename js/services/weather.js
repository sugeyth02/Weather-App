const API_URL = 'https://www.metaweather.com/api/';
//heroku repository that acts like a bridge in order to avoid the CORS
const CORS_URI = 'https://weatherproxyweek02.herokuapp.com/';

async function getLocations(string) {
  try {
    const response = await fetch(
      `${CORS_URI}${`${API_URL}location/search/?query=${string}`}`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(`${error.message}`);
  }
}

async function get5dayForecast(woied) {
  try {
    const response = await fetch(
      `${CORS_URI}${`${API_URL}location/${woied}/`}`
    );
    let data = await response.json();
    const result = data.consolidated_weather.map((e) => ({
      weatherStateName: e.weather_state_name,
      weatherStateAbbr: e.weather_state_abbr,
      applicableDate: e.applicable_date,
      minTemp: e.min_temp,
      maxTemp: e.max_temp,
      humidity: e.humidity,
      predictability: e.predictability,
    }));
    return result;
  } catch (error) {
    throw new Error(`${error.message}`);
  }
}
async function getHeaderLocation(id) {
  try {
    const response = await fetch(`${CORS_URI}${`${API_URL}location/${id}/`}`);
    let data = await response.json();
    const header = {
      title: data.title,
      locationType: data.location_type,
      timezone: data.timezone,
    };
    return header;
  } catch (error) {
    throw new Error(`${error.message}`);
  }
}
export { getLocations, get5dayForecast, getHeaderLocation };
