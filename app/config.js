const fs = require('fs');

const defaultConfig = JSON.parse(fs.readFileSync('./app/config.json', 'utf8'));

module.exports = {
  defaultConfig,
};
