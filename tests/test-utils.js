const models = require('../app/models');
const {defaultConfig} = require('../app/config.js');

/**
 * A dummy guild class for testing.
 * @class
 */
class TestGuild {
  /**
   * Creates an instance of TestGuild
   * @constructor
   * @param {string} guildId - The id of the test guild.
   */
  constructor(guildId) {
    this.id = guildId;
  }

  create = async () => {
    const testGuild1 = new models.Guild({
      id: this.id,
      expConditions: defaultConfig.default.expConditions,
      expToRolesMapping: defaultConfig.default.expToRolesMapping,
    });
    await testGuild1.save();
  };

  delete = async () => {
    await models.Guild.destroy({
      where: {id: this.id},
    });
  };

  get = async () => {
    return await models.Guild.findOne({
      where: {id: this.id},
    });
  };
};

/**
 * A dummy user class for testing.
 * @class
 */
class TestUser {
  /**
   * Creates an instance of TestUser.
   * @constructor
   * @param {string} userId - The id of the test user.
   * @param {string} guildId - The id of the test guild.
   */
  constructor(userId, guildId) {
    this.id = userId;
    this.guildId = guildId;
  }

  create = async () => {
    const testUser1 = new models.User({
      id: this.id,
      guildId: this.guildId,
    });
    await testUser1.save();
  };

  delete = async () => {
    await models.User.destroy({
      where: {id: this.id, guildId: this.guildId},
    });
  };

  get = async () => {
    return await models.User.findOne({
      where: {id: this.id, guildId: this.guildId},
    });
  };
};


module.exports = {
  TestGuild, TestUser,
};
