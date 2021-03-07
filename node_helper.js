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
	
	getConversationHistory: async function(client, channelId) {
		var conversationHistory = [];
		console.log("Abfrage starten...");
		const result = await client.conversations.history({
			channel: channelId
		});
		conversationHistory = result.messages;
		cpnsole.log("Abfrage fertig.");
		console.log(conversationHistory.length + "Nachrichten gefunden");
		return conversationHistory;
	},

	startSlackConnection: function(config) {
		var self = this;
		var token = config.slackToken;
		var channelId = config.slackChannel;
		
		var slackMessages;
		
		var client = new WebClient(token, {
			logLevel: LogLevel.DEBUG
		});
		
		console.log("Client initialisiert.");
		
		var conversationHistory = [];
		conversationHistory = this.getConversationHistory(client, channelId);
		
		console.log(conversationHistory.length + "neue Nachrichten gefunden");
		
		var slackMessages = [];
		conversationHistory.forEach(function(message) {
			if(!message.subtype) {
				var slackMessage = {
					'messageId': message.ts,
					'user': client.users.info({ user: message.user }),
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
