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
				var slackMessage = {
					'messageId': message.ts,
					'user': message.user, 
					'message': message.text
				};
				slackMessages.push(slackMessage);
			}
		});
		this.messages = slackMessages;
		
		/*
		console.log(this.messages[0].message);
		console.log(this.messages[0].user);
		console.log(this.messages[0].messageId);
		*/
		
		this.prepareDataForSending();
	},
	
	prepareDataForSending: async function() {
		
		for(var i = 0; i < this.messages.length; i++) {
			var userName;
			try {
				const userData = await client.users.info({ user: this.messages[i].user });
				userName = userData.user.real_name
			}
			catch (error) {
				console.error(error);
			}
			this.messages[i].user = userName;
		}
		this.broadcastMessage();
	},
	
	broadcastMessage: function() {
		this.sendSocketNotification('SLACK_DATA', this.messages);
    	}
});
