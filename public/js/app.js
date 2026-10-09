'use strict';

import { validateCPF, generateCPF } from './modules/api.js';

const input = document.querySelector('#cpf-input');
const count = document.querySelector('#digit-count');
const form = document.querySelector('#validate-form');
const result = document.querySelector('#validation-result');
const generateButton = document.querySelector('#generate-button');
const regionSelect = document.querySelector('#region-select');
const generatedCPF = document.querySelector('#generated-cpf');
const originDigit = document.querySelector('#origin-digit');
const originName = document.querySelector('#origin-name');
const originStates = document.querySelector('#origin-states');
const copyButton = document.querySelector('#copy-button');
let currentGenerated = '';

function onlyDigits(value) {
  return value.replace(/\D/g, '').slice(0, 11);
}

function formatInput(value) {
  const digits = onlyDigits(value);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return digits.replace(/^(\d{3})(\d+)$/, '$1.$2');
  if (digits.length <= 9) return digits.replace(/^(\d{3})(\d{3})(\d+)$/, '$1.$2.$3');
  return digits.replace(/^(\d{3})(\d{3})(\d{3})(\d{0,2})$/, '$1.$2.$3-$4');
}

input.addEventListener('input', () => {
  input.value = formatInput(input.value);
  count.textContent = String(onlyDigits(input.value).length).padStart(2, '0') + ' / 11';
  if (!result.hidden) result.hidden = true;
});

form.addEventListener('submit', async event => {
  event.preventDefault();
  result.hidden = false;
  result.className = 'result';
  result.textContent = 'Conferindo os dígitos…';
  try {
    const data = await validateCPF(onlyDigits(input.value));
    result.classList.add(data.valid ? 'success' : 'error');
    let message = (data.valid ? '✓ Cálculo válido. ' : '× Cálculo inválido. ') + data.reason;
    if (data.region) {
      message += ' Região indicada pelo nono dígito (' + data.region.digit + '): ' +
        data.region.states.join(', ') + '. ' + data.region.note;
    }
    message += ' A validação não confirma emissão ou titularidade.';
    result.textContent = message;
  } catch (error) {
    result.classList.add('error');
    result.textContent = error.message || 'Não foi possível conectar ao servidor.';
  }
});

function showRegion(region) {
  originDigit.textContent = String(region.digit);
  originName.textContent = region.label;
  originStates.textContent = region.states.join(' · ') + (region.stateCount > 1 ? ' — grupo regional' : ' — estado');
}

generateButton.addEventListener('click', async () => {
  generateButton.disabled = true;
  generateButton.querySelector('span').textContent = 'Preparando amostra…';
  generateButton.classList.add('is-busy');
  try {
    const data = await generateCPF(regionSelect.value);
    currentGenerated = data.formatted;
    generatedCPF.textContent = currentGenerated;
    showRegion(data.region);
    copyButton.disabled = false;
    const card = document.querySelector('#sample-card');
    card.classList.remove('sample-pop');
    void card.offsetWidth;
    card.classList.add('sample-pop');
  } catch (error) {
    originName.textContent = 'Não foi possível gerar';
    originStates.textContent = error.message || 'Tente novamente.';
  } finally {
    generateButton.disabled = false;
    generateButton.classList.remove('is-busy');
    generateButton.querySelector('span').textContent = 'Gerar nova amostra';
  }
});

copyButton.addEventListener('click', async () => {
  if (!currentGenerated) return;
  try {
    await navigator.clipboard.writeText(currentGenerated);
    copyButton.innerHTML = 'Copiado para a área de transferência <span>✓</span>';
    copyButton.classList.add('copied');
    setTimeout(() => {
      copyButton.innerHTML = 'Copiar CPF <span>⧉</span>';
      copyButton.classList.remove('copied');
    }, 1500);
  } catch {
    copyButton.textContent = currentGenerated;
  }
});
