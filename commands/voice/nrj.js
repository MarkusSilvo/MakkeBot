/**
 * Command information.
 */
const info = {
	name: 'nrj',
	desc: 'Makes bot play NRJ internet radio.'
};

/**
 * Play NRJ internet radio in voice channel.
 * 
 * @param {Discord.Client} client Bot client
 * @param {string[]} arguments Command arguments
 * @param {Discord.Message} message Message that contained the command.
 */
const execute = (client, arguments, message) => {
	// Get user voice channel
	var voiceChannel = message.member.voiceChannel;

	// If user is on the voice channel.
	if (voiceChannel) {

		// Join the voice channel
		voiceChannel.join().then(connection => {

			message.reply('I have successfully connected to the voice channel!');
			// Play sound from url.
			const dispatcher = connection.playArbitraryInput('http://cdn.nrjaudio.fm/adwz1/fi/35001/mp3_128.mp3');
			
			// When sound playing finished.
			dispatcher.on('end', end => {

				// Leave the channel.
				voiceChannel.leave();
			});

		// Failed to join voice channel, print error to the console.
		}).catch(err => console.log(err));
	} else {

		// User was not in the voice channel.
		message.reply('You need to join a voice channel first!');
	}
};

module.exports = { info: info, execute: execute };
