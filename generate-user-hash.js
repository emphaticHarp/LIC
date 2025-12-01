const bcrypt = require('bcryptjs');

async function generateHash() {
  const password = '12345678';
  const hash = await bcrypt.hash(password, 12);
  console.log('Password:', password);
  console.log('Hash:', hash);
  
  return hash;
}

generateHash().then(hash => {
  const userJson = {
    "email": "amar123@gmail.com",
    "password": hash,
    "name": "Amar User",
    "role": "customer",
    "profile": {
      "firstName": "Amar",
      "lastName": "User",
      "memberSince": new Date().toISOString()
    },
    "isActive": true,
    "createdAt": new Date().toISOString(),
    "updatedAt": new Date().toISOString()
  };
  
  console.log('\nComplete JSON for MongoDB:');
  console.log(JSON.stringify(userJson, null, 2));
});
