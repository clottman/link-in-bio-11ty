//
// This is main file containing code implementing the Express server and functionality for the Express echo bot.
//
'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const Bot = require('./index.js');
const path = require('path');
var lastMessage="";
var messengerButton = "<html><head><title>Facebook Messenger Bot</title></head><body><h3>Facebook Messenger Bot Example</h3><div><img src=\"https://cdn.gomix.com/ca73ace5-3fff-4b8f-81c5-c64452145271%2FmessengerBotGIF.gif\"></div><br><hr><p><a href=\"https://gomix.com/#!/remix/messenger-bot/ca73ace5-3fff-4b8f-81c5-c64452145271\"><img src=\"https://gomix.com/images/background-light/remix-on-gomix.svg\"></a></p><p><a href=\"https://gomix.com/#!/project/messenger-bot\">View Code</a></p></body></html>";

// We define a new variable `bot`, which takes the tokens and secret supplied in `.env` and creates a new `Bot` instance,
// which utilizes the messenger-bot library.
let bot = new Bot({
  token: process.env.PAGE_TOKEN,
  verify: process.env.VERIFY_TOKEN,
  app_secret: process.env.APP_SECRET
});

// We then implement two Bot methods for error and message.
// 'Error' just writes its contents to the console. 
bot.on('error', (err) => {
  console.log(err.message);
});

// 'Message' gets the text from the message received, and uses the `reply()` method to send that same text back to the user,
// handling any errors that occur.
bot.on('message', (payload, reply) => {
  let text = payload.message.text;
  bot.getProfile(payload.sender.id, (err, profile) => {
    if (err) { console.log(err); }
    else {
      if((payload.message.text+payload.timestamp)!=lastMessage){ // check for duplicate messages
        reply({ text }, (err) => {
          if (err) console.log(err);
          
          if(profile)
            console.log(`Echoed back to ${profile.first_name} ${profile.last_name}: ${text}`);
        });
        text = "Echobot - I repeat what you type. See my code and remix me at https://gomix.com/#!/project/messenger-bot";
        reply({ text }, (err) => {
          if (err) console.log(err);
        });
        lastMessage=payload.message.text+payload.timestamp;  
      }
    }
  });
});

// The rest of the code implements the routes for our Express server.
let app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

// Route for GET requests to `/bot`.
// This is the route used by Facebook to verify the Callback URL you setup earlier.
app.get('/bot', (req, res) => {
  return bot._verify(req, res);
});

// Route for POSTs to `/bot`.
// This is where all of the messages get sent, and uses the library method `_handleMessage()`.
app.post('/bot', (req, res) => {
  bot._handleMessage(req.body);
  res.end(JSON.stringify({status: 'ok'}));
});

// Finally, we set up the route for GETs to `/`, which is the root URL of our app, and is how we
// render the contents of `messengerButton` to the page.
app.get('/', function(req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.write(messengerButton);
  res.end();
});

// Set Express to listen out for HTTP requests
var server = app.listen(process.env.PORT || 3000, function () {
  console.log("Listening on port %s", server.address().port);
});