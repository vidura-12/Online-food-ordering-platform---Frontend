
// services/sendPaymentSMS.js

import axios from 'axios';

export const sendPaymentSMS = async (to) => {
  try {
    const response = await axios.post('http://localhost:5056/api/notifications/sms/payment', {
      to: to
    });
    return response.data; // or return the whole response if you want
  } catch (error) {
    console.error('Error sending payment SMS:', error);
    throw error; // rethrow so caller can handle it
  }
};
