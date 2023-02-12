const define = (database, types) => {
  const User = database.define('User', {
    // User ID.
    id: {
      type: types.BIGINT,
      primaryKey: true,
      field: 'id',
    },
    // Guild ID.
    guildId: {
      type: types.BIGINT,
      primaryKey: true,
      field: 'guild_id',
    },
    // User's total exp number in the guild.
    experience: {
      type: types.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'experience',
    },
    // The voice channel the user is in (if any)
    voiceChannelId: {
      type: types.BIGINT,
      allowNull: true,
      field: 'voice_channel_id',
    },
    // If the user is actively exp-ing.
    isOnExpMode: {
      type: types.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'is_on_exp_mode',
    },
    // If the user is currently a member of the guild.
    isActive: {
      type: types.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: 'is_active',
    },
    // When the user, guild was created.
    createdAt: {
      type: types.DATE,
      field: 'created_at',
    },
    // When the user,guild was last updated.
    updatedAt: {
      type: types.DATE,
      field: 'updated_at',
    },
  }, {
    name: {
      singular: 'user',
      plural: 'users',
    },
    tableName: 'users',
  });

  User.createAssociations = (models) => {
    models.User.belongsTo(models.Guild, {foreignKey: 'guildId', target: 'id'});
  };

  return User;
};

module.exports = define;

