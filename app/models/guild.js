const define = (database, types) => {
  const Guild = database.define('Guild', {
    // Guild ID.
    id: {
      type: types.BIGINT,
      primaryKey: true,
      field: 'id',
    },
    expConditions: {
      type: types.JSONB,
      allowNull: false,
      field: 'exp_conditions',
    },
    expToRolesMapping: {
      type: types.JSONB,
      allowNull: false,
      field: 'exp_to_roles_mapping',
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

  Guild.createAssociations = (models) => {
    models.Guild.hasMany(models.User, {foreignKey: 'guildId', sourceKey: 'id'});
  };

  return Guild;
};

module.exports = define;

