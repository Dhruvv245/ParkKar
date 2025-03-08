import axios from 'axios';
import { showAlert } from './alert';

export const showLogin = (login, container) => {
  login.addEventListener('click', (event) => {
    event.stopPropagation();
    document.querySelector('.login-page').classList.add('login-page--active');
    if (document.querySelector(`#cursor`)) {
      document.querySelector('#page1-content').style.display = 'none';
      document.querySelector(`#page1 video`).style.filter = 'blur(20px)';
    }else {
      document.querySelector(`#overlay`).style.display = `flex`;
    }
  });

  container.addEventListener('click', (event) => {
    event.stopPropagation();
  });

  document.addEventListener('click', (event) => {
    const form = document.querySelector('.login-page .container');
    if (event.target.id === 'logIn' || form.contains(event.target)) {
      return;
    }
    document
      .querySelector('.login-page')
      .classList.remove('login-page--active');
    if (document.querySelector(`#cursor`)) {
      document.querySelector('#page1-content').style.display = 'flex';
      document.querySelector(`#page1 video`).style.filter = 'none';
    }else {
      document.querySelector(`#overlay`).style.display = `none`;
    }
  });
};

export const login = async (email, password) => {
  try {
    const res = await axios({
      method: `POST`,
      url: `http://localhost:3000/api/v1/users/signin`,
      withCredentials: true,
      data: {
        email,
        password,
      },
    });
    if (res.data.status === `success`) {
      showAlert(`success`, `Logged in successfully!`);
      window.setTimeout(() => {
        location.assign(`/`);
      }, 1500);
    }
  } catch (err) {
    showAlert(`error`, err.response.data.message);
  }
};

export const forgotPassword = async (email) => {
  try {
    const res = await axios({
      method: `POST`,
      url: `http://localhost:3000/api/v1/users/forgotPassword`,
      data: {
        email,
      },
    });
    if (res.data.status === `success`) {
      showAlert(`success`, `Email sent successfully!`);
    }
  } catch (err) {
    showAlert(`error`, err.response.data.message);
  }
};

export const logout = async () => {
  try {
    const res = await axios({
      method: `GET`,
      url: `http://localhost:3000/api/v1/users/logout`,
    });
    if (res.data.status === `success`) {
      showAlert(`success`, `Logged out successfully!`);
      window.setTimeout(() => {
        location.reload(true);
      }, 1000);
    }
  } catch (err) {
    showAlert(`error`, `Error logging out ! Try again`);
  }
};
