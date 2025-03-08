import io from 'socket.io-client';
import axios from 'axios';
export const freeSlotsUpdate = async (id) => {
  await axios(`http://localhost:3000/api/v1/parkings/${id}`);
  const socket = io();
  socket.on('freeSlotsUpdate', (slots) => {
    if (isNaN(slots)) {
      document.getElementById('freeSlots').innerText =
        'Error in getting free slots. Please try again later.';
    } else {
      document.getElementById('freeSlots').innerText =
        slots > 0
          ? slots > 1
            ? slots + ' slots free'
            : slots + ' slot free'
          : 'Sorry, no slots available!';
    }
  });
};
