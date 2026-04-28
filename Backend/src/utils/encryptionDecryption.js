
const crypto = require("crypto");

const algorithm = "aes-256-cbc"; // AES encryption
const ivLength = 16; // 16 bytes IV

const encrypt = (text, key) => {
    const iv = crypto.randomBytes(ivLength);
    
    const cipher = crypto.createCipheriv(
        algorithm,
        crypto.createHash("sha256").update(key).digest(), // Convert key to 32 bytes
        iv
    );

    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");

    return iv.toString("hex") + ":" + encrypted;  // return IV + encrypted data
};

const decrypt = (ciphertext, key) => {
    const [ivHex, encryptedText] = ciphertext.split(":");

    const iv = Buffer.from(ivHex, "hex");

    const decipher = crypto.createDecipheriv(
        algorithm,
        crypto.createHash("sha256").update(key).digest(),
        iv
    );

    let decrypted = decipher.update(encryptedText, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
};

module.exports = { encrypt, decrypt };
