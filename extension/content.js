const script = document.createElement('script');
script.setAttribute('type', 'module');
script.setAttribute('src', chrome.extension.getURL('main.js'));

const compScript = document.createElement('script');
compScript.setAttribute('type', 'module');
compScript.setAttribute(
	'src',
	'https://unpkg.com/compromise@13.9.3/builds/compromise.min.js'
);

const head =
	document.head ||
	document.getElementsByTagName('head')[0] ||
	document.documentElement;

const datesScript = document.createElement('script');
datesScript.setAttribute('type', 'module');
datesScript.setAttribute('src', 'https://unpkg.com/compromise-dates');

const numbersScript = document.createElement('script');
numbersScript.setAttribute('type', 'module');
numbersScript.setAttribute('src', 'https://unpkg.com/compromise-numbers');

chrome.runtime.onMessage.addListener((msg) => {
	if (msg === 'lion') {
		window.postMessage('lion');
		head.insertBefore(numbersScript, head.lastChild);
		head.insertBefore(datesScript, head.lastChild);
		head.insertBefore(script, head.lastChild);
		head.insertBefore(compScript, head.lastChild);
	}
});
