const axios = require('axios');
const { HttpCodes } = require('../consts');

class AxiosService {
	static instance;

	constructor() {
		if (AxiosService.instance) {
			return AxiosService.instance;
		}
		AxiosService.instance = this;
	}

	defaultOnError(err) {
		if (!err) {
			return;
		}
		console.error(err?.data?.message || err);
		if (err.status === HttpCodes.BAD_REQUEST) {
			throw 'got status 400 - bad request';
		} else if (err.status === HttpCodes.UNAUTHORIZE) {
			throw 'got status 401 - unauthorized';
		} else if (err.status === HttpCodes.NOT_FOUND) {
			throw 'got status 404 - not found';
		} else if (err.status === HttpCodes.RATE_LIMIT) {
			throw 'got status 204 - rate limit';
		} else if (err.status === HttpCodes.FORBIDDEN) {
			throw 'got status 403 - forbidden';
		}
		throw `Error: ${err}`;
	}

	defaultOnSuccess(response) {
		// console.log('response ?', response);
		return response;
	}

	async get(route, params, onSuccess, onError) {
		if (!onSuccess) {
			onSuccess = this.defaultOnSuccess;
		}
		if (!onError) {
			onError = this.defaultOnError;
		}
		try {
			const response = await axios.get(route, params);
			return onSuccess(response.data);
		} catch (error) {
			onError(error);
		}
	}

	async post(route, params, onSuccess, onError) {
		if (!onSuccess) {
			onSuccess = this.defaultOnSuccess;
		}
		if (!onError) {
			onError = this.defaultOnError;
		}
		const options = {
			headers: { 'Content-Type': 'application/json' },
		};
		try {
			const response = await axios.post(route, params, options || {});
			return onSuccess(response.data);
		} catch (error) {
			onError(error);
		}
	}

	async put(route, params, onSuccess, onError) {
		if (!onSuccess) {
			onSuccess = this.defaultOnSuccess;
		}
		if (!onError) {
			onError = this.defaultOnError;
		}
		const options = {
			headers: { 'Content-Type': 'application/json' },
		};
		try {
			const response = await axios.put(route, params, options || {});
			return onSuccess(response.data);
		} catch (error) {
			onError(error);
		}
	}

	async delete(route, onSuccess, onError) {
		if (!onSuccess) {
			onSuccess = this.defaultOnSuccess;
		}
		if (!onError) {
			onError = this.defaultOnError;
		}
		try {
			const response = await axios.delete(route);
			return onSuccess(response.data);
		} catch (error) {
			onError(error);
		}
	}
}

module.exports = AxiosService;
