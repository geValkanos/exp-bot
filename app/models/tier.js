const define = (database, types) => {
  const Tier = database.define('Tier', {
    // Tier ID.
    id: {
      type: types.BIGINT,
      primaryKey: true,
      field: 'id',
    },
    // Guild ID the tier is assossiated.
    guildId: {
      type: types.BIGINT,
      allowNull: false,
      field: 'guild_id',
    },
    // At what exp the tier is achievable.
    experience: {
      type: types.BIGINT,
      allowNull: false,
      field: 'experience',
    },
    // Color of the tier.
    color: {
      type: types.INTEGER,
      allowNull: false,
      field: 'color',
    },
    // When the tier was created.
    createdAt: {
      type: types.DATE,
      field: 'created_at',
    },
    // When the tier was last updated.
    updatedAt: {
      type: types.DATE,
      field: 'updated_at',
    },
  }, {
    name: {
      singular: 'tier',
      plural: 'tiers',
    },
    tableName: 'tiers',
  });

  Tier.createAssociations = (models) => {
    models.Tier.belongsTo(models.Guild, {
      foreignKey: 'guildId', targetKey: 'id',
    });
  };

  return Tier;
};

module.exports = define;
