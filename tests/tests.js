import { expect } from 'chai';
import { conversions, findWordsToTranslate } from '../main';

describe('Pop Up Tests', () => {
	const exampleString = [{ innerHTML: '425 degrees Fahrenheit.' }];

	it('recognises a number when passed in'),
		() => {
			findWordsToTranslate(exampleString);
		};
});
