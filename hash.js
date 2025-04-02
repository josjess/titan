const bcrypt = require("bcrypt");

async function hashPassword() {
  const password = "admin123"; // Change this to your desired password
  const saltRounds = 10;
  
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  console.log("Hashed Password:", hashedPassword);
}

hashPassword();
