const dotenv = require('dotenv');
const replace = require('replace-in-file');

// Read OS environment variable
const result = dotenv.config();

if (result.error) {
  throw result.error;
}

console.log(result.parsed);
console.log("Environment parsed!");

const gmapsKey = process.env.gmaps;
const options = {
  files: 'src/environments/environment.ts',
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


