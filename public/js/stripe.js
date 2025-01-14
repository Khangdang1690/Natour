/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alert';
const stripe = Stripe("pk_test_51Qegi5P4Dtq7UniaCUq17gGRkBvKZDbPPwnrEnPtJC8OAWPNJN9Q47L6Z7d8fp2amia9JIjDPfZq0NGjF4W8Uvm8006MM5X509");

export const bookTour = async tourId => {
  try {
    // 1) Get checkout session from API
    const session = await axios(
      `/api/v1/bookings/checkout-session/${tourId}`
    );
    // console.log(session);

    // 2) Create checkout form + charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err.response ? err.response.data.message : 'Something went wrong');
  }
};