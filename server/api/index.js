const { createApp } = require('../dist/app');
const { connectDatabase } = require('../dist/config/database');

const app = createApp();
let dbInit;

module.exports = async (req, res) => {
	if (!dbInit) {
		dbInit = connectDatabase();
	}
	await dbInit;
	return app(req, res);
};
