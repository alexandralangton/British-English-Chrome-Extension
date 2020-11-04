console.log('background is running');

chrome.browserAction.onClicked.addListener((tab) => {
	// previously in options
	// chrome.storage.sync.set({ mode: 'silly' })
	// chrome.storage.sync.get('mode', (data) => {
	// 	let msg = {
	// 		txt: data.mode,
	// 	};
	// 	chrome.tabs.sendMessage(tab.id, msg);
	// });
	chrome.tabs.sendMessage(tab.id, 'lion');
});
