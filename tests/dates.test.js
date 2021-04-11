import { replaceDates } from '../extension/main';
import { test, expect } from '@jest/globals';
import nlp from 'compromise';
import compromiseNumbers from 'compromise-numbers';
import compromiseDates from 'compromise-dates';
nlp.extend(compromiseNumbers);
nlp.extend(compromiseDates);

describe('localizing long-form dates (replaceDate function)', () => {
	test('it correctly swaps the position of day and month', () => {
		expect(replaceDates('July 4th', nlp)).toBe('4th July');
		expect(replaceDates('July fourth', nlp)).toBe('fourth July');
		expect(replaceDates('July 4', nlp)).toBe('4 July');
	});

	test('it correctly swaps the position of day and month when the month is abbreviated', () => {
		expect(replaceDates('Jul 4th', nlp)).toBe('4th Jul');
		expect(replaceDates('Nov fourth', nlp)).toBe('fourth Nov');
		expect(replaceDates('Apr 4', nlp)).toBe('4 Apr');
	});

	test('it correctly swaps the position of day and month when paired with a year', () => {
		expect(replaceDates('April 9 2021', nlp)).toBe('9 April 2021');
		expect(replaceDates('July 4th 2021', nlp)).toBe('4th July 2021');
		expect(replaceDates('November 21 1956', nlp)).toBe('21 November 1956');
	});

	test('it does not swap the position of day and month if already day month', () => {
		expect(replaceDates('4th July', nlp)).toBeUndefined();
		expect(replaceDates('11 August', nlp)).toBeUndefined();
		expect(replaceDates('28 September', nlp)).toBeUndefined();
	});

	test('it does not swap the position of day and month if already day month year', () => {
		expect(replaceDates('4th July 2021', nlp)).toBeUndefined();
		expect(replaceDates('11 August 1992', nlp)).toBeUndefined();
		expect(replaceDates('28 September 2006', nlp)).toBeUndefined();
	});

	test('it does not swap the position of a month if followed by a number which does not represent a day', () => {
		expect(replaceDates('July, 1200 people', nlp)).toBeUndefined();
		expect(replaceDates('August, fifteen hundred', nlp)).toBeUndefined();
		expect(replaceDates('December millions of', nlp)).toBeUndefined();
	});

	test('it retains the original capitalization when changing the order', () => {
		expect(replaceDates('july 4TH', nlp)).toBe('4TH july');
		expect(replaceDates('AUG 11', nlp)).toBe('11 AUG');
		expect(replaceDates('September 18th', nlp)).toBe('18th September');
	});

	test('it retains the original punctuation when changing the order', () => {
		expect(replaceDates('july 4TH.', nlp)).toBe('4TH july.');
		expect(replaceDates('AUG 11.', nlp)).toBe('11 AUG.');
		expect(replaceDates('September 18th,', nlp)).toBe('18th September,');
		expect(replaceDates('October 31:', nlp)).toBe('31 October:');
		expect(replaceDates('October 31\u2014', nlp)).toBe('31 October\u2014');
	});

	test('it returns undefined if passed a number that is not a date', () => {
		expect(replaceDates('3 little birds', nlp)).toBeUndefined();
		expect(replaceDates('200 degrees Fahrenheit', nlp)).toBeUndefined();
		expect(replaceDates('over 100 people ', nlp)).toBeUndefined();
	});
});

describe('localizing short-form dates (replaceDate function)', () => {
	test('it swaps dates in the format MM/DD/YY', () => {
		expect(replaceDates('10/01/2020', nlp)).toBe('01/10/2020');
		expect(replaceDates('04/30/1982', nlp)).toBe('30/04/1982');
		expect(replaceDates('12/25/1927', nlp)).toBe('25/12/1927');
	});
});
