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
			// Change hier for LogLevel.DEBUG
			logLevel: LogLevel.INFO
		});
		this.getSlackMessages(config);
	},
	
	getSlackMessages: async function(config) {
		var self = this;
		var channelId = config.slackChannel;
		var limit = config.maxMessages;
		
		var slackMessages;
		var result;
		try {
			result = await client.conversations.history({
				channel: channelId,
				limit: limit
			});
		}
		catch (error) {
			console.error(error);
		}
		
		console.log("MMM-Slack2: " + result.messages.length + " messages received.");
		
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
		
		this.prepareDataForSending(config);
	},
	
	prepareDataForSending: async function(config) {
		
		if (config.showUserName) {
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
		}
		this.broadcastMessage();
	},
	
	broadcastMessage: function() {
		this.sendSocketNotification('SLACK_DATA', this.messages);
    	}
});
