import axios from 'axios';
import { showAlert } from './alert';

export const showListParking = (listParkingBtn) => {
  listParkingBtn.addEventListener(`click`, () => {
    window.setTimeout(() => {
      location.assign(`/listParking`);
    }, 500);
  });
};

export const askPhoneNumber = (parkingType) => {
  //Show phone number input only if parking type is private
  parkingType.addEventListener('change', function () {
    const phoneNumberInput = document.getElementById('phone-number');
    if (this.value === 'private') {
      phoneNumberInput.style.display = 'block';
      phoneNumberInput.required = true;
    } else {
      phoneNumberInput.style.display = 'none';
      phoneNumberInput.required = false;
    }
  });
};

export const showFileCount = () => {
  document
    .getElementById('parking-ownership')
    .addEventListener('change', function () {
      document.getElementById('ownership-count').textContent =
        'Uploaded: ' + this.files.length;
    });

  document
    .getElementById('parking-imageCover')
    .addEventListener('change', function () {
      document.getElementById('cover-count').textContent =
        'Uploaded: ' + this.files.length;
    });

  document
    .getElementById('parking-images')
    .addEventListener('change', function () {
      document.getElementById('images-count').textContent =
        'Uploaded: ' + this.files.length;
    });
};

export const createParking = async (data, phoneNumber) => {
  try {
    const res = await axios({
      method: `POST`,
      url: `http://localhost:3000/api/v1/parkings`,
      data,
      withCredentials: true,
    });
    if (res.data.status === `success`) {
      await axios({
        method: `PATCH`,
        url: `http://localhost:3000/api/v1/users/updateRole`,
        data: {
          role: `owner`,
        },
        withCredentials: true,
      });
      if (phoneNumber) {
        await axios({
          method: `PATCH`,
          url: `http://localhost:3000/api/v1/users/updateMe`,
          data: {
            phoneNumber,
          },
          withCredentials: true,
        });
      }
      showAlert(
        `success`,
        `Your parking will be listed after ownership verification is successfull`
      );
      window.setTimeout(() => {
        location.assign(`/`);
      }, 5000);
    }
  } catch (err) {
    showAlert(`error`, err.response.data.message);
  }
};
