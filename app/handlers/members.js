const models = require('../models');

const addMember = () => {
  return async (member) => {
    try {
      console.log(member.user);
      const user = await models.User.findOne({
        discordId: member.user.id,
      });
      if (!user) {
        const newUser = new models.User({
          discordId: member.user.id,
        });
        console.log(newUser);
        await newUser.save();
      } else if (!user.isActive) {
        user.isActive = true;
        await user.save();
      }
    } catch (error) {
      // Handle error
    }
  };
};

const removeMember = () => {
  return async (member) => {
    try {
      console.log(member.user);
      const user = await models.User.findOne({
        discordId: member.user.id,
      });
      if (user) {
        user.isActive = false;
        await user.save();
      }
    } catch (error) {
      // Handle error
    }
  };
};

module.exports = {
  addMember,
  removeMember,
};
