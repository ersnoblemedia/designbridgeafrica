const fs = require('fs');
try {
  console.log("lua:", fs.readFileSync('/etc/nginx/user_auth_verification.lua', 'utf8'));
} catch (e) {
  console.error("Error reading lua file:", e.message);
}
