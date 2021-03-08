# MMM-Slack2

MMM-Slack2 is a module for the [MagicMirror](https://github.com/MichMich/MagicMirror) project by [Michael Teeuw](https://github.com/MichMich).

It was created due to the change of the API handling by Slack. Its `node-helper` was completely rewritten, the Core module file remains almost completely as in [MMM-Slack](https://github.com/Jupter1/MMM-Slack). The old module was forked from [grid-x](https://github.com/grid-x/MMM-Slack) and [nrkno](https://github.com/nrkno/MMM-Slack). I would not have been able to create this module without their work.

## Installation

Go to the modules folder in your MagicMirror installation. For example: 
`cd MagicMirror/modules/`
Clone the repository:
`git clone https://github.com/Jupter1/MMM-Slack2.git`
Change directory into the newly created folder:
`cd MMM-Slack2/`
Install the module:
`npm install`

## Update

To update the module go to the installation folder of the module and execute:
```
git pull
npm install
```

If for some reason you have changed the module files, you might want to reset the module:
`git reset --hard`

## Configuration
|Option|Description|
|---|---|
|`slackToken`|The token of your `slack bot` user.<br><br>**Type:**`string` This value is **Required**.<br>|
|`slackChannel`|The ID of the Slack channel you want to display messages from.<br>You find the channel ID in your the URL: `https://app.slack.com/client/workspaceID/**channelID**`<br><br>**Type:**`string` This value is **Required**.<br>|
