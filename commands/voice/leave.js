const Discord = require('discord.js');
/**
 * Command name.
 */
const name = 'leave';

/**
 * Command description.
 */
const desc = 'This is a test command for checking active voice clients.';

/**
 * Leaves voice channel.
 * 
 * @param {Discord.Client} client Bot client
 * @param {string[]} arguments Command arguments
 * @param {Discord.Message} message Message that contained the command.
 */
const execute = (client, arguments, message) => {

	// Bot is not in the voice channel.
	if (client.voiceConnections.size == 0) {
		message.channel.send('I\'m not connected to any voice channel.');
		return;
	}

	client.voiceConnections.forEach((connection) => {
		// Bot voice channel is same as users.
		if (connection.channel === message.member.voiceChannel) {
			connection.disconnect();
		}
	});
};

module.exports = {
	name: name,
	desc: desc,

	execute: execute
};
