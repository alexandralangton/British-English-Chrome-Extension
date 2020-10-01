console.log('background is running');

chrome.browserAction.onClicked.addListener((tab) => {
	chrome.storage.sync.get('mode', (data) => {
		let msg = {
			txt: data.mode,
		};
		chrome.tabs.sendMessage(tab.id, msg);
	});
});
