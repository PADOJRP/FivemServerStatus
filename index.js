const setup = require('./setup.js');
const { start } = require('./bot.js');

const printValues = function (values, text) {
	console.log(text || 'Current values:');
	for (const key in values) {
		console.log(`  ${key} = \x1b[32m'${values[key]}'\x1b[0m`);
	}
};

const startBot = function (values) {
	console.log('Starting bot');
	let bot = start(values);
	bot.on('restart', () => {
		console.log('\nRestarting bot');
		bot.destroy();
		bot = start(values);
	});
	const shutdown = function () {
		console.log('Shutting down');
		const destructor = bot.destroy();

		if (destructor) {
			destructor.then(() => {
				process.exit(0);
			}).catch(console.error);
		} else {
			process.exit(0);
		}
	};

	process.on('SIGINT', shutdown);
	process.on('SIGTERM', shutdown);
};

if (process.argv.includes('-c') || process.argv.includes('--config')) {
	setup.loadValues().then((values) => {
		printValues(values);
		process.exit(0);
	})
		.catch((error) => {
			console.log('Unable to load saved values, configuring all again');
			setup.createValues().then((values) => {
				setup.saveValues(values).then(() => {
					printValues(values, 'New values:');
					process.exit(0);
				})
					.catch(console.error);
			})
				.catch(console.error);
		});
} else {
	console.log('Attempting to load enviroment');
	setup.loadValues().then((values) => {
		startBot(values);
	})
		.catch((error) => {
			console.error(error);
			setup.createValues().then((values) => {
				setup.saveValues(values).then(() => {
					startBot(values);
				})
					.catch(console.error);
			})
				.catch(console.error);
		});
}
