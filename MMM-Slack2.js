// Require the Node Slack SDK package (github.com/slackapi/node-slack-sdk)
const { WebClient, LogLevel } = require("@slack/web-api");

Module.register("MMM-Slack2",{
	// Default module config.
	defaults: {
	showUserName: true,
	showTime: true,
	showSeconds: false,
	maxUsers: 3,
	updateInterval: 60000,
	displayTime: 3600,
	urgentRefresh: false,
	animationSpeed: 1000
	},
	
	start: function() {
		this.slackMessages = [];
		this.counter = 0;
		this.pointer = 0;
		this.authors = [];
		
		this.client = new WebClient(slackToken, {
			// LogLevel can be imported and used to make debugging simpler
			logLevel: LogLevel.DEBUG
		});
		
		//this.getMessages();
		
		if (!this.config.urgentRefresh) {
			this.updateDom(this.config.animationSpeed);
		}
        	var self = this;
        	setInterval(function() {
        		self.updateDom(self.config.animationSpeed);
        	}, self.config.updateInterval);
	},
	
	
	getMessages: function() {
	
		this.authors = [];
		this.counter = 0;
		
		const result = await client.conversations.history({
			channel: channelId
		});
		
		slackMessages = result.messages;
		
		}
	},

	getDom: function() {
	
		this.getMessages();
	
		var messageElement = document.createElement('div');
		
		messageElement.className = 'slackMessage';
		if(this.slackMessages.length > 0) {
			var tooOld = false;
			var timeStamp = Math.floor(Date.now() / 1000);
			var boolAuthor = true;
			
			while (boolAuthor && (tooOld === false)) {
				if((timeStamp - this.slackMessages[this.counter].messageId) > this.config.displayTime) {
					tooOld = true;
				}
				else {	
					var newAuthor = 0;
					for (i=0; i<this.authors.length; i++) {
						if (this.authors[i] !== this.slackMessages[this.counter].user) {
							newAuthor = newAuthor + 1;
						}
					}
					
					if (newAuthor == this.authors.length) {
						boolAuthor = false;
					}
					else {
						this.counter = this.counter + 1;
					}
				}
			}
				
			if (tooOld && this.counter === 0) {
				this.hide();
				this.authors = [];
				this.counter = 0;
			}
			else  {
				if (tooOld) {
					this.authors = [];
					this.counter = 0;
				}
				this.pointer = this.counter;
				this.authors.push(this.slackMessages[this.pointer].user);
				messageElement.innerHTML = this.slackMessages[this.pointer].message;
				var timeUserElement = document.createElement('p');
				timeUserElement.className = 'slackUserAndTime';
				var strUserTime = "";
				
				if(this.config.showUserName) {
					strUserTime = strUserTime + this.slackMessages[this.pointer].user;
				}
					
				if(this.config.showTime) {
					var date = new Date(this.slackMessages[this.pointer].messageId * 1000);
					var hours = date.getHours();
					var minutes = "0" + date.getMinutes();
					strUserTime = strUserTime + ' @' + hours + ':' + minutes.substr(-2);
					
					if(this.config.showSeconds) {
						var seconds = "0" + date.getSeconds();
						strUserTime = strUserTime + ':' + seconds.substr(-2);
					}
				}
				
				if(this.config.showTime || this.config.showUserName) {
					timeUserElement.innerHTML = strUserTime
					messageElement.appendChild(timeUserElement);
				}
				
				this.show();
				if((timeStamp - this.slackMessages[this.counter + 1].messageId) > this.config.displayTime) {
					this.authors = [];
					this.counter = 0;
				}
				else {
					this.counter = this.counter + 1;
				}
				//if (!tooOld) {
				//	this.counter = this.counter + 1;
				//}
				if (this.authors.length === this.config.maxUsers) {
					this.authors = [];
					this.counter = 0;
				}
			}
		}
		
		return messageElement;
	}
});
