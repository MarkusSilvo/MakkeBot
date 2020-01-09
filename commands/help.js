const glob = require('glob');
const path = require('path');

/**
 * Command name.
 */
const name = 'help';

/**
 * Command description.
 */
const desc = 'Lists all commands!';

/**
 * Sends all commands to the user.
 * 
 * @param {Discord.Client} client Bot client
 * @param {string[]} arguments Command arguments
 * @param {Discord.Message} message Message that contained the command.
 */
const execute = (client, arguments, message) => {
	let msg = '';
	glob.sync('./commands/**/*.js').forEach((file) => {
		let cmd = require(path.resolve(file));
		msg += `!${cmd.name} -- ${cmd.desc}\n`;
	});

	message.channel.send(msg);
};


module.exports = {
	name: name,
	desc: desc,

	execute: execute
};