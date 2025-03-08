import '@babel/polyfill';
import { signup } from './signup';
import { login } from './login';
import { forgotPassword } from './login';
import { logout } from './login';
import { showLogin } from './login';
import { showSignup } from './signup';
import { showMenu } from './menu';
import { showMap } from './findParking';
import { displayMap } from './findParking';
import { toggleSearch } from './findParking';
import { getParkingsNearMe } from './findParking';
import { showListParking } from './listParking';
import { askPhoneNumber } from './listParking';
import { showFileCount } from './listParking';
import { createParking } from './listParking';
import { freeSlotsUpdate } from './freeSlotsUpdate';
import { bookSlot } from './stripe';
import { updateSettings } from './updateSettings';

//Animation Functions
import { locoScroll } from './script';
import { cursorEffect } from './script';
import { sliderAnimaton } from './script';
import { loader } from './script';

locoScroll();
cursorEffect();
sliderAnimaton();
if (document.getElementById(`loader`)) {
  loader();
}

//DOM Elements
const signupForm = document.querySelector(`.form-signup`);
const loginForm = document.querySelector(`.form-login`);
const logoutBtn = document.querySelector(`.logout__btn`);
const logIn = document.getElementById('logIn');
const forgotPasswordBtn = document.getElementById('forgotPassword');
const signUp = document.getElementById('signUp');
const register = document.getElementById(`register`);
const container = document.querySelector('.login-page .container');
const signupContainer = document.querySelector(
  '.signup-page .signup-container'
);
const menu = document.getElementById('menu');
const newMenu = document.querySelector(`.menu`);
const findParkingBtn = document.getElementById('findParking');
const listParkingBtn = document.getElementById('listParking');
const mapbox = document.getElementById('map');
const search = document.getElementById('search-bar');
const createParkingForm = document.querySelector(`.listParking-form`);
const parkingType = document.getElementById('parking-type');
const freeSlots = document.getElementById('freeSlots');
const bookBtn = document.getElementById(`book-slot`);
const userDataForm = document.querySelector(`.form-user-data`);
const userPasswordForm = document.querySelector(`.form-user-settings`);

//SIGNUP
if (signUp) {
  showSignup(signUp, register, signupContainer);
}

if (signupForm) {
  signupForm.addEventListener(`submit`, (el) => {
    el.preventDefault();
    const name = document.getElementById(`name-signup`).value;
    const email = document.getElementById(`email-signup`).value;
    const password = document.getElementById(`password-signup`).value;
    const passwordConfirm = document.getElementById(
      `passwordConfirm-signup`
    ).value;
    signup(name, email, password, passwordConfirm);
  });
}

//LOGIN
if (logIn) {
  showLogin(logIn, container);
}

if (loginForm) {
  loginForm.addEventListener(`submit`, (el) => {
    el.preventDefault();
    const email = document.getElementById(`email-login`).value;
    const password = document.getElementById(`password-login`).value;
    login(email, password);
  });
}

//FORGOT PASSWORD
if (forgotPasswordBtn) {
  forgotPasswordBtn.addEventListener(`click`, () => {
    const email = document.getElementById(`email-login`).value;
    forgotPassword(email);
  });
}

//LOGOUT
if (logoutBtn) {
  logoutBtn.addEventListener(`click`, logout);
}

//MENU
if (menu) {
  menu.addEventListener(`click`, () => {
    showMenu(newMenu);
  });
}

//FIND PARKING
if (findParkingBtn) {
  showMap(findParkingBtn);
}
if (mapbox) {
  toggleSearch('search-bar', 'search-button');
  const parkings = JSON.parse(document.getElementById(`map`).dataset.parkings);
  displayMap(parkings);
}
if (search) {
  search.addEventListener(`submit`, async (el) => {
    el.preventDefault();
    const distance = 10;
    const unit = 'km';
    const address = document.getElementById('search-input').value;
    if (!address) {
      const parkings = JSON.parse(
        document.getElementById(`map`).dataset.parkings
      );
      displayMap(parkings);
      return;
    }
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        address
      )}.json?access_token=pk.eyJ1IjoiY2hhdWhhbmRocnV2MjQ1IiwiYSI6ImNsdThjOXIyMjBjcjMyanBpbG5xN3RrZzkifQ.Xcn3mM3iZUlacqCGvPfwvA`
    );
    const data = await response.json();
    const [lng, lat] = data.features[0].center;

    const latlng = `${lat},${lng}`;
    getParkingsNearMe(distance, latlng, unit);
  });
}

//LIST PARKING
if (listParkingBtn) {
  showListParking(listParkingBtn);
}
if (createParkingForm) {
  askPhoneNumber(parkingType);
  showFileCount();
  const owner = JSON.parse(createParkingForm.dataset.currentuser);
  createParkingForm.addEventListener(`submit`, async (el) => {
    el.preventDefault();
    const phoneNumber = document.getElementById(`phone-number`).value;
    const address = document.getElementById(`parking-address`).value;
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        address
      )}.json?access_token=pk.eyJ1IjoiY2hhdWhhbmRocnV2MjQ1IiwiYSI6ImNsdThjOXIyMjBjcjMyanBpbG5xN3RrZzkifQ.Xcn3mM3iZUlacqCGvPfwvA`
    );
    const data = await response.json();
    const [lng, lat] = data.features[0].center;
    const location = {
      type: `Point`,
      coordinates: [lng, lat],
      address,
    };
    const form = new FormData();
    form.append(`name`, document.getElementById(`parking-name`).value);
    form.append(`owner`, owner._id);
    form.append(`maxSlots`, document.getElementById(`parking-maxSlots`).value);
    form.append(`price`, document.getElementById(`parking-price`).value);
    form.append(
      `description`,
      document.getElementById(`parking-description`).value
    );
    form.append(`location`, JSON.stringify(location));
    form.append(`role`, document.getElementById(`parking-type`).value);
    form.append(
      `ownershipImage`,
      document.getElementById(`parking-ownership`).files[0]
    );
    form.append(
      `imageCover`,
      document.getElementById(`parking-imageCover`).files[0]
    );
    Array.from(document.getElementById(`parking-images`).files).forEach(
      (file) => {
        form.append(`images`, file);
      }
    );
    await createParking(form, phoneNumber);
  });
}

//FREE SLOTS UPDATE
if (freeSlots) {
  const id = freeSlots.dataset.parkid;
  freeSlotsUpdate(id);
}
if (bookBtn) {
  bookBtn.addEventListener(`click`, (el) => {
    el.target.textContent = `Processing...`;
    const { parkingid } = el.target.dataset;
    bookSlot(parkingid);
  });
}

//UPDATE SETTINGS
if (userDataForm) {
  userDataForm.addEventListener(`submit`, (el) => {
    el.preventDefault();
    const form = new FormData(); //Creates a new FormData object as a key-value pair
    form.append(`name`, document.getElementById(`name`).value);
    form.append(`email`, document.getElementById(`email`).value);
    form.append(`photo`, document.getElementById(`photo`).files[0]);
    updateSettings(form, `data`);
  });
}

if (userPasswordForm) {
  userPasswordForm.addEventListener(`submit`, async (el) => {
    el.preventDefault();
    document.querySelector(`.btn--save--password`).textContent = `Updating...`;
    const passwordCurrent = document.getElementById(`password-current`).value;
    const password = document.getElementById(`password`).value;
    const passwordConfirm = document.getElementById(`password-confirm`).value;
    const data = {
      passwordCurrent,
      password,
      passwordConfirm,
    };
    await updateSettings(data, `password`);
    document.querySelector(
      `.btn--save--password`
    ).textContent = `Save password`;
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  });
}
