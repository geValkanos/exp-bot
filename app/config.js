const fs = require('fs');

const config = JSON.parse(fs.readFileSync('./app/config.json', 'utf8'));

const writeToConfigFile = () => {
  fs.writeFileSync(
      './app/config.json',
      JSON.stringify(config, null, 2), 'utf8',
  );
};

const setNewGuildConfig = async (guildId) => {
  config[guildId] = {...config.default};
  writeToConfigFile();
};

const deleteGuildConfig = async (guildId) => {
  delete config[guildId];
  writeToConfigFile();
};


const editExpConditions = async (guildId, newConfig) => {
  config[guildId].expConditions = {
    ...config[guildId].expConditions,
    ...newConfig,
  };
  writeToConfigFile();
};

module.exports = {
  config,
  editExpConditions,
  setNewGuildConfig,
  deleteGuildConfig,
};
