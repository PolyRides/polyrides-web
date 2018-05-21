const fs = require('fs');
const dotenv = require('dotenv');
const replace = require('replace-in-file');

// Read OS environment variable
// Netlify will already have this set but local dev requires .env file
if (fs.existsSync('.env')) {
  const result = dotenv.config();

  if (result.error) {
    throw result.error;
  }

  console.log(result.parsed);
  console.log("Environment parsed!");
}

const gmapsKey = process.env.gmaps;
const options = {
  files: 'src/environments/environment.ts',
  from: /{GMAPS_KEY}/g,
  to: gmapsKey,
  allowEmptyPaths: false,
};

try {
  let changedFiles = replace.sync(options);
  console.log(gmapsKey);
  console.log("File updated with key!");
}
catch (error) {
  console.error('Error occurred:', error);
}


