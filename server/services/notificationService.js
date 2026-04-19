/**
 * Notification Service
 * Handles sending messages to patients via registered numbers.
 * Currently simulates SMS/WhatsApp by logging to the console.
 */

const sendNotification = async (patient, tokenNumber, waitTimeMinutes) => {
  const message = `Hello ${patient.name}, your token is T${String(tokenNumber).padStart(2, "0")}. Estimated waiting time: ${Math.round(waitTimeMinutes)} minutes. Thanks for patience.`;

  console.log("-----------------------------------------");
  console.log(`[OUTGOING NOTIFICATION] To: ${patient.phone}`);
  console.log(`[MESSAGE]: ${message}`);
  console.log("-----------------------------------------");

  // In production, you would integrate Twilio or WhatsApp Business API here:
  // await twilioClient.messages.create({ body: message, from: '...', to: patient.phone });

  return true;
};

export default { sendNotification };
