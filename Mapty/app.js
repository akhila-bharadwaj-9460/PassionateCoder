'use strict';

// prettier-ignore
// const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

// let map, mapEvent;

class Workout {
  date = new Date();
  id = `${new Date().getTime()}`.slice(-10); // creates a new ID by time stamp

  constructor(coords, distance, duration) {
    this.distance = distance; // km
    this.coords = coords; // [lat,lng]
    this.duration = duration; // min
  }
  _setDescription() {
    // prettier-ignore
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    this.description = `${this.type[0].toUpperCase() + this.type.slice(1)} on ${
      months[this.date.getMonth()]
    } ${this.date.getDate()}`;
  }
}
class Running extends Workout {
  type = 'running';
  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration);
    this.cadence = cadence;
    this.calcPace(); //immediately calculates pace
    this._setDescription();
  }
  calcPace() {
    this.pace = this.duration / this.distance; //min/km
    return this.pace;
  }
}
class Cycling extends Workout {
  type = 'cycling';
  constructor(coords, distance, duration, elevation) {
    super(coords, distance, duration);
    this.elevation = elevation;
    this.calcSpeed(); //immediately calculates speed
    this._setDescription();
  }
  calcSpeed() {
    this.speed = this.distance / (this.duration / 60); //km/h
    return this.speed;
  }
}

class App {
  #map;
  #mapEvent;
  #workouts = [];
  #mapZoomLevel = 14;
  constructor() {
    // whenever the object is created the constructor is invoked.
    // we need to get the positions by using geolocation
    this._getPositions(); // will get executed as soon as the object is created

    // get the data from local storage and display and set the values to the #workouts
    this._getLocalStorage();

    // attach event listeners
    form.addEventListener('submit', this._newWorkout.bind(this));
    inputType.addEventListener('change', this._toggleElevationField);
    containerWorkouts.addEventListener('click', this._moveToPopup.bind(this));
  }

  _getPositions() {
    if (navigator.geolocation) {
      // getCurrentPosition will take 2 callback function, 1st --> success, 2nd --> Error
      // _loadmap function is not called as a method instead it is called as a normal function by getCurrentPosition(), so 'this' keyword value is set to undefined.
      navigator.geolocation.getCurrentPosition(
        this._loadMap.bind(this),
        function () {
          alert(
            'could not load the map, please click on allow to get load the current location'
          );
        }
      );
    }
  }

  _loadMap(position) {
    const { latitude, longitude } = position.coords;

    this.#map = L.map('map').setView([latitude, longitude], this.#mapZoomLevel);
    L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    // location pointer
    // ADDING MARKER WHENEVER WE CLICK ON THE MAP.
    // we cant use addEventListener, instead we make use of a eventListener (on) of the LeafLet API, which will return us the coords.

    this.#map.on('click', this._showMap.bind(this));

    // once map is loaded  we will make the pointer sof the workouts stored in the local storage display here.
    this.#workouts.forEach(work => this._renderWorkoutMarker(work));
  }

  _showMap(mapE) {
    this.#mapEvent = mapE;
    // when we click on the map then we need to display the form and set the focus on distance
    form.classList.remove('hidden');
    inputDistance.focus(); // whenever we submit the form only then the marker should appear on the form
    // so we need to  create a even listener for form when it is submitted.
  }

  _toggleElevationField() {
    // if cadence is visible then elevation must be hidden and vice versa
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
  }

  _newWorkout(e) {
    e.preventDefault();
    // GET WORKOUT DATA FROM INPUT FIELDS
    const distance = +inputDistance.value;
    const duration = +inputDuration.value;
    // this provides us the event object, here we have a key 'latlng',which points to an object containing latitude and longitude
    const { lat, lng } = this.#mapEvent.latlng;
    let workout;

    const validateInputs = (...inputs) =>
      inputs.every(inp => Number.isFinite(inp)); // if all are numbers return true else false

    const allPositive = (...inputs) => inputs.every(inp => inp > 0); // if all numbers are positive return true else false

    // VALIDATE INPUT DATA
    if (inputType.value === 'running') {
      const cadence = +inputCadence.value;
      // need to check if distance, duration and cadence are positive numbers
      if (
        !validateInputs(duration, distance, cadence) ||
        !allPositive(duration, distance, cadence)
      )
        return alert('Please enter only Positive numbers.');

      workout = new Running([lat, lng], distance, duration, cadence);
    }
    if (inputType.value === 'cycling') {
      const elevation = +inputElevation.value;
      // need to check if distance, duration are positive numbers and elevation can be (+ve or -ve)
      if (
        !validateInputs(duration, distance, elevation) ||
        !allPositive(duration, distance)
      )
        return alert('Please enter only Positive numbers.');

      workout = new Cycling([lat, lng], distance, duration, elevation);
    }

    // ADD THE NEW WORKOUT TO WORKOUTS ARRAY
    this.#workouts.push(workout);
    console.log(this.#workouts);

    // RENDER WORKOUT WITH MARKER
    this._renderWorkoutMarker(workout);

    // RENDER WORKOUT WITH DETAILS
    this._renderWorkout(workout);

    // CLEAR INPUT FIELDS and HIDE
    this._hideForm();

    // Store the workouts into local storage
    this._setLocalStorage();
  }

  _renderWorkoutMarker(workout) {
    // now we need to add a marker on this location
    L.marker(workout.coords) // we need to specify the same latitue and longitude in an array
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          // we can methion the options for the popup, and decide how the popup should look like
          maxWidth: 300, // maximum width of the popup
          minWidth: 100, // minimum width of the popup
          autoClose: false, // we dont want the popup to colose if we open another popup
          closeOnClick: false, // we dont want to close the popup even if we click on it.
          className: `${workout.type}-popup`, // pop up based on the type of input
        })
      )
      .setPopupContent(workout.description)
      .openPopup();
  }

  _renderWorkout(workout) {
    let html = `<li class="workout workout--${workout.type}" data-id=${workout.id}>
      <h2 class="workout__title">${workout.description}</h2>
      <div class="workout__details">
        <span class="workout__icon">🏃‍♂️</span>
        <span class="workout__value">${workout.distance}</span>
        <span class="workout__unit">km</span>
      </div>
      <div class="workout__details">
        <span class="workout__icon">⏱</span>
        <span class="workout__value">${workout.duration}</span>
        <span class="workout__unit">min</span>
      </div>`;

    if (workout.type === 'running') {
      html += `
      <div class="workout__details">
            <span class="workout__icon">⚡️</span>
            <span class="workout__value">${workout.pace.toFixed(1)}</span>
            <span class="workout__unit">min/km</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">🦶🏼</span>
            <span class="workout__value">${workout.cadence}</span>
            <span class="workout__unit">spm</span>
          </div>
        </li>`;
    }

    if (workout.type === 'cycling') {
      html += `
        <div class="workout__details">
          <span class="workout__icon">⚡️</span>
          <span class="workout__value">${workout.speed.toFixed(1)}</span>
          <span class="workout__unit">km/h</span>
        </div>
        <div class="workout__details">
          <span class="workout__icon">⛰</span>
          <span class="workout__value">${workout.elevation}</span>
          <span class="workout__unit">m</span>
        </div>
      </li>`;
    }
    form.insertAdjacentHTML('afterend', html);
  }
  _hideForm() {
    inputCadence.value = '';
    inputDistance.value = '';
    inputDuration.value = '';
    inputElevation.value = '';
    form.style.display = 'none'; // we will hide the form first
    form.classList.add('hidden');
    setTimeout(() => (form.style.display = 'grid'), 2000);
  }

  _moveToPopup(e) {
    // console.log(e.target);
    const workoutEl = e.target.closest('.workout');

    if (!workoutEl) return; // if element is not found and value is null

    const workout = this.#workouts.find(
      // finding the workout matching the same id as the workout element we clicked on.
      work => work.id === workoutEl.dataset.id
    );
    this.#map.setView(workout.coords, this.#mapZoomLevel, {
      animate: true,
      pan: {
        duration: 1,
      },
    });
    console.log(workout);
  }

  _setLocalStorage() {
    localStorage.setItem('workouts', JSON.stringify(this.#workouts));
  }

  _getLocalStorage() {
    const workoutsLocal = JSON.parse(localStorage.getItem('workouts'));
    if (!workoutsLocal) return;
    this.#workouts = workoutsLocal;
    this.#workouts.forEach(work => this._renderWorkout(work));
  }

  reset() {
    localStorage.removeItem('workouts');
    location.reload();
  } // public method
}

// creating an object of App class
const app = new App();

// if (navigator.geolocation) {
//   // getCurrentPosition will take 2 callback function, 1st --> success, 2nd --> Error
//   navigator.geolocation.getCurrentPosition(
//     function (position) {
//       // console.log(position); // gives position
//       // console.log(position.coords.latitude); // gives the latitude of the current position
//       // console.log(position.coords.longitude); // gives the longitude of the current position

//       const { latitude, longitude } = position.coords;

//       // google maps link can be created by mentionting latitude and longitude
//       // console.log(`https://www.google.com/maps/@${latitude},${longitude},15z`); // gives the map based on the latitude and longitude mentioned

//       // LEAFLET API
//       // this basically allows us to display map
//       // L refers to leafLet main object

//       // here we need to set the coords of the map we want, we need to have a container with an ID called as map, and that is where we are going to display our map.

//       // var map = L.map('map').setView([51.505, -0.09], 13);

//       map = L.map('map').setView([latitude, longitude], 13); // we need to specify the same latitue and longitude in an array
//       // 13 represents the zoom value.

//       // the map is basically builded by blocks in the form of tiles
//       // we can have different themes of maps,
//       // L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { // one way
//       L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
//         // 2nd way
//         attribution:
//           '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
//       }).addTo(map);

//       // location pointer
//       // ADDING MARKER WHENEVER WE CLICK ON THE MAP.
//       // we cant use addEventListener, instead we make use of a eventListener (on) of the LeafLet API, which will return us the coords.

//       map.on('click', function (mapE) {
//         mapEvent = mapE;
//         // when we click on the map then we need to display the form and set the focus on distance
//         form.classList.remove('hidden');
//         inputDistance.focus(); // whenever we submit the form only then the marker should appear on the form
//         // so we need to  create a even listener for form when it is submitted.
//       });
//     },
//     function () {
//       alert(
//         'could not load the map, please click on allow to get load the current location'
//       );
//     }
//   );
// }

// form.addEventListener('submit', function (e) {
//   e.preventDefault(); // to stop the page from reloading

//   console.log(mapEvent); // this provides us the event object, here we have a key 'latlng',which points to an object containing latitude and longitude
//   const { lat, lng } = mapEvent.latlng;
//   console.log(lat, lng); // gives latitude and longitude where we clicked

//   // now we need to add a marker on this location
//   L.marker([lat, lng]) // we need to specify the same latitue and longitude in an array
//     .addTo(map)
//     .bindPopup(
//       L.popup({
//         // we can methion the options for the popup, and decide how the popup should look like
//         maxWidth: 300, // maximum width of the popup
//         minWidth: 100, // minimum width of the popup
//         autoClose: false, // we dont want the popup to colose if we open another popup
//         closeOnClick: false,
//         className: 'running-popup', // we dont want to close the popup even if we click on it.
//       })
//     )
//     .setPopupContent('Workout')
//     .openPopup();
// });

// whenever the event is running --> cadence, cycling --> Elevation
// change --> it is a type of event that occurs when the value is changed in select tag

// inputType.addEventListener('change', function (e) {
//   // if cadence is visible then elevation must be hidden and vice versa
//   inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
//   inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
// });
