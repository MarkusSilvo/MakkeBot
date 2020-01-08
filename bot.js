// secret stuff etc credentials
const credentials = require('./credentials');

// Get Discord module
const Discord = require('discord.js');

// 1u.fi API
const _1uApi = require('./1uapi');

// Create an instance of a Discord client
const client = new Discord.Client();

// Credentials for login
client.login(credentials.discordToken);

// When turned on and ready
client.on('ready', () => {
	console.log('I am ready to work!');

	// Set bot status to: "Playing with JavaScript"
	// client.user.setActivity("with JavaScript")

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
client.on('message', (receivedMessage) => {
	if (receivedMessage.author == client.user) { // Prevent bot from responding to its own messages
		return;
	}

	if (receivedMessage.content.startsWith('!')) {
		processCommand(receivedMessage);
	}
	// Prevent bot from responding to its own messages
	if (receivedMessage.author == client.user) {
		return;
	}
	// Check if the bot's user was tagged in the message
	if (receivedMessage.content.includes(client.user.toString())) {
		// Send acknowledgement message
		receivedMessage.channel.send('Message received from ' +
			receivedMessage.author.toString() + ': ' + receivedMessage.content);
	}
});

// Multiplyer etc...
function processCommand(receivedMessage) {
	let fullCommand = receivedMessage.content.substr(1); // Remove the leading exclamation mark
	let splitCommand = fullCommand.split(' '); // Split the message up in to pieces for each space
	let primaryCommand = splitCommand[0]; // The first word directly after the exclamation is the command
	let arguments = splitCommand.slice(1); // All other words are arguments/parameters/options for the command

	console.log('Command received: ' + primaryCommand);
	console.log('Arguments: ' + arguments); // There may not be any arguments

	if (primaryCommand == 'help') {
		helpCommand(arguments, receivedMessage);
	} else if (primaryCommand == 'multiply') {
		multiplyCommand(arguments, receivedMessage);
	} else if (primaryCommand == 'short') {
		shortLinkCommand(arguments, receivedMessage);
	} else {
		receivedMessage.channel.send('I don\'t understand the command. Try `!help`, `!multiply` or `!short`');
	}
}

function shortLinkCommand(arguments, receivedMessage) {

	// If there is less than 1 argument given.
	if (arguments.length < 1) {
		receivedMessage.channel.send('Error: Give url to shorten!');
		return;
	}

	// First argument (arguments[0]) is url to shorten.
	// !short <url_here> <-- is the first in the argument list.
	// createShortUrl returns callback with JSON response from API.
	_1uApi.createShortUrl(arguments[0], (response) => {

		// API told us that there was an error.
		if (response.error === 1) {
			receivedMessage.channel.send(`API Error: ${response.msg}`);
		} else {
			// Everything went good, send shortened url.
			receivedMessage.channel.send(`Here is your url shortened! ${response.short}`);
		}
	});
}

function helpCommand(arguments, receivedMessage) {
	if (arguments.length > 0) {
		receivedMessage.channel.send('It looks like you might need help with ' + arguments);
	} else {
		receivedMessage.channel.send('I\'m not sure what you need help with. Try `!help [topic]`');
	}
}

function multiplyCommand(arguments, receivedMessage) {
	if (arguments.length < 2) {
		receivedMessage.channel.send('Not enough values to multiply. Try `!multiply 2 4 10` or `!multiply 5.2 7`');
		return;
	}

	let product = 1;

	arguments.forEach((value) => {
		product = product * parseFloat(value);
	});

	receivedMessage.channel.send('The product of ' + arguments + ' multiplied together is: ' + product.toString());
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