/**
 * Command information.
 */
const info = {
	name: 'placeholder',
	desc: 'placeholder'
};

/**
 * Execute command with given arguments.
 * 
 * @param {Discord.Client} client Bot client
 * @param {string[]} arguments Command arguments
 * @param {Discord.Message} message Message that contained the command.
 */
const execute = async (client, arguments, message) => {};

module.exports = { info: info, execute: execute };
