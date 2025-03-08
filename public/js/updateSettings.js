import axios from 'axios';
import { showAlert } from './alert';
// type = password || data
export const updateSettings = async (data, type) => {
  try {
    const url =
      type === `data`
        ? `/api/v1/users/updateMe`
        : `/api/v1/users/updateMyPassword`;
    const res = await axios({
      method: `PATCH`,
      url,
      data,
    });
    if (res.data.status === `success`) {
      showAlert(
        `success`,
        `${
          type.slice(0, 1).toUpperCase() + type.slice(1)
        } updated successfully!`
      );
    }
  } catch (err) {
    showAlert(`error`, err.response.data.message);
  }
};
