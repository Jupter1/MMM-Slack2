var NodeHelper = require("node_helper");
var { WebClient, LogLevel } = require("@slack/web-api");

var messages = [];


module.exports = NodeHelper.create({
	
	start: function() {
		console.log('Starting node helper for: ' + this.name);
	},
	
	socketNotificationReceived: function(notification, payload) {
		if (notification === 'START_CONNECTION') {
			console.log('Token: '+payload.config.slackToken);
			console.log('Channel: '+payload.config.slackChannel);
			this.startSlackConnection(payload.config);
		}
	},
	/*
	getConversationHistory: async function(client, channelId) {
		console.log("Abfrage starten...");
		
		var conversationHistory;
		
		try {
			const result = await client.conversations.history({
				channel: channelId
			});
		}
		catch (error) {
			console.error(error);
		}
		console.log("Abfrage fertig.");
		console.log(result.messages.length + "Nachrichten gefunden");
		conversationHistory = result.messages;
		return conversationHistory;
	},
*/
	startSlackConnection: async function(config) {
		var self = this;
		var token = config.slackToken;
		var channelId = config.slackChannel;
		
		var slackMessages;
		
		var client = new WebClient(token, {
			logLevel: LogLevel.DEBUG
		});
		
		console.log("Client initialisiert.");
		
		var result;
		try {
			result = await client.conversations.history({
				channel: channelId
			});
		}
		catch (error) {
			console.error(error);
		}
		
		console.log(result.messages.length + "neue Nachrichten gefunden");
		
		var slackMessages = [];
		result.messages.forEach(function(message) {
			if(!message.subtype) {
				var slackMessage = {
					'messageId': message.ts,
					//'user': client.users.info({ user: message.user }),
					'user': "Beispielnutzer",
					'message': message.text
				};
				slackMessages.push(slackMessage);
			}
		});
		this.messages = slackMessages;
		
		this.broadcastMessage();
	},
	
	broadcastMessage: function() {
      		this.sendSocketNotification('SLACK-DATA', this.messages);
    	}
});
