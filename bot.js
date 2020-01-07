// secret stuff etc credentials
var credentials = require('./credentials');
// console.log(credentials.clientLogin);

// Get Discord module
const Discord = require('discord.js')

// Create an instance of a Discord client
const client = new Discord.Client()

// Credentials for login
client.login(credentials.clientLogin);

// When turned on and ready
client.on('ready', () => {
    console.log('I am ready to work!');

    // Set bot status to: "Playing with JavaScript"
    // client.user.setActivity("with JavaScript")

    // Alternatively, you can set the activity to any of the following:
    // PLAYING, STREAMING, LISTENING, WATCHING
    // For example:
    client.user.setActivity("Twitch", {type: "WATCHING"})

    // The generall channel id for my server is: 664077701140709440
    // var generalChannel = client.channels.get("664077701140709440") // Replace with known channel ID
    // generalChannel.send("I'm online! :)")  
})

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
        return
    }
    if (receivedMessage.content.startsWith("!")) {
        processCommand(receivedMessage)
    }
    // Prevent bot from responding to its own messages
    if (receivedMessage.author == client.user) {
        return
    }
    // Check if the bot's user was tagged in the message
    if (receivedMessage.content.includes(client.user.toString())) {
        // Send acknowledgement message
        receivedMessage.channel.send("Message received from " +
            receivedMessage.author.toString() + ": " + receivedMessage.content)
    }
  });

// Multiplyer etc...
function processCommand(receivedMessage) {
    let fullCommand = receivedMessage.content.substr(1) // Remove the leading exclamation mark
    let splitCommand = fullCommand.split(" ") // Split the message up in to pieces for each space
    let primaryCommand = splitCommand[0] // The first word directly after the exclamation is the command
    let arguments = splitCommand.slice(1) // All other words are arguments/parameters/options for the command

    console.log("Command received: " + primaryCommand)
    console.log("Arguments: " + arguments) // There may not be any arguments

    if (primaryCommand == "help") {
        helpCommand(arguments, receivedMessage)
    } else if (primaryCommand == "multiply") {
        multiplyCommand(arguments, receivedMessage)
    } else {
        receivedMessage.channel.send("I don't understand the command. Try `!help` or `!multiply`")
    }
}

function helpCommand(arguments, receivedMessage) {
    if (arguments.length > 0) {
        receivedMessage.channel.send("It looks like you might need help with " + arguments)
    } else {
        receivedMessage.channel.send("I'm not sure what you need help with. Try `!help [topic]`")
    }
}

function multiplyCommand(arguments, receivedMessage) {
    if (arguments.length < 2) {
        receivedMessage.channel.send("Not enough values to multiply. Try `!multiply 2 4 10` or `!multiply 5.2 7`")
        return
    }
    let product = 1 
    arguments.forEach((value) => {
        product = product * parseFloat(value)
    })
    receivedMessage.channel.send("The product of " + arguments + " multiplied together is: " + product.toString())
}

// Voice stuff etc
client.on('message', message => {
    // Voice only works in guilds, if the message does not come from a guild,
    // we ignore it
    if (!message.guild) return;
  
    if (message.content === '/join') {
      // Only try to join the sender's voice channel if they are in one themselves
      if (message.member.voiceChannel) {
        message.member.voiceChannel.join()
          .then(connection => { // Connection is an instance of VoiceConnection
            message.reply('I have successfully connected to the voice channel!');
          })
          .catch(console.log);
      } else {
        message.reply('You need to join a voice channel first!');
        var voiceChannel = message.member.voiceChannel;
        voiceChannel.join().then(connection => {
          console.log(`Playing file ${file}.mp3`);
          const dispatcher = connection.playArbitraryInput("http://185.52.127.131/fi/35059/mp3_128.mp3")
          dispatcher.on("end", end => {
            voiceChannel.leave();
          });
        }).catch(err => console.log(err));
        isReady = true;
      }
    }
  });