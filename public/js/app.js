'use strict';

import { validateCPF, generateCPF } from './modules/api.js';

const input = document.querySelector('#cpf-input');
const count = document.querySelector('#digit-count');
const form = document.querySelector('#validate-form');
const result = document.querySelector('#validation-result');
const resultTools = document.querySelector('#result-tools');
const clearButton = document.querySelector('#clear-button');
const copyValidated = document.querySelector('#copy-validated');
const copyReport = document.querySelector('#copy-report');
const learnToggle = document.querySelector('#learn-toggle');
const learnPanel = document.querySelector('#learn-panel');
const generateButton = document.querySelector('#generate-button');
const regionSelect = document.querySelector('#region-select');
const generatedCPF = document.querySelector('#generated-cpf');
const originDigit = document.querySelector('#origin-digit');
const originName = document.querySelector('#origin-name');
const originStates = document.querySelector('#origin-states');
const copyButton = document.querySelector('#copy-button');

let currentGenerated = '';
let lastValidated = '';
let lastReport = '';

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

function announceResult(message, type = '') {
  result.hidden = false;
  result.className = 'result' + (type ? ' ' + type : '');
  result.textContent = message;
  result.classList.remove('result-enter');
  void result.offsetWidth;
  result.classList.add('result-enter');
}

async function copyText(text, button, successLabel) {
  if (!text) return;
  const original = button.textContent;
  try {
    await navigator.clipboard.writeText(text);
    button.textContent = successLabel;
    button.classList.add('copied');
    window.setTimeout(() => {
      button.textContent = original;
      button.classList.remove('copied');
    }, 1300);
  } catch {
    announceResult('Não foi possível copiar automaticamente. Selecione e copie o texto manualmente.', 'error');
  }
}

input.addEventListener('input', () => {
  input.value = formatInput(input.value);
  count.textContent = onlyDigits(input.value).length + '/11';
  result.hidden = true;
  resultTools.hidden = true;
});

clearButton.addEventListener('click', () => {
  input.value = '';
  count.textContent = '0/11';
  result.hidden = true;
  resultTools.hidden = true;
  input.focus();
});

form.addEventListener('submit', async event => {
  event.preventDefault();
  const cpf = onlyDigits(input.value);
  if (!cpf) {
    announceResult('Digite um CPF para iniciar a conferência.', 'error');
    resultTools.hidden = true;
    input.focus();
    return;
  }
  const submit = form.querySelector('button[type="submit"]');
  submit.disabled = true;
  submit.classList.add('is-loading');
  submit.querySelector('span').textContent = 'Conferindo…';
  announceResult('Conferindo os dígitos verificadores…');
  resultTools.hidden = true;
  try {
    const data = await validateCPF(cpf);
    const title = data.valid ? 'Cálculo válido.' : 'Cálculo inválido.';
    let report = title + ' ' + data.reason;
    if (data.region) {
      report += ' Região do nono dígito (' + data.region.digit + '): ' + data.region.states.join(', ') + '. ' + data.region.note;
    }
    report += ' Não confirma emissão ou titularidade.';
    lastValidated = data.formatted || formatInput(cpf);
    lastReport = report;
    announceResult(report, data.valid ? 'success' : 'error');
    resultTools.hidden = false;
  } catch (error) {
    announceResult(error.message || 'Não foi possível conectar ao servidor.', 'error');
  } finally {
    submit.disabled = false;
    submit.classList.remove('is-loading');
    submit.querySelector('span').textContent = 'Verificar CPF';
  }
});

copyValidated.addEventListener('click', () => copyText(lastValidated, copyValidated, 'Número copiado ✓'));
copyReport.addEventListener('click', () => copyText(lastReport, copyReport, 'Resumo copiado ✓'));

learnToggle.addEventListener('click', () => {
  const expanded = learnToggle.getAttribute('aria-expanded') === 'true';
  learnToggle.setAttribute('aria-expanded', String(!expanded));
  learnPanel.hidden = expanded;
  learnToggle.querySelector('.toggle-plus').textContent = expanded ? '+' : '−';
  if (!expanded) learnPanel.classList.add('panel-enter');
});

function showRegion(region) {
  originDigit.textContent = String(region.digit);
  originName.textContent = region.label;
  originStates.textContent = region.states.join(' · ') + (region.stateCount > 1 ? ' — grupo regional' : ' — estado');
}

generateButton.addEventListener('click', async () => {
  generateButton.disabled = true;
  generateButton.classList.add('is-loading');
  generateButton.querySelector('span').textContent = 'Preparando…';
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
    originName.textContent = 'Falha ao gerar';
    originStates.textContent = error.message || 'Tente novamente.';
  } finally {
    generateButton.disabled = false;
    generateButton.classList.remove('is-loading');
    generateButton.querySelector('span').textContent = 'Gerar amostra';
  }
});

copyButton.addEventListener('click', () => copyText(currentGenerated, copyButton, '✓'));
