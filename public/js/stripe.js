import axios from 'axios';
import { showAlert } from './alert';

export const bookSlot = async (parkingId) => {
  const stripe = Stripe(
    `pk_test_51P136dSE1VO93YaGAlMqv3BAUZKYA2zHq1Bt0FSwMVGfVqFx7R1BgZrmnEucc4SN9Bos1RHL4c42rRx1n3JsW74k00axK4jZF2`
  );
  try {
    //1.Get checkout session from API
    const session = await axios(
      `/api/v1/bookings/checkout-session/${parkingId}`
    );
    const parking = await axios({
      method: `GET`,
      url: `/api/v1/parkings/${parkingId}`,
    });
    const bookings = await axios({
      method: `GET`,
      url: `/api/v1/bookings/parking/${parkingId}`,
    });
    const numOfBookings = bookings.data.parkingBookings.length;
    if (numOfBookings >= parking.data.data.data.freeSlots) {
      showAlert(`error`, `Parking is full`);
      return;
    }
    //2.Create checkout form + charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    console.log(err);
    showAlert(`error`, err);
  }
};

//Test credit card = 4000003560000123
