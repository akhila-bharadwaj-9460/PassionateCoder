'use strict';

// // prettier-ignore
// const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

// const form = document.querySelector('.form');
// const containerWorkouts = document.querySelector('.workouts');
// const inputType = document.querySelector('.form__input--type');
// const inputDistance = document.querySelector('.form__input--distance');
// const inputDuration = document.querySelector('.form__input--duration');
// const inputCadence = document.querySelector('.form__input--cadence');
// const inputElevation = document.querySelector('.form__input--elevation');

// // let map, mapEvent;

class Workout {
  date = new Date();

  constructor(coords, distance, duration) {
    this.distance = distance; // km
    this.coords = coords; // [lat,lng]
    this.duration = duration; // min
  }
}
// class Running extends Workout {
//   constructor(coords, distance, duration, cadence) {
//     super(coords, distance, duration);
//     this.cadence = cadence;
//     this.calcPace(); //immediately calculates pace
//   }
//   calcPace() {
//     this.pace = this.duration / this.distance; //min/km
//     return this.pace;
//   }
// }
// class Cycling extends Workout {
//   constructor(coords, distance, duration, elevation) {
//     super(coords, distance, duration);
//     this.elevation = elevation;
//     this.calcSpeed(); //immediately calculates speed
//   }
//   calcSpeed() {
//     this.speed = this.distance / (this.duration / 60); //km/h
//     return this.speed;
//   }
// }

const work = new Workout(2, 3, 4);

// const running = new Running(10, 20, 30, 4);

// class App {
//   #map;
//   #mapEvent;
//   constructor() {
//     // whenever the object is created the constructor is invoked.
//     // we need to get the positions by using geolocation
//     this._getPositions(); // will get executed as soon as the object is created
//     form.addEventListener('submit', this._newWorkout.bind(this));
//     inputType.addEventListener('change', this._toggleElevationField);
//   }

//   _getPositions() {
//     if (navigator.geolocation) {
//       // getCurrentPosition will take 2 callback function, 1st --> success, 2nd --> Error
//       // _loadmap function is not called as a method instead it is called as a normal function by getCurrentPosition(), so 'this' keyword value is set to undefined.
//       navigator.geolocation.getCurrentPosition(
//         this._loadMap.bind(this),
//         function () {
//           alert(
//             'could not load the map, please click on allow to get load the current location'
//           );
//         }
//       );
//     }
//   }

//   _loadMap(position) {
//     const { latitude, longitude } = position.coords;

//     this.#map = L.map('map').setView([latitude, longitude], 13);
//     L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
//       attribution:
//         '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
//     }).addTo(this.#map);

//     // location pointer
//     // ADDING MARKER WHENEVER WE CLICK ON THE MAP.
//     // we cant use addEventListener, instead we make use of a eventListener (on) of the LeafLet API, which will return us the coords.

//     this.#map.on('click', this._showMap.bind(this));
//   }

//   _showMap(mapE) {
//     this.#mapEvent = mapE;
//     // when we click on the map then we need to display the form and set the focus on distance
//     form.classList.remove('hidden');
//     inputDistance.focus(); // whenever we submit the form only then the marker should appear on the form
//     // so we need to  create a even listener for form when it is submitted.
//   }

//   _toggleElevationField() {
//     // if cadence is visible then elevation must be hidden and vice versa
//     inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
//     inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
//   }

//   _newWorkout(e) {
//     e.preventDefault(); // to stop the page from reloading

//     console.log(this.#mapEvent); // this provides us the event object, here we have a key 'latlng',which points to an object containing latitude and longitude
//     const { lat, lng } = this.#mapEvent.latlng;
//     console.log(lat, lng); // gives latitude and longitude where we clicked

//     // now we need to add a marker on this location
//     L.marker([lat, lng]) // we need to specify the same latitue and longitude in an array
//       .addTo(this.#map)
//       .bindPopup(
//         L.popup({
//           // we can methion the options for the popup, and decide how the popup should look like
//           maxWidth: 300, // maximum width of the popup
//           minWidth: 100, // minimum width of the popup
//           autoClose: false, // we dont want the popup to colose if we open another popup
//           closeOnClick: false,
//           className: 'running-popup', // we dont want to close the popup even if we click on it.
//         })
//       )
//       .setPopupContent('Workout')
//       .openPopup();
//   }
// }

// // creating an object of App class
// const app = new App();

// // if (navigator.geolocation) {
// //   // getCurrentPosition will take 2 callback function, 1st --> success, 2nd --> Error
// //   navigator.geolocation.getCurrentPosition(
// //     function (position) {
// //       // console.log(position); // gives position
// //       // console.log(position.coords.latitude); // gives the latitude of the current position
// //       // console.log(position.coords.longitude); // gives the longitude of the current position

// //       const { latitude, longitude } = position.coords;

// //       // google maps link can be created by mentionting latitude and longitude
// //       // console.log(`https://www.google.com/maps/@${latitude},${longitude},15z`); // gives the map based on the latitude and longitude mentioned

// //       // LEAFLET API
// //       // this basically allows us to display map
// //       // L refers to leafLet main object

// //       // here we need to set the coords of the map we want, we need to have a container with an ID called as map, and that is where we are going to display our map.

// //       // var map = L.map('map').setView([51.505, -0.09], 13);

// //       map = L.map('map').setView([latitude, longitude], 13); // we need to specify the same latitue and longitude in an array
// //       // 13 represents the zoom value.

// //       // the map is basically builded by blocks in the form of tiles
// //       // we can have different themes of maps,
// //       // L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { // one way
// //       L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
// //         // 2nd way
// //         attribution:
// //           '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
// //       }).addTo(map);

// //       // location pointer
// //       // ADDING MARKER WHENEVER WE CLICK ON THE MAP.
// //       // we cant use addEventListener, instead we make use of a eventListener (on) of the LeafLet API, which will return us the coords.

// //       map.on('click', function (mapE) {
// //         mapEvent = mapE;
// //         // when we click on the map then we need to display the form and set the focus on distance
// //         form.classList.remove('hidden');
// //         inputDistance.focus(); // whenever we submit the form only then the marker should appear on the form
// //         // so we need to  create a even listener for form when it is submitted.
// //       });
// //     },
// //     function () {
// //       alert(
// //         'could not load the map, please click on allow to get load the current location'
// //       );
// //     }
// //   );
// // }

// // form.addEventListener('submit', function (e) {
// //   e.preventDefault(); // to stop the page from reloading

// //   console.log(mapEvent); // this provides us the event object, here we have a key 'latlng',which points to an object containing latitude and longitude
// //   const { lat, lng } = mapEvent.latlng;
// //   console.log(lat, lng); // gives latitude and longitude where we clicked

// //   // now we need to add a marker on this location
// //   L.marker([lat, lng]) // we need to specify the same latitue and longitude in an array
// //     .addTo(map)
// //     .bindPopup(
// //       L.popup({
// //         // we can methion the options for the popup, and decide how the popup should look like
// //         maxWidth: 300, // maximum width of the popup
// //         minWidth: 100, // minimum width of the popup
// //         autoClose: false, // we dont want the popup to colose if we open another popup
// //         closeOnClick: false,
// //         className: 'running-popup', // we dont want to close the popup even if we click on it.
// //       })
// //     )
// //     .setPopupContent('Workout')
// //     .openPopup();
// // });

// // whenever the event is running --> cadence, cycling --> Elevation
// // change --> it is a type of event that occurs when the value is changed in select tag

// // inputType.addEventListener('change', function (e) {
// //   // if cadence is visible then elevation must be hidden and vice versa
// //   inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
// //   inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
// // });
