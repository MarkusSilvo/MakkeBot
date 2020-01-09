/**
 * Command name.
 */
const name = 'placeholder';

/**
 * Command description.
 */
const desc = 'placeholder';

/**
 * Execute command with given arguments.
 * 
 * @param {Discord.Client} client Bot client
 * @param {string[]} arguments Command arguments
 * @param {Discord.Message} message Message that contained the command.
 */
const execute = (client, arguments, message) => {};


module.exports = {
	name: name,
	desc: desc,

	execute: execute
};