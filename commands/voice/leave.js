/**
 * Command information.
 */
const info = {
	name: 'leave',
	desc: 'Makes bot leave voice channel.'
};

/**
 * Leaves voice channel.
 * 
 * @param {Discord.Client} client Bot client
 * @param {string[]} arguments Command arguments
 * @param {Discord.Message} message Message that contained the command.
 */
const execute = async (client, arguments, message) => {

	// Bot is not in the voice channel.
	if (client.voiceConnections.size == 0) {
		await message.reply('I\'m not connected to any voice channel.');
		return;
	}

	client.voiceConnections.forEach(async connection => {
		// Bot voice channel is same as users.
		if (connection.channel === message.member.voiceChannel) {
			await connection.disconnect();
		}
	});
};

module.exports = { info: info, execute: execute };
