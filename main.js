import { dictionary } from '/dictionary.js';

function inlineRemover(word) {
	word = word.replace(/<\w+>/g, '');
	word = word.replace(/<\/\w+>/g, '');
	return word;
}

// Remove all punctuation, plurals and capitals before looking up the word in the dictionary
function simplifyBefore(word) {
	word = word.toLowerCase();
	// remove inline tags
	word = inlineRemover(word);

	if (':.,"\'?!)}]<'.includes(word[word.length - 1])) {
		word = word.slice(0, -1);
	}
	if ('.,"\'{[(#>'.includes(word[0])) {
		word = word.slice(1);
	}
	if (word.endsWith('s')) {
		word = word.slice(0, -1);
	}
	if (word.endsWith('zed')) {
		word = word.slice(0, -1);
	}
	return word;
}

// match the case of the looked up EN-UK word to the original
function matchCase(usWord, ukWord) {
	let result = '';

	for (let i = 0; i < ukWord.length; i++) {
		let usCode, ukLetter;
		if (i === 0) {
			ukLetter = ukWord.charAt(i);
			usCode = usWord.charCodeAt(i);
		} else {
			ukLetter = ukWord.charAt(i);
			usCode = usWord.charCodeAt(1);
		}
		if (usCode >= 65 && usCode < 65 + 26) {
			result += ukLetter.toUpperCase();
		} else {
			result += ukLetter.toLowerCase();
		}
	}
	return result;
}

function inlineAdder(word, translatedWord) {
	let frontInline = '',
		endInline = '';
	if (/<\w+>/g.test(word)) {
		let endIdx = word.lastIndexOf('>');
		frontInline = word.slice(0, endIdx);
	}
	if (/<\/\w+>/g.test(word)) {
		let startIdx = word.indexOf('<');
		endInline = word.slice(startIdx);
	}
	console.log(frontInline + translatedWord + endInline);
	return frontInline + translatedWord + endInline;
}

// Get the word out of the dictionary & adjust the format to match the original word (caps & punctuation)
function translate(word, wordToTest) {
	// extract the UKEN word from the dictionary
	let translatedWord = dictionary[wordToTest];

	// make sure the translated word has the same capitalization as the
	translatedWord = matchCase(inlineRemover(word), translatedWord);

	if ('-.,:"\'?!)}]<'.includes(word[word.length - 1])) {
		if (word.slice(0, -1).endsWith('s')) {
			translatedWord = translatedWord + 's';
		}
		translatedWord = translatedWord + word[word.length - 1];
	}
	if ('-.,"\'{[(#>'.includes(word[0])) {
		translatedWord = word[0] + translatedWord;
	}
	if (word.endsWith('s')) {
		translatedWord = translatedWord + 's';
	}
	if (word.endsWith('zed')) {
		translatedWord = translatedWord + 'd';
	}
	return inlineAdder(word, translatedWord);
}

// Check all of a particular tag type's innerText for words to translate and replace them if needed
function findWordsToTranslate(elements) {
	for (let i = 0; i < elements.length; i++) {
		// console.log('elements[i].innerText: ', elements[i].innerText);
		// console.log('elements[i].innerHTML: ', elements[i].innerHTML);
		elements[i].innerHTML = elements[i].innerHTML
			.split(' ')
			.map((word) => {
				let wordToTest = simplifyBefore(word);
				if (dictionary[wordToTest]) {
					return translate(word, wordToTest);
				} else {
					return word;
				}
			})
			.join(' ');
	}
	return elements;
}

// List of HTML elements to translate the inner text
const tagNames = ['p', 'span', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'li', 'a'];

// code that activates on Extension button clicks and runs the 'find words to translate' function
window.addEventListener('message', (event) => {
	if (event.data === 'serious') {
		tagNames.forEach((tag) =>
			findWordsToTranslate(document.getElementsByTagName(tag))
		);
	}
});

// if (event.data === 'serious') {
//     elements.forEach((element) =>
//         findWordsToTranslate(document.getElementsByTagName(element))
//     );
// }

// // loop through all element types listed in the array above
// for (let i = 0; i < tagNames.length; i++) {
//     let tagName = tagNames[i];
//     let elements = document.getElementsByTagName(tagName);

//     // if there are elements of that type, loop through them and look at their text values
//     if (elements) {
//         console.log('elements: ', elements);
//         for (let j = 0; j < elements.length; j++) {
//             let node = elements[j];
//             console.log('node: ', node);
//             // if they have text for translation, translate it
//             let text = node.nodeValue;
//             let translatedText = undefined;
//             console.log('node.nodeValue: ', node.textContent);
//             if (text) translatedText = findWordsToTranslate(text);

//             // if any words have changed, replace this element with the new text
//             if (translatedText !== text && translatedText) {
//                 elements.replaceChild(
//                     document.createTextNode(translatedText),
//                     node
//                 );
//             }
//         }
//     }
// }
