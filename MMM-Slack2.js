Module.register('MMM-Slack2',{
	defaults: {
        showUserName: true,
	showTime: true,
	showSeconds: false,
	maxUsers: 3,
	maxMessages: 20,
	updateInterval: 60000,
	apiInterval: 5,
	displayTime: 3600,
	urgentRefresh: false,
	animationSpeed: 1000,
	debug: false
	},
	
	getStyles: function() {
		return ['slack.css'];
	},

	start: function() {
		this.slackMessages = [];
		this.counter = 0;
		this.pointer = 0;
		this.authors = [];
		this.firstRun = true;
		this.apiCounter = 0;
		
		// Ensure, that Slack-API limit is not exceeded and minimum values are respected.
		// Slack-API limit: Tier 3: 50+ for conversations.history
		// Slack-API limit: Tier 4: 100+ for users.info
		if (this.apiInterval < 1) {
			this.apiInterval = 1;
		}
		if (this.config.showUserName) {
			if (((this.config.updateInterval * this.apiInterval) / 600) < this.config.maxMessages) {
				this.config.updateInterval = 60000;
				this.config.maxMessages = 20;
			}
		}
		else {
			if ((this.config.updateInterval * this.apiInterval) < 5000) {
				this.config.updateInterval = 5000;
			}
		}
		
		this.openSlackConnection();
		this.updateDom(this.config.animationSpeed);
		var self = this;
		setInterval(function() {
			self.intervalFunction();
		}, self.config.updateInterval);
	},

	openSlackConnection: function() {
		this.sendSocketNotification('START_CONNECTION', {config: this.config});
	},
	
	intervalFunction: function() {
		Log.log(this.apiCounter);
		Log.log(this.apiInterval);
		if (this.apiCounter < (this.apiInterval - 1)) {
			this.apiCounter = this.apiCounter + 1;
			this.updateDom(this.config.animationSpeed);
		}
		else {
			this.apiCounter = 0;
			this.sendSocketNotification("GET_SLACK_MESSAGES", {config: this.config});
		}
	},

	socketNotificationReceived: function(notification, payload) {
		if(notification === 'SLACK_DATA'){
			if(payload != null) {
				if (this.config.urgentRefresh && !this.firstRun) {
					if (payload[0].messageId !== this.slackMessages[0].messageId) {
						this.authors = [];
						this.counter = 0;
					}
				}
				this.slackMessages = payload;
				this.firstRun = false;
				this.updateDom(this.config.animationSpeed);
			}
		}
	},

	getDom: function() {
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
