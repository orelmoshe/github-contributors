const util = require('util');
const shell = require('shelljs');
const exec = util.promisify(shell.exec);
const readdir = require('recursive-readdir');
const HttpService = require('../services/http.service');

const getUserNameAndRepoName = (url) => {
	try {
		console.log(`Try to get user name and repo name, ${url}`);
		let userName = '';
		let repoName = '';
		if (url.startsWith('https://') || url.startsWith('http://')) {
			const withoutSchema = url.split('//')[1];
			userName = withoutSchema.split('/')[1];
			repoName = withoutSchema.split('/')[2];
		} else if (url.startsWith('www') || url.startsWith('github')) {
			userName = url.split('/')[1];
			repoName = url.split('/')[2];
		}
		console.log(`Final to get user name and repo name, ${url}`);
		return {
			userName,
			repoName,
		};
	} catch (ex) {
		const err = `Failed while trying to get user name and repo name, Error:${JSON.stringify(ex)}`;
		console.error(err);
		throw err;
	}
};

const cloneRepo = async (url) => {
	return new Promise(async (resolve, reject) => {
		try {
			console.log(`Try to clone repo from: ${url}`);
			const path = 'src/repo';
			shell.cd(path);
			await exec(`git clone ${url}`);
			console.log(`Final to clone repo from: ${url}`);
			return resolve();
		} catch (ex) {
			const err = `Failed while trying to clone repo, Error:${JSON.stringify(ex)}`;
			console.error(err);
			return reject(err);
		}
	});
};

const getPathFiles = async (repoName) => {
	return new Promise(async (resolve, reject) => {
		try {
			console.log(`Try to get path files, repoName: ${repoName}`);
			const files = await readdir(repoName);
			const filesWithPurePath = files.reduce((acc, next) => {
				const newPath = next.replace(/\\/g, '/');
				const purePath = newPath.split(`${repoName}/`)[1];
				if (purePath.startsWith('.git/')) {
					return acc;
				}
				return acc.concat(purePath);
			}, []);
			console.log(`Final to get path files, repoName: ${repoName}`);
			return resolve(filesWithPurePath);
		} catch (ex) {
			const err = `Failed while trying to get path files, Error:${JSON.stringify(ex)}`;
			console.error(err);
			return reject(err);
		}
	});
};

const getPathOfAllServices = async (pathList, repoName) => {
	return new Promise(async (resolve, reject) => {
		try {
			console.log(`Try to get path of all services, pathList: ${pathList}`);
			const filterPathList = pathList.reduce((acc, next) => {
				if (next.endsWith('package.json')) {
					const prefixPath = next.split('package.json')[0];
					const data = require(`../repo/${repoName}/${prefixPath}/package.json`);
					const name = data.name ? data.name : 'default service';
					if (prefixPath[prefixPath.length - 1] === '/') {
						return acc.concat({ name, path: prefixPath.slice(0, prefixPath.length - 1) });
					}
					return acc.concat({ name, path: prefixPath });
				}
				return acc;
			}, []);
			console.log(`Final to get path of all services, filterPathList: ${filterPathList}`);
			return resolve(filterPathList);
		} catch (ex) {
			const err = `Failed while trying to get path of all services, Error: ${JSON.stringify(ex)}`;
			console.error(err);
			return reject(err);
		}
	});
};

const calculateDevelopmentOwner = (commits) => {
	try {
		console.log(`Try to calculate development owner, commits: ${commits}`);
		if (!commits || commits.length === 0) {
			return null;
		}
		let result = commits[0].commit.committer;
		let minDate = new Date(result.date).getTime();
		for (const item of commits) {
			if (new Date(item.commit.committer.date).getTime() <= minDate) {
				minDate = new Date(item.commit.committer.date).getTime();
				result = item.commit.committer;
			}
		}
		console.log(`Final to calculate development owner, result: ${result}`);
		return result;
	} catch (ex) {
		const err = `Failed while trying to calculate development owner, Error: ${JSON.stringify(ex)}`;
		console.error(err);
		throw err;
	}
};

const getFilesWithOwners = async (userName, repoName, files) => {
	try {
		console.log(`Try to get files with owners, userName: ${userName}, repoName: ${repoName}, files: ${files}`);
		const httpService = new HttpService();
		const arrPromise = files.map((path) => httpService.getCommitsByPathFile(userName, repoName, path));
		return Promise.all(arrPromise).then((listCommitsByFile) => {
			return listCommitsByFile.reduce((acc, next, index) => {
				const item = {
					path: files[index] ? files[index] : 'default service',
					devOwner: calculateDevelopmentOwner(next),
				};
				return acc.concat(item);
			}, []);
		});
	} catch (ex) {
		const err = `Failed while trying to get files with owners, Error: ${JSON.stringify(ex)}`;
		console.error(err);
		return reject(err);
	}
};

module.exports = { getUserNameAndRepoName, cloneRepo, getPathFiles, getPathOfAllServices, getFilesWithOwners };
