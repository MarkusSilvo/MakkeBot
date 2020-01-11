const _1uApi = require('../1uapi');

/**
 * Command information.
 */
const info = {
	name: 'short',
	desc: 'Shortens given url.'
};

/**
 * Sends given url as shortened to the user.
 * 
 * @param {Discord.Client} client Bot client
 * @param {string[]} arguments Command arguments
 * @param {Discord.Message} message Message that contained the command.
 */
const execute = async (client, arguments, message) => {
	// If there is less than 1 argument given.
	if (arguments.length < 1) {
		await message.reply('Error: Give url to shorten!');
		return;
	}

	// First argument (arguments[0]) is url to shorten.
	// !short <url_here> <-- is the first in the argument list.
	// createShortUrl returns callback with JSON response from API.
	_1uApi.createShortUrl(arguments[0], async (response) => {

		// API told us that there was an error.
		if (response.error) {
			await message.reply(`API Error: ${response.msg}`);
		} else {
			// Everything went good, send shortened url.
			await message.reply(`Here is your url shortened! ${response.short}`);
		}
	});
};

module.exports = { info: info, execute: execute };
