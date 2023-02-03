const define = (database, types) => {
  const User = database.define('User', {
    // User ID.
    id: {
      type: types.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: 'id',
    },
    // User's total exp number.
    experience: {
      type: types.INTEGER,
      field: 'experience',
      allowNull: false,
      defaultValue: 0,
    },
    // The id user has on discord.
    discordId: {
      type: types.TEXT,
      allowNull: false,
      field: 'discord_id',
    },
    // If the user is on a voice channel
    onVoice: {
      type: types.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'on_voice',
    },
    // If the user is currently a member of the guild.
    isActive: {
      type: types.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: 'is_active',
    },
    // When the user was created.
    createdAt: {
      type: types.DATE,
      field: 'created_at',
    },
    // When the user was last updated.
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

  User.prototype.toJSON = function() {
    const values = Object.assign({ }, this.get());
    delete values.id;
    delete values.discordId;
    delete values.role;
    return values;
  };

  return User;
};

module.exports = define;

