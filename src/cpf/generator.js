'use strict';

const { formatCPF, validateCPF, calculateDigit } = require('./validator');
const { REGIONS } = require('./regions');

function randomDigit() {
  return Math.floor(Math.random() * 10);
}

function generateTestCPF(regionDigit = 'any') {
  const selected = regionDigit === 'any' || regionDigit === undefined || regionDigit === null
    ? randomDigit()
    : Number(regionDigit);

  if (!Number.isInteger(selected) || selected < 0 || selected > 9 || !REGIONS[selected]) {
    throw new RangeError('Selecione uma região entre 0 e 9.');
  }

  let base = '';
  for (let i = 0; i < 8; i += 1) base += String(randomDigit());
  base += String(selected);

  // Evita sequências repetidas que a regra de validação rejeita.
  if (/^(\d)\1{8}$/.test(base)) return generateTestCPF(regionDigit);

  const first = calculateDigit(base, 10);
  const second = calculateDigit(base + first, 11);
  const cpf = base + first + second;

  if (!validateCPF(cpf).valid) return generateTestCPF(regionDigit);
  const region = require('./regions').getRegion(cpf);

  return {
    cpf,
    formatted: formatCPF(cpf),
    region,
    testOnly: true
  };
}

module.exports = { generateTestCPF };
