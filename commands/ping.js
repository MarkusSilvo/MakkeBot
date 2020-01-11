/**
 * Command information.
 */
const info = {
	name: 'ping',
	desc: 'Used to check if bot is alive'
};

/**
 * Sends pong back to user.
 * 
 * @param {Discord.Client} client Bot client
 * @param {string[]} arguments Command arguments
 * @param {Discord.Message} message Message that contained the command.
 */
const execute = async (client, arguments, message) => {
	// Get MakkeBot emote
	let botEmote = client.emojis.find(emoji => emoji.name === 'MakkeBot');
	// Reply to user.
	await message.reply(`Pong! ${botEmote != null ? botEmote : ''}`);
};

module.exports = { info: info, execute: execute };
