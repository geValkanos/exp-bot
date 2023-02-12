const winston = require('winston');

const levelToUpper = winston.format.printf((context) => {
  context.level = context.level.toUpperCase();
  return context;
});

const transform = winston.format.printf((context) => {
  const baseString = `[${context.level}][${context.timestamp}]`;
  return `${baseString} [${context.label}]: ${context.message}`;
});

const cachedLoggers = new Set();

const getLogger = (component) => {
  if (!cachedLoggers.has(component)) {
    const options = {
      format: winston.format.combine(
          winston.format.label({label: component}),
          winston.format.timestamp(),
          levelToUpper,
          winston.format.colorize(),
          winston.format.splat(),
          transform,
      ),
      level: process.env.LOG_LEVEL,
    };
    winston.loggers.add(component, {
      transports: [new winston.transports.Console(options)],
    });
    cachedLoggers.add(component);
  }

  return winston.loggers.get(component);
};

module.exports = {getLogger};
