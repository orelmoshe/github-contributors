const joi = require('@hapi/joi');
const fs = require('fs').promises;
const { ErrorMessage, HttpCodes, TEXT } = require('../consts');
const { getUserNameAndRepoName, cloneRepo, getPathFiles, getPathOfAllServices, getFilesWithOwners } = require('../services/utils.service');

const regexURL = /^[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/;
class Controller {
	instance;
	constructor() {
		if (Controller.instance) {
			return Controller.instance;
		}
		Controller.instance = this;
	}

	async getContributors(req, res) {
		try {
			console.log('Try to get list of contributors by services');
			const schema = joi.object().keys({
				url: joi.string().regex(regexURL).required(),
			});

			const result = schema.validate({ url: req.query.url });

			if (result.error) {
				throw result.error.message;
			}
			const { url } = req.query;
			const { userName, repoName } = getUserNameAndRepoName(url);
			if (!userName || !repoName) {
				throw ErrorMessage.URL_IS_NOT_VALID;
			}

			await cloneRepo(url);
			const listPathFiles = await getPathFiles(repoName);

			const packageJsonPaths = listPathFiles.filter((path) => path.includes('package.json'));
			let results = {};
			let files;
			let arrFiles;
			if (packageJsonPaths.length > 0) {
				const services = await getPathOfAllServices(listPathFiles, repoName);
				const listServices = [];
				for (const service of services) {
					files = listPathFiles.filter((path) => path.startsWith(service.path, 0));
					arrFiles = await getFilesWithOwners(userName, repoName, files);
					const item = {
						name: service.name,
						files: arrFiles,
					};
					listServices.push(item);
				}
				results = {
					url: req.query.url,
					services: listServices,
				};
			} else {
				// If not exists package.json files
				arrFiles = await getFilesWithOwners(userName, repoName, listPathFiles);
				const item = {
					name: TEXT.DEFAULT_SERVICE,
					files: arrFiles,
				};
				results = {
					url: req.query.url,
					services: [item],
				};
			}
			await fs.rmdir(`src/repo/${repoName}`, { recursive: true });
			console.log('directory removed!');
			console.log(`Final to get list of contributors by services, data: ${JSON.stringify(results)}`);
			res.status(HttpCodes.OK).json({ data: results });
		} catch (ex) {
			const err = `Failed while trying to get list of contributors by services, Error:${JSON.stringify(ex)}`;
			console.error(err);
			res.status(HttpCodes.ERROR).json({ message: err });
		}
	}
}

module.exports = Controller;
