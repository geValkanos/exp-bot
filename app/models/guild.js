const define = (database, types) => {
  const Guild = database.define('Guild', {
    // Guild ID.
    id: {
      type: types.BIGINT,
      primaryKey: true,
      field: 'id',
    },
    // When the guild was created.
    createdAt: {
      type: types.DATE,
      field: 'created_at',
    },
    // When the guild was last updated.
    updatedAt: {
      type: types.DATE,
      field: 'updated_at',
    },
  }, {
    name: {
      singular: 'guild',
      plural: 'guilds',
    },
    tableName: 'guilds',
  });

  Guild.prototype.toJSON = function() {
    const values = Object.assign({ }, this.get());
    delete values.id;
    return values;
  };

  Guild.createAssociations = (models) => {
    models.Guild.hasMany(models.User, {foreignKey: 'guildId', sourceKey: 'id'});
  };

  return Guild;
};

module.exports = define;

