import * as service from './services/weather.js';
import * as utilities from './utilities/hof.js';
import * as creator from './utilities/creator.js';

const autocompleteBox = document.getElementById('autoCompleteBox');
const searchInput = document.getElementsByName('search')[0];
const searchContainer = document.getElementsByClassName('searchContainer')[0];
const list = document.getElementsByClassName('autoComplete__list')[0];
const containerHeader = document.getElementsByClassName('container__header')[0];
const searchButtonIcon = document.getElementsByClassName('button__icon')[0];
const searchButton = document.getElementsByClassName('searchBar_button')[0];
const weatherContainer =
  document.getElementsByClassName('container__weather')[0];
let windowWidth = window.innerWidth;

//clean the searchbar animation in order to keep the responsive
function clearSearchBarSize() {
  if (window.innerWidth <= 700) {
    searchContainer.style.width = '50px';
  } else {
    searchContainer.style.width = '35%';
  }
}

// cleaners of the components
function clearSearch() {
  autocompleteBox.style.display = 'none';
  list.innerHTML = '';
  searchInput.value = '';
  clearSearchBarSize();
}
function clearContainer() {
  weatherContainer.innerHTML = '';
  containerHeader.innerHTML = '';
  containerHeader.style.padding = '0';
}

//functions to create dynamic elements with the information of the API

//auto complete items
async function printLocationItems(userInput) {
  try {
    searchButtonIcon.src = './assets/img/loadingIcon.png';
    searchButtonIcon.classList.add('button__icon--loading');
    let response = await service.getLocations(userInput);
    list.innerHTML = '';
    if (response.length) {
      list.innerHTML = '';
      response.forEach((e) => {
        list.innerHTML += creator.autocompleteItem(e);
      });
    }
  } catch (error) {
    console.log(error.message);
  } finally {
    searchButtonIcon.src = './assets/img/searchIcon.png';
    searchButtonIcon.classList.remove('button__icon--loading');
  }
}

//cards with the next 5 days information
async function print5dayForecast(woeid) {
  try {
    let response = await service.get5dayForecast(woeid);
    weatherContainer.innerHTML = '';
    response.forEach((e) => {
      weatherContainer.innerHTML += creator.weatherCard(e);
    });
  } catch (error) {
    console.log(error.message);
  }
}

//card with the general information of the searched place
async function printHeaderLocation(woeid) {
  try {
    let response = await service.getHeaderLocation(woeid);
    containerHeader.innerHTML = creator.locationCard(response);
    containerHeader.style.padding = '15px 25px';
  } catch (error) {
    console.log(error.message);
  }
}
//shows the response of the input that the user try to search when clicking
//the searchBar button
async function printButtonClickResponse(userInput) {
  if (!userInput) {
    return;
  }
  try {
    let response = await service.getLocations(userInput);
    clearContainer();
    clearSearch();
    if (
      response.length === 1 &&
      response[0].title.toLowerCase() === userInput.toLowerCase()
    ) {
      let woeid = response[0].woeid;
      print5dayForecast(woeid);
      printHeaderLocation(woeid);
    } else {
      weatherContainer.innerHTML = creator.message(
        'Ups! we do not have coverage at the place that you try to search'
      );
    }
  } catch (error) {
    console.log(error.message);
  }
}

//event that reads the local storage in order to show the last searched place
window.addEventListener('load', function () {
  const woid = localStorage.getItem('location');
  if (!woid) {
    weatherContainer.innerHTML = creator.message(
      "Welcome to the Weather App, let's start searching your location!"
    );
  } else {
    clearContainer();
    printHeaderLocation(woid);
    print5dayForecast(woid);
  }
});

//listen to the resize width in order to keep the searchbar animation
window.addEventListener('resize', () => {
  if (window.innerWidth !== windowWidth) {
    clearSearchBarSize();
    windowWidth = window.innerWidth;
  }
});

//event that detect when a click occurs outside the autoComplete box in order
//to close it when that happens
document.addEventListener('click', function (event) {
  let isInsideElement = searchContainer.contains(event.target);
  if (!isInsideElement) {
    searchInput.value = '';
    clearSearch();
  }
});

//event that handled the autoComplete at the searchBar
searchInput.addEventListener(
  'keyup',
  utilities.debounce((event) => {
    let userInput = event.target.value;
    if (userInput) {
      list.innerHTML = '';
      autocompleteBox.style.display = 'block';
      printLocationItems(userInput);
    }
  }, 500)
);

//event that handle the click on a auto suggested location at the searchBar
autocompleteBox.addEventListener('click', function (event) {
  if (event.target && event.target.nodeName == 'LI') {
    localStorage.setItem('location', `${event.target.id}`);
    clearContainer();
    printHeaderLocation(event.target.id);
    print5dayForecast(event.target.id);
    clearSearch();
  }
});

//event that handle the click at the search bar button
searchButton.addEventListener(
  'click',
  utilities.throttle(() => {
    printButtonClickResponse(searchInput.value);
  }, 1000)
);

//event that makes the animation of the search bar in a mobile view
searchContainer.addEventListener('click', () => {
  if (searchContainer.offsetWidth === 50) {
    searchContainer.style.width = '50%';
  }
});
