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

    startSlackConnection: function(config) {
        var self = this;
        var token = config.slackToken;
      
        var slackMessages
      
        var client = new WebClient(config.slackToken, {
          logLevel: LogLevel.DEBUG
        });
      
        const result = client.conversations.history({
          channel: config.slackChannel
        });
      
        var slackMessages = [];
        
        result.messages.forEach(function(message) {
          if(!message.subtype) {
             var slackMessage = {
               'messageId': message.ts,
               'user': client.users.info({ user: message.user });
               'message': message.text
             };
             slackMessages.push(slackMessage);
          }
        });
      this.messages = slackMessages;
      
      this.broadcastMessage();
    };
  
    broadcastMessage: function() {
      this.sendSocketNotification('SLACK-DATA', this.messages);
    }
  
});
