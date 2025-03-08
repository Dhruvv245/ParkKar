import axios from 'axios';
import { showAlert } from './alert';

export const showSignup = (signUp, register, container) => {
  signUp.addEventListener('click', (event) => {
    event.stopPropagation();
    document.querySelector('.signup-page').classList.add('signup-page--active');
    if(document.querySelector(`#cursor`)){
      document.querySelector('#page1-content').style.display = 'none';
      document.querySelector(`#page1 video`).style.filter = 'blur(20px)';
    }else{
      document.querySelector(`#overlay`).style.display = `flex`;
    }
  });

  register.addEventListener(`click`, (event) => {
    event.stopPropagation();
    document.querySelector('.signup-page').classList.add('signup-page--active');
    document
      .querySelector('.login-page')
      .classList.remove('login-page--active');
  });

  container.addEventListener('click', (event) => {
    event.stopPropagation();
  });

  document.addEventListener('click', (event) => {
    const form = document.querySelector('.signup-page .signup-container');
    if (event.target.id === 'signUp' || form.contains(event.target)) {
      return;
    }
    document
      .querySelector('.signup-page')
      .classList.remove('signup-page--active');
      if(document.querySelector(`#cursor`)){
        document.querySelector('#page1-content').style.display = 'flex';
        document.querySelector(`#page1 video`).style.filter = 'none';
      }else{
        document.querySelector(`#overlay`).style.display = `none`;
      }
  });
};

export const signup = async (name, email, password, passwordConfirm) => {
  try {
    const res = await axios({
      method: `POST`,
      url: `http://localhost:3000/api/v1/users/signup`,
      data: {
        name,
        email,
        password,
        passwordConfirm,
      },
    });
    if (res.data.status === `success`) {
      showAlert(`success`, `Account created successfully!`);
      window.setTimeout(() => {
        location.assign(`/`);
      }, 1500);
    }
  } catch (err) {
    showAlert(`error`, err.response.data.message);
  }
};
