// Uso: node scripts/gen-token.js <USER_ID>
// Exemplo: node scripts/gen-token.js 20e52f63-149a-4197-89cd-00b7bc1dced6
require("dotenv/config");
const jwt = require("jsonwebtoken");

const userId = process.argv[2];
if (!userId) {
    console.error("Uso: node scripts/gen-token.js <USER_ID>");
    process.exit(1);
}

const token = jwt.sign({ sub: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "1h",
});

console.log(token);
