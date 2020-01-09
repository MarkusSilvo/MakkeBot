/**
 * Command information.
 */
const info = {
	name: 'manly',
	desc: 'Gives manly percentage'
};

/**
 * Execute command with given arguments.
 * 
 * @param {Discord.Client} client Bot client
 * @param {string[]} arguments Command arguments
 * @param {Discord.Message} message Message that contained the command.
 */
const execute = (client, arguments, message) => {

	// Generate random number between 1-100
	let manlyPercentage = Math.floor(Math.random() * 101);
	let gachiEmote = client.emojis.find(emoji => emoji.name === "gachiGASM");
	message.reply(`You're ${manlyPercentage}% manly ${gachiEmote}`);
};

module.exports = { info: info, execute: execute };
