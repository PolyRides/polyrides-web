const fs = require('fs');
const dotenv = require('dotenv');
const replace = require('replace-in-file');
const args = require('yargs').argv;

let environmentFilePath = 'src/environments/environment.ts';

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

if (args.prod === 'true') {
  environmentFilePath = 'src/environments/environment.prod.ts';
}

const gmapsKey = process.env.gmaps;
const options = {
  files: environmentFilePath,
  from: /{GMAPS_KEY}/g,
  to: gmapsKey,
  allowEmptyPaths: false,
};

try {
  let changedFiles = replace.sync(options);
  console.log("File updated with key!");
}
catch (error) {
  console.error('Error occurred:', error);
}


