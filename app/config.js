const fs = require('fs');

const loadConfig = async () => {
  const data = await fs.promises.readFile('./app/config.json', 'utf8');
  const jsonData = JSON.parse(data);
  return {
    data: jsonData,
    editExpConditions: async (guildId, newConfig) => {
      jsonData[guildId].expConditions = {
        ...jsonData[guildId].expConditions,
        ...newConfig,
      };
      await fs.promises.writeFile(
          './app/config.json',
          JSON.stringify(jsonData, null, 2), 'utf8',
      );
    },
  };
};

module.exports = {
  loadConfig,
};
