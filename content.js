const script = document.createElement('script');
script.setAttribute('type', 'module');
script.setAttribute('src', chrome.extension.getURL('main.js'));
const head =
	document.head ||
	document.getElementsByTagName('head')[0] ||
	document.documentElement;
head.insertBefore(script, head.lastChild);

chrome.runtime.onMessage.addListener((msg) => {
	// when adding back in second option, this needs to be msg.txt
	if (msg === 'lion') {
		window.postMessage('lion');
	}
});
