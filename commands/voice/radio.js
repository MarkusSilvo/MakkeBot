const radio = require('../../radiostations');
const Discord = require('discord.js')

/**
 * Command information.
 */
const info = {
	name: 'radio',
	desc: 'Plays given internet radio.'
};

/**
 * Plays given radio station in the voice channel.
 * !radio list -- List all available radio channels.
 * 
 * @param {Discord.Client} client Bot client
 * @param {string[]} arguments Command arguments
 * @param {Discord.Message} message Message that contained the command.
 */
const execute = async (client, arguments, message) => {
	// Get user voice channel
	var voiceChannel = message.member.voiceChannel;

	// If user is not on the voice channel.
	if (!voiceChannel) {
		await message.reply('You need to join a voice channel first!');
		return;
	}

	// There was no radio name given as an argument.
	if (arguments.length < 1) {
		await message.reply('Was expecting station name as an argument. Try `!radio list` to list all available stations.');
		return;
	}

	// There was 1 argument and it was 'list'
	if (arguments.length == 1 && (arguments[0] == 'list')) {
		let msg = 'I currently know these radio stations:\n';

		// Go through each object in stations array
		for (let i = 0; i < radio.stations.length; ++i) {
			// Add radio name to message.
			msg += radio.stations[i].name + '\n';
		}

		await message.reply(msg);
		return;
	}

	// Join all arguments together separeted by spaces to get radio station name.
	const radioName = arguments.join(' ');

	// Try find radio by it's name from the stations array.
	const station = radio.stations.find(x => x.name.toLowerCase() == radioName.toLowerCase());
	
	// Radio station doesn't exist on the stations list.
	if (!station) {
		await message.reply(`Sorry, I didn't find radio station: '${radioName}'`);
		return;
	}

	//Join the voice channel
	await voiceChannel.join().then(async connection => {
		await message.reply('I have successfully connected to the voice channel!');
		// Play sound from url.
		const dispatcher = await connection.playArbitraryInput(station.url);

		// When sound playing finished.
		dispatcher.on('end', async end => {

			// Leave the channel.
			await voiceChannel.leave();
		});

		dispatcher.on('error', async err => {
			await voiceChannel.leave();
			console.error(err);
		});

	}).catch(err => console.log(err));
};

module.exports = { info: info, execute: execute };
