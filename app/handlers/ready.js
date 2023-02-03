const ready = (client) => {
  return async () => {
    console.log(`Logged in as ${client.user.tag}!`);
  };
};

module.exports = {ready};
