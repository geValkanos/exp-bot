const logger = require('../common/logger.js').getLogger('ready-handler');

const ready = () => {
  return async () => {
    logger.info('Bot is ready');
  };
};

module.exports = {ready};
