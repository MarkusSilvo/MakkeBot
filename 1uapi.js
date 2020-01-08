// secret stuff etc credentials
const credentials = require('./credentials');

// Request library
const request = require('request');

function requestShortUrl(urlToShorten) {

	// Get api url. If credentials._1uApiKey is empty or credentials doesn't have _1uApiKey,
	// this will be just an empty string.
	const apiUrl = buildApiUrl(urlToShorten);

	// If it returned an empty string.
	if (apiUrl.length == 0) {
		// Let's just return nothing, since we cannot do anything without an API key.
		return null;
	}

	// Send request to the API.
	return request.get(apiUrl);
}

function createShortUrl(urlToShorten, callback) {

	// Send HTTP GET Request to the API.
	let request = requestShortUrl(urlToShorten);
	
	// A) There is no API key set at credentials.
	// B) API key is empty in credentials.
	// C) ???
	if (request == null) {
		return callback({ 'error': 1, 'msg': 'Invalid API key.' });
	}

	// This will store all the data that API sends us.
	let body = [];

	// Data is received in chuncks.
	// Chunk is X amount of bytes.
	// This is called when the data is received.
	// So let's add that that chunk of data into the body array everytime data is received.
	request.on('data', (chunk) => body.push(chunk))

	// When all the data is received, this will be called.
	.on('end', () => {
		// Parse all the data that we received into an json object.
		// Data is received in bytes, so we use Buffer.concat(data).toString()
		// to convert it to the human readable string, so we can parse it with JSON.parse,
		// which takes string as an argument.
		body = JSON.parse(Buffer.concat(body).toString());
		return callback(body);
	});
}

function buildApiUrl(urlToShorten) {

	// If _1uApiKey is empty, or credentials doesn't have '_1uApiKey'.
	if (!credentials._1uApiKey) {

		// Just return empty string.
		return '';
	}

	// Otherwise let's get the api url with api key and url to shorten.
	return `https://1u.fi/api?api=${credentials._1uApiKey}&url=${urlToShorten}`;
}

// Export only createShortUrl function,
// since it's the only one we need from this file.
module.exports.createShortUrl = createShortUrl;