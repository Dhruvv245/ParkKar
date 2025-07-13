import io from 'socket.io-client';

export const freeSlotsUpdate = (id) => {
  const socket = io();
  socket.on(`freeSlotsUpdate-${id}`, (data) => {
    const slots = data?.freeSlots;
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

  socket.on('connect_error', (err) => {
    console.error('Socket connection failed:', err.message);
  });
};
