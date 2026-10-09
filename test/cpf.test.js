'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { validateCPF, formatCPF, digitsOnly } = require('../src/cpf/validator');
const { generateTestCPF } = require('../src/cpf/generator');

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

test('generator returns a checksum-valid test fixture', () => {
  const generated = generateTestCPF();
  assert.equal(generated.testOnly, true);
  assert.equal(validateCPF(generated.cpf).valid, true);
  assert.equal(generated.cpf.length, 11);
});
