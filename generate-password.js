const bcrypt = require('bcrypt');
const password = 'your-chosen-password'; // Change this to your desired password
const hash = bcrypt.hashSync(password, 10);
console.log('Your password hash:');
console.log(hash);
