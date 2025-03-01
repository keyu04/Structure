const winston = require('winston');

const format = winston.format.combine(
    winston.format.colorize({ all: true, colors: { info: 'blue', error: 'red' } }),
    winston.format.errors({ stack: true }),
    // winston.format.cli({ all: true, colors: { info: 'blue', error: 'red' } }),
    winston.format.timestamp({ format: 'DD-MM-YYYY HH:mm:ss:ms A', }),
    winston.format.printf((info) => {
        let timestamp = winston.format.colorize().colorize('info', info.timestamp);

        if (info.stack || info.level.includes('error')) {
            let stack = info.stack;
            let coloredStack;

            if (stack) {
                timestamp = winston.format.colorize().colorize('error', info.timestamp);
                coloredStack = stack.split('\n').map((line) => winston.format.colorize().colorize('error', line));

                return `\n${timestamp} : ${info.level} - ${info.message.trim()} ${coloredStack}`;
            } else {
                timestamp = winston.format.colorize().colorize('error', info.timestamp);
                return `\n${timestamp} : ${info.level} - ${info.message.trim()}`;
            }
        }

        return `${timestamp} : ${info.level} - ${info.message.trim()}`;
    })
);

global.logger = winston.createLogger({
    // levels: config.syslog.levels,
    defaultMeta: { component: 'user-service' },
    format: format,
    transports: [new winston.transports.Console()],
});