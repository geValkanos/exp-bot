const isOnActiveExpMode = (dbUser, state, expConditions) => {
  return dbUser.isActive &&
    !!state.channelId &&
    (state.serverDeaf ^ expConditions.serverDeaf) &&
    (state.serverMute ^ expConditions.serverMute) &&
    (state.selfMute ^ expConditions.selfMute) &&
    (state.selfDeaf ^ expConditions.selfDeaf) &&
    (state.suppress ^ expConditions.suppress);
};

module.exports = {
  isOnActiveExpMode,
};
