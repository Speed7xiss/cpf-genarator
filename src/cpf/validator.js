'use strict';

function digitsOnly(value) {
  return String(value ?? '').replace(/\D/g, '');
}

function calculateDigit(partial, initialWeight) {
  let sum = 0;
  for (let i = 0; i < partial.length; i += 1) {
    sum += Number(partial[i]) * (initialWeight - i);
  }
  const remainder = (sum * 10) % 11;
  return remainder === 10 ? 0 : remainder;
}

function validateCPF(value) {
  const cpf = digitsOnly(value);
  if (!/^\d{11}$/.test(cpf)) {
    return { valid: false, normalized: cpf, reason: 'O CPF deve conter 11 dígitos.' };
  }
  if (/^(\d)\1{10}$/.test(cpf)) {
    return { valid: false, normalized: cpf, reason: 'Sequências com todos os dígitos iguais não são válidas.' };
  }

  const first = calculateDigit(cpf.slice(0, 9), 10);
  const second = calculateDigit(cpf.slice(0, 9) + first, 11);
  const valid = first === Number(cpf[9]) && second === Number(cpf[10]);

  return {
    valid,
    normalized: cpf,
    formatted: formatCPF(cpf),
    reason: valid ? 'Os dígitos verificadores conferem.' : 'Os dígitos verificadores não conferem.'
  };
}

function formatCPF(value) {
  const cpf = digitsOnly(value);
  if (cpf.length !== 11) return cpf;
  return cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
}

module.exports = { digitsOnly, formatCPF, validateCPF, calculateDigit };
