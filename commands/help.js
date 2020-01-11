const glob = require('glob');
const path = require('path');

/**
 * Command information.
 */
const info = {
	name: 'help',
	desc: 'Lists all commands.'
};

/**
 * Sends all commands to the user.
 * 
 * @param {Discord.Client} client Bot client
 * @param {string[]} arguments Command arguments
 * @param {Discord.Message} message Message that contained the command.
 */
const execute = async (client, arguments, message) => {
	let msg = '';
	glob.sync('./commands/**/*.js').forEach((file) => {
		let cmd = require(path.resolve(file));
		msg += `!${cmd.info.name} -- ${cmd.info.desc}\n`;
	});

	await message.reply(msg);
};


module.exports = { info: info, execute: execute };
