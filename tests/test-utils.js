const models = require('../app/models');
const {defaultConfig} = require('../app/config.js');

/**
 * A dummy class that represents a resource for testing.
 * @class
 */
class DummyResource {
  /**
   * Creates the instance at the database.
   * @function
   * @param{object} fields The fields of the new dummy resource.
   */
  async create(fields) {
    await this.model.create({
      ...this.primaryKey, ...fields,
    });
  };
  /**
   * Deletes the instance from the database.
   * @function
   */
  async delete() {
    await this.model.destroy({
      where: {...this.primaryKey},
    });
  };
  /**
   * Gets the instance from the database.
   * @function
   */
  async get() {
    return await this.model.findOne({
      where: {...this.primaryKey},
    });
  };
}

/**
 * A dummy guild class for testing.
 * @class
 */
class TestGuild extends DummyResource {
  /**
   * Creates an instance of TestGuild
   * @constructor
   * @param {string} guildId - The id of the test guild.
   */
  constructor(guildId) {
    super();
    this.model = models.Guild;
    this.primaryKey = {id: guildId};
  }
  /**
   * * Creates the instance at the database.
   * @function
   */
  async create() {
    await super.create({
      expConditions: defaultConfig.default.expConditions,
    });
  }
};

/**
 * A dummy user class for testing.
 * @class
 */
class TestUser extends DummyResource {
  /**
   * Creates an instance of TestUser.
   * @constructor
   * @param {string} userId - The id of the test user.
   * @param {string} guildId - The id of the test guild.
   */
  constructor(userId, guildId) {
    super();
    this.model = models.User;
    this.primaryKey = {
      id: userId,
      guildId: guildId,
    };
  }
};

/**
 * A dummy tier class for testing.
 * @class
 */
class TestTier extends DummyResource {
  /**
   * Creates an instance of TestUser.
   * @constructor
   * @param {string} roleId - The id of the test tier.
   * @param {string} guildId - The id of the test guild.
   */
  constructor(roleId, guildId) {
    super();
    this.model = models.Tier;
    this.primaryKey = {
      id: roleId,
      guildId: guildId,
    };
  }

  /**
   * * Creates the instance at the database.
   * @function
   * @param {Integer} color The color code of the tier.
   */
  async create(color=0) {
    await super.create({
      color, experience: 42,
    });
  }
};

module.exports = {
  TestGuild, TestUser, TestTier,
};
