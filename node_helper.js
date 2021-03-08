var NodeHelper = require("node_helper");
var { WebClient, LogLevel } = require("@slack/web-api");

var client;
var messages = [];


module.exports = NodeHelper.create({
	
	start: function() {
		console.log('Starting node helper for: ' + this.name);
	},
	
	socketNotificationReceived: function(notification, payload) {
		if (notification === 'START_CONNECTION') {
			this.startSlackConnection(payload.config);
		}
		if (notification === 'GET_SLACK_MESSAGES') {
			this.getSlackMessages(payload.config);
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
	startSlackConnection: function(config) {
		var self = this;
		var token = config.slackToken;
		
		client = new WebClient(token, {
			logLevel: LogLevel.DEBUG
		});
		this.getSlackMessages(config);
	},
	
	getSlackMessages: async function(config) {
		var self = this;
		var channelId = config.slackChannel;
		
		var slackMessages;
		var result;
		try {
			result = await client.conversations.history({
				channel: channelId
			});
		}
		catch (error) {
			console.error(error);
		}
		
		console.log(result.messages.length + " neue Nachrichten gefunden");
		
		var slackMessages = [];
		result.messages.forEach(function(message) {
			if(!message.subtype) {
				var userName = this.getUserName(message);
				var slackMessage = {
					'messageId': message.ts,
					//'user': client.users.info({ user: message.user }),
					'user': userName,
					'message': message.text
				};
				slackMessages.push(slackMessage);
			}
		});
		this.messages = slackMessages;
		
		console.log(this.messages[0].message);
		console.log(this.messages[0].user);
		console.log(this.messages[0].messageId);
		
		this.broadcastMessage();
	},
	
	getUserName: async function(message) {
		var userName;
		try {
			userName = await client.users.info({ user:message.user });
		}
		catch (error) {
			console.error(error);
		}
		return userName;
	},
	
	broadcastMessage: function() {
		console.log(this.messages[0].message + " ist die erste Nachricht");
		this.sendSocketNotification('SLACK_DATA', this.messages);
    	}
});
