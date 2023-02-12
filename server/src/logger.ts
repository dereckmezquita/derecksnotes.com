import winston from 'winston';

const debug = true;

export const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: '/html/derecksnotes.com-logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: '/html/derecksnotes.com-logs/combined.log' })
    ],
});

if (debug) {
    logger.add(new winston.transports.Console({
        format: winston.format.simple()
    }));
}

// if (process.env.NODE_ENV !== 'production') {
//     logger.add(new winston.transports.Console({
//         format: winston.format.simple(),
//     }));
// }

// Use the logger
// logger.error('This is an error');
// logger.warn('This is a warning');
// logger.info('This is an info');
// logger.debug('This is a debug message');

// In this example, the logger is configured to log information at the info level and above. The log information is stored in two files, error.log and combined.log, and the format of the log information is in JSON. If the environment is not production, the logger is also configured to log information to the console.

// You can then use the logger in your code by calling the different log levels, such as logger.error, logger.warn, logger.info, and logger.debug. The log information will be written to the specified transports (e.g. file, console).