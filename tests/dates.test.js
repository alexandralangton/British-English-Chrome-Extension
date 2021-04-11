// import { months } from '../extension/dictionary';
import { replaceDates } from '../extension/main';
import { test, expect } from '@jest/globals';
import nlp from 'compromise';
import compromiseNumbers from 'compromise-numbers';
import compromiseDates from 'compromise-dates';
nlp.extend(compromiseNumbers);
nlp.extend(compromiseDates);

test('it correctly swaps the position of day and month', () => {
	expect(replaceDates('July 4th 2021', nlp)).toBe('4th July 2021');
});
