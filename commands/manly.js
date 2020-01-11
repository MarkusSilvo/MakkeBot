/**
 * Command information.
 */
const info = {
	name: 'manly',
	desc: 'Gives manly percentage'
};

/**
 * Gives user manliness percentage.
 * 
 * @param {Discord.Client} client Bot client
 * @param {string[]} arguments Command arguments
 * @param {Discord.Message} message Message that contained the command.
 */
const execute = async (client, arguments, message) => {

	// Generate random number between 1-100
	let manlyPercentage = Math.floor(Math.random() * 101);
	// Get gachiGASM emote
	let gachiEmote = client.emojis.find(emoji => emoji.name === 'gachiGASM');
	
	await message.reply(`You're ${manlyPercentage}% manly ${gachiEmote != null ? gachiEmote : ''}`);
};

module.exports = { info: info, execute: execute };
