import { dictionary } from '/dictionary.js';

// Remove all punctuation, plurals and capitals before looking up the word in the dictionary
function simplifyBefore(word) {
	word = word.toLowerCase();
	if (':.,"\'?!)}]'.includes(word[word.length - 1])) {
		word = word.slice(0, -1);
	}
	if ('.,"\'{[(#'.includes(word[0])) {
		word = word.slice(1);
	}
	if (word.endsWith('s')) {
		word = word.slice(0, -1);
	}
	// console.log('word: ', word);
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

// Get the word out of the dictionary & adjust the format to match the original word (caps & punctuation)
function translate(word, wordToTest) {
	let translatedWord = dictionary[wordToTest];
	translatedWord = matchCase(word, translatedWord);
	if ('-.,:"\'?!)}]'.includes(word[word.length - 1])) {
		if (word.slice(0, -1).endsWith('s')) {
			translatedWord = translatedWord + 's';
		}
		translatedWord = translatedWord + word[word.length - 1];
	}
	if ('-.,"\'{[(#'.includes(word[0])) {
		translatedWord = word[0] + translatedWord;
	}
	if (word.endsWith('s')) {
		translatedWord = translatedWord + 's';
	}
	return translatedWord;
}

// Check an elements innerText for words to translate and replace them if needed
function findWordsToTranslate(elements) {
	for (let i = 0; i < elements.length; i++) {
		elements[i].innerText = elements[i].innerText
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
const elements = ['p', 'span', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'li'];

// code that activates on Extension button clicks and runs the 'find words to translate' function
window.addEventListener(
	'message',
	(event) => {
		if (event.data === 'serious') {
			elements.forEach((element) =>
				findWordsToTranslate(document.getElementsByTagName(element))
			);
		}
	},
	false
);

// var elements = document.getElementsByTagName('*');

// for (var i = 0; i < elements.length; i++) {
//     var element = elements[i];

//     for (var j = 0; j < element.childNodes.length; j++) {
//         var node = element.childNodes[j];

//         if (node.nodeType === 3) {
//             var text = node.nodeValue;
//             var replacedText = text.replace(/[word or phrase to replace here]/gi, '[new word or phrase]');

//             if (replacedText !== text) {
//                 element.replaceChild(document.createTextNode(replacedText), node);
//             }
//         }
//     }
// }
