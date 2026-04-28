
const token = process.env.WHATSAPP_PERMANENT_TOKEN;
const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

async function sendMessage() {
  await fetch(`https://graph.facebook.com/v19.0/${phoneNumberId}/messages`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to: "9310501395",
      type: "text",
      text: {
        body: `
Hello World
Welcome and congratulations!! This message demonstrates your ability to send a WhatsApp message notification from the Cloud API, hosted by Meta. Thank you for taking the time to test with us.`
      }
    })
  });

  console.log("Message sent!");
}

module.exports = { sendMessage };

