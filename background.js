chrome.commands.onCommand.addListener(function(command) {
    chrome.tabs.executeScript(null, {file: "content_script.js"});
});
