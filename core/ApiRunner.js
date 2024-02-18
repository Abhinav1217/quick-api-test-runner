import axios from 'axios';
import path from 'path';
import fs from 'fs';

export default class ApiRunner {

	#url = "";
	#token = "";
	#logPath = "./logs";
	#logfile = "";
	/**
	 * @prop {('GET' | 'POST' | 'PUT' | 'DELETE')}
	 */
	#httpMethod = "GET";

	/**
	 *
	 * @param {string} url mandatory
	 * @param {string} token
	 */
	constructor(url, token = '') {
		this.#url = url;
		this.#token = this.createBasicAuthToken(token);
		this.#logfile = this.#getLogFileName();
	}

	/**
	 * @property
	 */
	#config = {
		method: this.#httpMethod,
		headers: { 'Authorization': `${this.#token}` }
	}

	/**
	 * Set URL that is to be used by object
	 * @param {string} url
	 * @returns {void}
	 */
	setURL = (url) => this.#url = url;

	/**
	 * Prefix token string with `Basic ` and set it as api token.
	 * @param {string} token
	 * @returns {void}
	 */
	setToken = (token) => this.#token = this.createBasicAuthToken(token);

	/**
	 * Change scope of log file by renaming file with scope prefix.
	 *
	 * @param {string} scope
	 * @returns {void}
	 */
	setScope = (scope) => this.#logfile = this.#getLogFileName(scope);

	/**
	 * Set HttpMethod for your api call.
	 * @param {('GET' | 'POST' | 'PUT' | 'DELETE')} HttpMethod
	 * @returns {void}
	 */
	setMethod = (HttpMethod) => this.#httpMethod = HttpMethod;

	/**
	 * Provide an axios config object for configuring request.
	 * @param {(import('axios').AxiosRequestConfig | SimpleRequestConfig)} config
	 * @returns {void}
	 */
	configureRequest = (config) => this.#config = config;


	/**
	 * This function will be used to generate a named log file
	 * @private
	 * @param {string} scopeName
	 * @returns {void}
	 */
	#getLogFileName(scopeName = '') {
		const now = new Date();
		const year = now.getFullYear();
		const month = (now.getMonth() + 1).toString().padStart(2, '0');
		const day = now.getDate().toString().padStart(2, '0');
		const hours = now.getHours().toString().padStart(2, '0');
		const prefix = scopeName ? `${scopeName}-` : '';
		return `${prefix}log-${year}-${month}-${day}_${hours}.log`;
	}

	/**
	 * Prefix token with `Basic `
	 * @param {string} token token string without Basic prefix
	 * @returns {string} Basic auth token
	 */
	createBasicAuthToken = (token) => { return `Basic ${token}` };

	sleep = (ms) => { return new Promise(resolve => setTimeout(resolve, ms)) }

	/**
	 * Make a request and logs response in the log file,
	 * @param {string} url
	 *
	 * @todo option to return response object so that caller can utilize it as it sees fit.
	 * @todo figure out a way to abstract the config object out from the function.
	 *
	 */
	async makeRequest(url) {
		const logFilePath = path.join(this.#logPath, this.#logfile);
		url = url ?? this.#url;
		let returnObj = {};
		returnObj.url = url;

		try {
			const response = await axios.get(url, {
				method: this.#httpMethod,
				// headers: { 'Authorization': `${this.#token}` }
			});
			let data = JSON.stringify(response.data);
			fs.appendFileSync(logFilePath, `Calling API: ${url}\nResponse: ${data}\n`);

		} catch (error) {
			fs.appendFileSync(logFilePath, `Error in calling ${url}: ${error.message}\n `);
			if (error.response && error.response.data) {
				const errorMessage = `\nResponse data: ${JSON.stringify(error.response.data)}\n`;
				fs.appendFileSync(logFilePath, `${errorMessage}`);

			}
		}
	}
};
