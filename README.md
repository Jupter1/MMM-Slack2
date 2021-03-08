# MMM-Slack2

MMM-Slack2 is a module for the [MagicMirror](https://github.com/MichMich/MagicMirror) project by [Michael Teeuw](https://github.com/MichMich).

It was created due to the change of the API handling by Slack. Its `node-helper` was completely rewritten, the Core module file remains almost completely as in [MMM-Slack](https://github.com/Jupter1/MMM-Slack). The old module was forked from [grid-x](https://github.com/grid-x/MMM-Slack) and [nrkno](https://github.com/nrkno/MMM-Slack). I would not have been able to create this module without their work.

Unlike the older version of the Slack module, this module uses the web-api for Slack. You will have to create a bot which brings messages from Slack to your MagicMirror.

## Installation

Go to the modules folder in your MagicMirror installation. For example: 
```
cd MagicMirror/modules/
```
Clone the repository:
```
git clone https://github.com/Jupter1/MMM-Slack2.git
```
Change directory into the newly created folder:
```
cd MMM-Slack2/
```
Install the module:
```
npm install
```

## Update

To update the module go to the installation folder of the module and execute:
```
git pull
npm install
```

If for some reason you have changed the module files, you might want to reset the module:
```
git reset --hard
```

## How to use the Slack API
1. Log into your slack account.
2. Go to your [Slack apps](https://api.slack.com/apps) page and create a new Slack app.
3. Give it a name as you like, i. e. `Magic Mirror` and choose your Development Slack Workspace. This is the workspace in which the channel you want to display messages from is. Then click on `Create App`.
4.  Your app will automatically appear with the Basic Information page. Scroll down a bit and hit `Generate Token and Scopes`.
5.  Choose a token name, i. e. `magicmirror` and select the `authorizations:read` scope for this token. Click `Generate`, then `Done`.
6.  Scroll back up and got to the `OAuth & Permissions` page.
7.  Scroll down a bit and add some `Bot token scopes`. The needed scopes depends on your channel. If you do not want to think about it, you can just add all the following scopes:
    1.  `channels:history` to display messages from a public channel.
    2.  `groups:history` to display messages from a private channel.
    3.  `users:read` to display the sender's names correctly. If you chose to set `showUserName` to `false` this scope is not necessary.
8.  Scroll back up and click `Install to Workspace`, then `Allow`. Wait a second, then you will see your app's `Bot User OAuth Token`. This is the token you will need for `slackToken` in your `config.js`.
9.  Go to your Slack workspace in your browser. Click the `+ Add Apps` symbol in the Apps section below the user list.
10.  A list of apps will appear, select the app you just created.
11.  Your app is now part of your workspace. Select your app, hit the `i` in the top right corner if necessary to show the conversation details. Then, click `more`, `Add this app to a channel...`, select a channel and finally click `Add`.
12.  Now set your module configuration in your `config.js`.

## Configuration
|Option|Description|
|---|---|
|`slackToken`|The token of your `Bot User OAuth Token` user. How to get a token is described above.<br>It looks something like this: `xoxb-123456789-123456789-123456789ABC`<br><br>**Type:** `string` This value is **Required**.<br>|
|`slackChannel`|The ID of the Slack channel you want to display messages from. It works with both a public or a private channel.<br>You find the channel ID in the URL: `https://app.slack.com/client/workspaceID/channelID`<br><br>**Type:** `string` This value is **Required**.<br>|
|`maxUsers`|Indicates how many different Slack-Users will be displayed and thus, how many messages can be cyclted through at most. If set to `1`, onle the newest message will appear.<br><br>**Type:** `integer`<br>**Default value:** `3`|
|`showUserName`|If true, the message sender's user name will be displayed with the message.<br><br>**Type:** `boolean`<br>**Default value:** `true`|
|`showTime`|If true, the timestamp of the message will be displayed after the username.<br><br>**Type:** `boolean`<br>**Default value:** `true`|
|`showSeconds`|If true, the timestamp includes the seconds. Only works, if showTime is true.<br><br>**Type:** `boolean`<br>**Default value:** `false`|
|`displayTime`|The time in seconds the last message is displayed.<br><br>**Type:** `integer`<br>**Default value:** `3600 // 60 minutes`|
|`urgentRefresh`|If true, the messages will be updated as soon as a new message arrives. If false, the cycle will be completed before the newest message will be shown.<br><br>**Type:** `boolean`<br>**Default value:** `false`|
|`updateInterval`|The time-interval which defines how often the module is updated.<br><br>**Type:** `integer`<br>**Default value:** `60000 // 1 minute`<br>**Minimum value:** `5000 // 5 seconds`|
|`maxMessages`|The maximum of messages that are called from the API. Make sure, to not exceed the API limits as mentioned above.<br><br>**Type:** `integer`<br>**Default value:** `20`|
|`animationSpeed`|Speed of the update animation. The value is given in milliseconds.<br><br>**Type:** `integer`<br>**Default value:** `1000 // 1 second`|
|`debug`|If true, the API-client will start with more detailed logging information.<br><br>**Type:** `boolean`<br>**Default value:** `false`|

Here is an example of an entry in `config.js`:
``` JavaScript
{
    module: "MMM-Slack2",
    position: "top_right",
    config: {
        slackToken: "xoxb-123456789-123456789-123456789ABC",
        slackChannel: "YOUR_CHANNEL_ID",
        maxUsers: 3,
        showUserName: true,
        showTime: true,
        showSeconds: false,
        displayTime: 3600,
        urgentRefresh: false,
        updateInterval: 60000,
        maxMessages: 20,
        animationSpeed: 1000,
        debug: false
    }
},
```

## To Do's
* Multiple instances of this module are currently not supported.
* Use the events-API to listen to new messages in order to not call the conversations.history method for every refresh.

## Special Thanks
* [Michael Teeuw](https://github.com/MichMich) for inspiring me and many others to build a MagicMirror.
* [nrkno](https://github.com/nrkno) for creating the Original MMM-Slack module.

## Issues
If you find any problems, bugs or have a question, please [open a GitHub issue](https://github.com/Jupter1/MMM-Slack2/issues) in thes repository.
