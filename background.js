console.log('background is running');

chrome.browserAction.onClicked.addListener((tab) => {
	let msg = {
		txt: 'kittens',
	};
	chrome.tabs.sendMessage(tab.id, msg);
});
