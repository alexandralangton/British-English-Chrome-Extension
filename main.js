import {
	dictionary,
	firstWordDouble,
	fullDoublePhrase,
	popupText,
} from '/dictionary.js';

function inlineRemover(word) {
	word = word.replace(/<\w+>/g, '');
	word = word.replace(/<\/\w+>/g, '');
	return word;
}

// Remove all punctuation, plurals and capitals before looking up the word in the dictionary
function simplifyBefore(word) {
	word = word.toLowerCase();
	word = inlineRemover(word);

	if (':;.,"\'?!°)}]<'.includes(word[word.length - 1])) {
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
	// console.log(frontInline + translatedWord + endInline);
	return frontInline + translatedWord + endInline;
}

function rebuildTranslatedWord(word, translatedWord, twoToOnePlural) {
	if ('-.,:;"\'?!)}]°<'.includes(word[word.length - 1])) {
		if (word.slice(0, -1).endsWith('s')) {
			translatedWord = translatedWord + 's';
		}
		translatedWord = translatedWord + word[word.length - 1];
	}
	if ('-.,"\'{[(#>'.includes(word[0])) {
		translatedWord = word[0] + translatedWord;
	}
	if (word.endsWith('s') || twoToOnePlural === 's') {
		translatedWord = translatedWord + 's';
	}
	if (word.endsWith('zed') || twoToOnePlural === 'zed') {
		translatedWord = translatedWord + 'd';
	}
	return translatedWord;
}

// Get the word out of the dictionary & adjust the format to match the original word (caps & punctuation)
function translate(word, wordToTest) {
	// extract the UKEN word from the dictionary
	let translatedWord = dictionary[wordToTest];

	// make sure the translated word has the same capitalization as the
	translatedWord = matchCase(inlineRemover(word), translatedWord);

	// add any punctuation before/after & plurals back in
	translatedWord = rebuildTranslatedWord(word, translatedWord);

	//add back in any inline tags before returning the word
	return inlineAdder(word, translatedWord);
}

let skipWord = false;
let skipTwo = false;

function translateTwoWordPhrase(wordOne, editedWordOne, wordTwo) {
	if (!wordTwo) return null;

	let editedWordTwo = simplifyBefore(wordTwo);
	let phrase = editedWordOne + ' ' + editedWordTwo;

	if (fullDoublePhrase[phrase]) {
		let [translatedWordOne, translatedWordTwo] = fullDoublePhrase[phrase].split(
			' '
		);
		let twoToOnePlural = undefined;
		if (!translatedWordTwo) {
			if (wordTwo.endsWith('s')) twoToOnePlural = 's';
		}
		//match the case of the original word
		translatedWordOne = matchCase(inlineRemover(wordOne), translatedWordOne);
		// add any punctuation before/after & plurals back in
		translatedWordOne = rebuildTranslatedWord(
			wordOne,
			translatedWordOne,
			twoToOnePlural
		);
		//add back in any inline tags before returning the word
		translatedWordOne = inlineAdder(wordOne, translatedWordOne);

		if (translatedWordTwo) {
			// match the case of the original word
			translatedWordTwo = matchCase(inlineRemover(wordTwo), translatedWordTwo);
			// add any punctuation before/after & plurals back in
			translatedWordTwo = rebuildTranslatedWord(wordTwo, translatedWordTwo);
			//add back in any inline tags before returning the word
			translatedWordTwo = inlineAdder(wordTwo, translatedWordTwo);
		}

		return translatedWordTwo
			? translatedWordOne + ' ' + translatedWordTwo
			: translatedWordOne;
	} else {
		return null;
	}
}

let popupIdNo = 1;

export function conversions(num, nextWord, nextNextWord) {
	if (!nextWord || !nextNextWord) return null;

	let checkNextWord = simplifyBefore(nextWord).toLowerCase();
	let checkNextNextWord = simplifyBefore(nextNextWord).toLowerCase();
	let popupCopy;
	let returnText;
	if (
		checkNextWord === 'f' ||
		(checkNextWord === 'degree' && checkNextNextWord === 'fahrenheit') ||
		(checkNextWord === 'degree' && checkNextNextWord === 'f')
	) {
		console.log('DING DING DING');
		if (checkNextNextWord === 'f' || checkNextNextWord === 'fahrenheit') {
			skipTwo = true;
			returnText = `${num} ${nextWord} ${nextNextWord}`;
		} else {
			returnText = `${num} ${nextWord}`;
		}
		if (Number(num) > 200) {
			popupCopy = popupText.cookingF;
		} else if (Number(num) >= 80) {
			popupCopy = popupText.hotWeatherF;
		} else if (Number(num) >= 40) {
			popupCopy = popupText.midWeatherF;
		} else {
			popupCopy = popupText.coldWeatherF;
		}
		skipWord = true;
		++popupIdNo;
		return `<div class="popup" onclick="let popup = document.getElementById('myPopup${
			popupIdNo - 1
		}');
        popup.classList.toggle('show');"> ${returnText}
        <span class="popuptext" id="myPopup${popupIdNo - 1}">${popupCopy}</span>
      </div>`;
	}
}

// Check all of a particular tag type's innerText for words to translate and replace them if needed
export function findWordsToTranslate(elements) {
	for (let i = 0; i < elements.length; i++) {
		elements[i].innerHTML = elements[i].innerHTML
			.split(' ')
			.map((word, idx, arr) => {
				// if a two/three word phrase has been found previously, reset 'skipWord' and return an empty string
				if (skipTwo) {
					skipTwo = false;
					return '';
				}
				if (skipWord) {
					skipWord = false;
					return '';
				}
				// check for potential conversions / pop ups
				// clean up the word before testing
				let wordToTest = simplifyBefore(word);
				if (!isNaN(parseInt(wordToTest))) {
					// console.log('word: ', word);
					// console.log('arr[idx]: ', arr[idx]);
					// console.log('arr[idx + 1]: ', arr[idx + 1]);
					// console.log('arr[idx + 2]: ', arr[idx + 2]);
					let popup = conversions(word, arr[idx + 1], arr[idx + 2]);
					if (popup) return popup;
				}
				// check if this is part of a two word phrase
				if (firstWordDouble[wordToTest]) {
					let twoWordPhrase = translateTwoWordPhrase(
						word,
						wordToTest,
						arr[idx + 1]
					);
					if (twoWordPhrase) {
						skipWord = true;
						return twoWordPhrase;
					}
				}
				// check if this this word alone is a match for translation
				if (dictionary[wordToTest]) {
					return translate(word, wordToTest);
				} else {
					// if there are no matches prior to this, the word does not need translating and can be returned as is
					return word;
				}
			})
			.join(' ');
	}
	return elements;
}

// List of HTML elements to translate the inner text
const tagNames = [
	'p',
	'span',
	'h1',
	'h2',
	'h3',
	'h4',
	'h5',
	'h6',
	'li',
	'a',
	'td',
];

// code that activates on Extension button clicks and runs the 'find words to translate' function
window.addEventListener('message', (event) => {
	if (event.data === 'serious') {
		tagNames.forEach((tag) =>
			findWordsToTranslate(document.getElementsByTagName(tag))
		);
	} else if (event.data === 'silly') {
		console.log('TAKEOVER TIME!');
	}
});
