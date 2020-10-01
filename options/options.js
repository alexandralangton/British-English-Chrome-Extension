let serious = document.getElementById('serious');
let takeover = document.getElementById('takeover');

serious.addEventListener('click', () => {
	chrome.storage.sync.set({ mode: 'serious' }),
		console.log('serious was clicked!');
});

takeover.addEventListener('click', () => {
	chrome.storage.sync.set({ mode: 'takeover' }),
		console.log('takeover was clicked!');
});
