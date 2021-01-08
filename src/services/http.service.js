const AxiosService = require('../services/axios.service');

const prefix = 'https://api.github.com';

class HttpService {
	static instance;
	axiosService;

	constructor() {
		if (HttpService.instance) {
			return HttpService.instance;
		}
		HttpService.instance = this;
		this.axiosService = new AxiosService();
	}

	async getCommitsByPathFile(nameUser, repoName, path) {
		try {
			console.log('Try to get Commits by path file');
			const response = await this.axiosService.get(prefix + `/repos/${nameUser}/${repoName}/commits?path=${path}`);
			console.log(`Final to get Commits by path file, response: ${response.data}`);
			return response;
		} catch (ex) {
			const err = `Failed while trying to get commits by path file, Error: ${JSON.stringify(ex)}`;
			console.error(err);
			throw err;
		}
	}
}

module.exports = HttpService;
