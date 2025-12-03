import twilio from "twilio";

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

export const sendMessage = async (phone, message) => {
  try {
    await client.messages.create({
      from: process.env.TWILIO_WHATSAPP_NUMBER, // <-- CORRECT

      to: `whatsapp:+91${phone}`,
      body: message,
    });

    console.log("WhatsApp message sent →", phone);
  } catch (err) {
    console.log("WhatsApp Error:", err.message);
  }
};
