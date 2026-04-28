function addDays(date, days) {
  return new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
}

const extractJSONFromCodeBlock = (input) => {
    const match = input.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
    if (match && match[1]) {
        return match[1].trim();
    }
    return null;
};

const generateSimplePassword = (fullName, contactNo) => {
  if (!/^\d{10}$/.test(contactNo)) {
    throw new Error("Contact number must be exactly 10 digits");
  }

  const firstName = fullName.trim().split(" ")[0]; // get first name only

  // Randomly pick 4 digits from the contact number (not necessarily consecutive)
  const digits = contactNo.split("");
  let randomDigits = "";
  for (let i = 0; i < 4; i++) {
    const randomIndex = Math.floor(Math.random() * digits.length);
    randomDigits += digits[randomIndex];
  }

  const specials = "!@#$%^&*";
  const special = specials[Math.floor(Math.random() * specials.length)];

  // Combine to form password
  const password = `${firstName}${special}${randomDigits}`;
  return password;
}

module.exports = { addDays, extractJSONFromCodeBlock, generateSimplePassword };