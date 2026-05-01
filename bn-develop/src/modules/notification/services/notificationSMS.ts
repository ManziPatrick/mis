// import twilio from 'twilio';

// const client = twilio(
//   process.env.TWILIO_ACCOUNT_SID,
//   process.env.TWILIO_AUTH_TOKEN
// );

// export const sendSMS = async (to: string, message: string): Promise<boolean> => {
//   try {
//     await client.messages.create({
//       body: message,
//       to,
//       from: process.env.TWILIO_PHONE_NUMBER
//     });
//     return true;
//   } catch (error) {
//     console.error('SMS sending failed:', error);
//     return false;
//   }
// };

// const { Vonage } = require('@vonage/server-sdk');

// const vonage = new Vonage({
//   apiKey: process.env.VONAGE_API_KEY,
//   apiSecret: process.env.VONAGE_API_SECRET,
// });

// export const sendSMS = async (to: string, message: string) => {
//   const from = process.env.VONAGE_BRAND_NAME; // Sender ID or phone number
//   vonage.sms.send({ to, from, text: message })
//     .then(response => {
//       //console.log('Message sent successfully:', response);
//     })
//     .catch(error => {
//       console.error('Error sending SMS:', error.message);
//     });
// };

const axios = require('axios');

export const sendSMS = async (to, message) => {
  const sender_id = process.env.SENDER_ID; // Sender ID or phone number (max 11 characters)
  const apiToken = process.env.MISTA_API_TOKEN; // Your API token
  const apiUrl = process.env.MISTA_API_URL; // API URL

  try {
    const smsData = {
      recipient: to,
      sender_id,
      message,
      type: 'plain', // 'plain' for text messages
    };

    const response = await axios.post(apiUrl, smsData, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
      },
    });

    //console.log('Message sent successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error sending SMS:', error.response ? error.response.data : error.message);
    throw error; // Rethrow error for further handling
  }
};



