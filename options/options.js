let serious = document.getElementById('serious');

serious.addEventListener('click', () =>
	chrome.storage.sync.set({ mode: 'serious' })
);

let takeover = document.getElementById('silly');

takeover.addEventListener('click', () =>
	chrome.storage.sync.set({ mode: 'silly' })
);
