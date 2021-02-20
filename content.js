const script = document.createElement('script');
script.setAttribute('type', 'module');
script.setAttribute('src', chrome.extension.getURL('main.js'));

const nlpscript = document.createElement('script');
nlpscript.setAttribute('type', 'module');
nlpscript.setAttribute('src', 'https://unpkg.com/compromise');

const head =
	document.head ||
	document.getElementsByTagName('head')[0] ||
	document.documentElement;

head.insertBefore(script, head.lastChild);
head.insertBefore(nlpscript, head.lastChild);

chrome.runtime.onMessage.addListener((msg) => {
	// when adding back in second option, this needs to be msg.txt
	if (msg === 'lion') {
		window.postMessage('lion');
	}
});
