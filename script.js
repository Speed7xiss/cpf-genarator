"use strict";

const form = document.querySelector("#cpf-form");
const input = document.querySelector("#cpf-input");
const clearButton = document.querySelector("#clear-button");
const result = document.querySelector("#result");
const resultIcon = document.querySelector("#result-icon");
const resultTitle = document.querySelector("#result-title");
const resultMessage = document.querySelector("#result-message");
const dismissButton = document.querySelector("#dismiss-result");

function onlyDigits(value) {
  return value.replace(/\D/g, "").slice(0, 11);
}

function formatCPF(value) {
  const digits = onlyDigits(value);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return digits.replace(/^(\d{3})(\d+)/, "$1.$2");
  if (digits.length <= 9) return digits.replace(/^(\d{3})(\d{3})(\d+)/, "$1.$2.$3");
  return digits.replace(/^(\d{3})(\d{3})(\d{3})(\d{1,2}).*/, "$1.$2.$3-$4");
}

function calculateDigit(partial, weightStart) {
  let sum = 0;
  for (let i = 0; i < partial.length; i += 1) {
    sum += Number(partial[i]) * (weightStart - i);
  }
  const remainder = (sum * 10) % 11;
  return remainder === 10 ? 0 : remainder;
}

/**
 * Checks only the mathematical CPF format/check digits.
 * It does not query government systems or confirm assignment/ownership.
 */
function validateCPF(value) {
  const cpf = onlyDigits(value);
  if (cpf.length !== 11) {
    return { valid: false, reason: "Digite os 11 números do CPF." };
  }
  if (/^(\d)\1{10}$/.test(cpf)) {
    return { valid: false, reason: "Sequências com todos os dígitos iguais são inválidas." };
  }

  const firstDigit = calculateDigit(cpf.slice(0, 9), 10);
  if (firstDigit !== Number(cpf[9])) {
    return { valid: false, reason: "O primeiro dígito verificador não confere." };
  }

  const secondDigit = calculateDigit(cpf.slice(0, 10), 11);
  if (secondDigit !== Number(cpf[10])) {
    return { valid: false, reason: "O segundo dígito verificador não confere." };
  }

  return { valid: true, reason: "Os dígitos verificadores correspondem ao cálculo matemático." };
}

function showResult(isValid, title, message) {
  result.className = `result-panel ${isValid ? "success" : "error"}`;
  resultIcon.textContent = isValid ? "✓" : "!";
  resultTitle.textContent = title;
  resultMessage.textContent = message;
  result.hidden = false;
}

input.addEventListener("input", () => {
  const cursorAtEnd = input.selectionStart === input.value.length;
  input.value = formatCPF(input.value);
  if (cursorAtEnd) input.setSelectionRange(input.value.length, input.value.length);
  result.hidden = true;
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const outcome = validateCPF(input.value);
  if (outcome.valid) {
    showResult(true, "Estrutura matemática válida", `${outcome.reason} Isso não confirma emissão, situação cadastral ou identidade.`);
  } else {
    showResult(false, "CPF inválido", outcome.reason);
  }
});

clearButton.addEventListener("click", () => {
  input.value = "";
  result.hidden = true;
  input.focus();
});

dismissButton.addEventListener("click", () => {
  result.hidden = true;
});

// Expose pure functions for optional browser-based tests without making network requests.
if (typeof window !== "undefined") {
  window.CPFStudio = Object.freeze({ validateCPF, formatCPF });
}
