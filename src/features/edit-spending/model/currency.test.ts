import assert from 'node:assert/strict';

import { defaultCurrency } from './currency';

test('валюта по региону локали', () => {
  assert.equal(defaultCurrency('ru-KZ'), 'KZT');
  assert.equal(defaultCurrency('en-DE'), 'EUR');
  assert.equal(defaultCurrency('en_GB'), 'GBP');
  assert.equal(defaultCurrency('ru-RU'), 'RUB');
});

test('регион не из списка или без региона - по языку', () => {
  assert.equal(defaultCurrency('en-PL'), 'USD');
  assert.equal(defaultCurrency('ru-PL'), 'RUB');
  assert.equal(defaultCurrency('ru'), 'RUB');
  assert.equal(defaultCurrency('de'), 'USD');
});

test('скрипт и расширения в теге не мешают', () => {
  assert.equal(defaultCurrency('ru-Cyrl-KZ'), 'KZT');
  assert.equal(defaultCurrency('en-US-u-mu-celsius'), 'USD');
  assert.equal(defaultCurrency('de-AT-u-mu-celsius'), 'EUR');
});
