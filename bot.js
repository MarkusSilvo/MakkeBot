// secret stuff etc credentials
const credentials = require('./credentials');

// Get Discord module
const Discord = require('discord.js');

// 1u.fi API
const _1uApi = require('./1uapi');

// Create an instance of a Discord client
const client = new Discord.Client();

// Require all available commands
const glob = require('glob')
const path = require('path');

const commands = {};

glob.sync('./commands/**/*.js').forEach((file) => {
	let cmd = require(path.resolve(file));
	commands[cmd.name] = cmd;
});

// Credentials for login
client.login(credentials.discordToken);

// When turned on and ready
client.on('ready', () => {
	console.log('I am ready to work!');

	// Alternatively, you can set the activity to any of the following:
	// PLAYING, STREAMING, LISTENING, WATCHING
	// For example:
	client.user.setActivity('Twitch', {type: 'WATCHING'});

	// The generall channel id for my server is: 664077701140709440
	// var generalChannel = client.channels.get("664077701140709440") // Replace with known channel ID
	// generalChannel.send("I'm online! :)")  
});

// Create an event listener for new guild members
client.on('guildMemberAdd', member => {
	// Send the message to a designated channel on a server:
	const channel = member.guild.channels.find(ch => ch.name === 'member-log');
	// Do nothing if the channel wasn't found on this server
	if (!channel) return;
	// Send the message, mentioning the member
	channel.send(`Welcome to the server, ${member}`);
});

// When receiving message
client.on('message', (message) => {
	// Prevent bot from responding to its own messages
	if (message.author == client.user) {
		return;
	}

	// Message starts with '!' so it's an command.
	if (message.content.startsWith('!')) {
		processCommand(message);
	}
});

function processCommand(message) {
	// Remove first character '!' and split the message up in to pieces by each space
	let splittedMessage = message.content.substr(1).split(' ');

	// The first word directly after the exclamation is the command
	let commandName = splittedMessage[0];

	// All other words are arguments for the command
	let arguments = splittedMessage.slice(1);

	// Commands contains commandName.
	if (commandName in commands) {
		// Execute command!
		commands[commandName].execute(client, arguments, message);
		return;
	}

	message.channel.send(`Command: ${commandName} doesn't exist. You can use '!help' to find more about commands!`);
}

// Internet radio "NRJ" - will be changed in future releases to support multiple radio's
client.on('message', message => {
	// Voice only works in guilds, if the message does not come from a guild,
	// we ignore it
	if (!message.guild) return;

	// If message is '/join'
	if (message.content === '/nrj') {

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
	}
});