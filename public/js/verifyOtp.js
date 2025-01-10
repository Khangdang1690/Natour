import axios from 'axios';
import { showAlert } from './alert';

export const verifyOTP = async (otp) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/verify-otp',
      data: { otp }
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Account verified successfully!');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};