// Logger.js
import { appendFileSync } from 'fs';

/**
 * A dead simple logger class.
 */
class Logger {
	#filename = '';
	constructor(filename) {
		this.#filename = filename;
	}

	logData(data) {
		appendFileSync(this.#filename, `Data: ${data}\n`);
	}

	logError(error) {
		appendFileSync(this.#filename, `Error: ${error}\n`);
	}

	logInfo(info) {
		appendFileSync(this.#filename, `Info: ${info}\n`);
	}

	log(message, type = '') {
		appendFileSync(this.#filename, `${type !== ''? type + ': ' : ''}${message}\n`);
	}
}

// Standalone logging functions
function logData(filename, data) {
	//const logger = new Logger(filename);
	//logger.logData(data);
	appendFileSync(filename, `Data: ${data}\n`);
}

function logError(filename, error) {
	//const logger = new Logger(filename);
	//logger.logError(error);
	appendFileSync(filename, `Error: ${error}\n`);
}

function logInfo(filename, info) {
	//const logger = new Logger(filename);
	//logger.logInfo(info);
	appendFileSync(filename, `Info: ${info}\n`);
}

// Exports
export default Logger;
export { logData, logError, logInfo };
