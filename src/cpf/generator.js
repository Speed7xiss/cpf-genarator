'use strict';

const { formatCPF, validateCPF } = require('./validator');

function randomDigit() {
  return Math.floor(Math.random() * 10);
}

function generateTestCPF() {
  // For development/testing only. Checksum validity does not mean a CPF was issued.
  let base = '';
  for (let i = 0; i < 9; i += 1) base += String(randomDigit());

  // Avoid the repeated-digit sequences rejected by the validator.
  if (/^(\d)\1{8}$/.test(base)) return generateTestCPF();

  const { calculateDigit } = require('./validator');
  const first = calculateDigit(base, 10);
  const second = calculateDigit(base + first, 11);
  const cpf = base + first + second;

  if (!validateCPF(cpf).valid) return generateTestCPF();
  return { cpf, formatted: formatCPF(cpf), testOnly: true };
}

module.exports = { generateTestCPF };
