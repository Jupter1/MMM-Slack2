var NodeHelper = require("node_helper");
var { WebClient, LogLevel } = require("@slack/web-api");

var messages = [];


module.exports = NodeHelper.create({
	
	start: function() {
		console.log('Starting node helper for: ' + this.name);
	},
	
	socketNotificationReceived: function(notification, payload) {
		if (notification === 'START_CONNECTION') {
			this.startSlackConnection(payload.config);
		}
	},
	
	getConversationHistory: async function(client) {
		var conversationHistory;
		const result = await client.conversations.history({
			channel: config.slackChannel
		});
		conversationHistory = result.messages;
		console.log(conversationHistory.length + "Nachrichten gefunden");
		return conversationHistory;
	},

	startSlackConnection: function(config) {
		var self = this;
		var token = config.slackToken;
		
		var slackMessages;
		
		var client = new WebClient(config.slackToken, {
			logLevel: LogLevel.DEBUG
		});
		
		var conversationHistory;
		conversationHistory = this.getConversationHistory(client);
		
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
