console.log('you got me!');

chrome.runtime.onMessage.addListener((msg, sender, sendRes) => {
	if (msg.txt === 'kittens') {
		let elements = document.getElementsByTagName('p');
		console.log('elements: ', elements);

		for (let i = 0; i < elements.length; i++) {
			elements[i].innerText = 'kittens!!!';
		}
	}
});
