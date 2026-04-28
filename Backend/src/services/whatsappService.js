// const url = `https://graph.facebook.com/v21.0/${process.env.WHATSAPP_BUSINESS_PHONE_NUMBER_ID}/messages`;

// const headers = {
//   "Authorization": `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
//   "Content-Type": "application/json",
// };



// const sendGreetingMessage = async (sendTo, name) => {
//   const body = {
//         messaging_product: "whatsapp",
//         to: "+91"+sendTo,
//         type: "template",
//         template: {
//             name: "greeting_message",
//             language: {
//                 code: "en"
//             },
//             components: [
//                 {
//                     "type": "body",
//                     "parameters": [
//                         {
//                             "type": "text",
//                             "text": name,
//                             "parameter_name": "name"
//                         }
//                     ]
//                 },
//                 {
//                     "type": "button",
//                     "sub_type": "url",
//                     "index": 0,
//                     "parameters": [
//                         {
//                             "type": "text",
//                             "text": "/"
//                         }
//                     ]
//                 }

//             ]   
//         }
//     };

//     try {
//         const response = await fetch(url, {
//             method: "POST",
//             headers,
//             body: JSON.stringify(body),
//         });

//         const data = await response.json();
//         console.log(data);
//     } catch (error) {
//         console.error("Error:", error);
//     }
// };

// module.exports = { sendGreetingMessage };
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);


const sendGreetingMessage = async (phoneNo, otp) => {
    const message = await client.messages
        .create({
            body: `${otp} is your verification code. For your security, do not share it with anyone.`,
            from: '+17069816446',
            to: "+91"+phoneNo
        })
        console.log(message.sid);
    
    const wm = await client.messages
    .create({
                from: 'whatsapp:+14155238886',
        contentSid: 'HX229f5a04fd0510ce1b071852155d3e75',
        contentVariables: `{"1":"${otp}"}`,
        to: `whatsapp:+91${phoneNo}`
    })

    console.log("whatsapp reply: ", wm);
}

module.exports = { sendGreetingMessage }

