'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { validateCPF, formatCPF, digitsOnly } = require('../src/cpf/validator');
const { generateTestCPF } = require('../src/cpf/generator');
const { getRegion } = require('../src/cpf/regions');

test('normalizes and formats CPF digits', () => {
  assert.equal(digitsOnly('529.982.247-25'), '52998224725');
  assert.equal(formatCPF('52998224725'), '529.982.247-25');
});

test('accepts a known checksum-valid example', () => {
  assert.equal(validateCPF('529.982.247-25').valid, true);
});

test('rejects incorrect checksum and repeated digits', () => {
  assert.equal(validateCPF('529.982.247-24').valid, false);
  assert.equal(validateCPF('111.111.111-11').valid, false);
});

test('rejects wrong length', () => {
  assert.equal(validateCPF('12345').valid, false);
});

test('region is based on the ninth digit, not the check digits', () => {
  assert.deepEqual(getRegion('52998224725').states, ['ES', 'RJ']);
  assert.deepEqual(getRegion('12345678900').states, ['PR', 'SC']);
});

test('generator honors requested region and returns valid test data', () => {
  for (const regionDigit of ['0','1','2','3','4','5','6','7','8','9']) {
    const generated = generateTestCPF(regionDigit);
    assert.equal(generated.testOnly, true);
    assert.equal(validateCPF(generated.cpf).valid, true);
    assert.equal(generated.cpf.length, 11);
    assert.equal(Number(generated.cpf[8]), Number(regionDigit));
    assert.equal(generated.region.digit, Number(regionDigit));
  }
});
