'use strict';

const input = document.querySelector('#cpf-input');
const count = document.querySelector('#digit-count');
const form = document.querySelector('#validate-form');
const result = document.querySelector('#validation-result');
const generateButton = document.querySelector('#generate-button');
const generatedCPF = document.querySelector('#generated-cpf');
const copyButton = document.querySelector('#copy-button');
const previewStatus = document.querySelector('.preview-status');
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
  const position = input.selectionStart;
  input.value = formatInput(input.value);
  count.textContent = onlyDigits(input.value).length + '/11';
  if (result.hidden === false) result.hidden = true;
});

form.addEventListener('submit', async event => {
  event.preventDefault();
  const cpf = onlyDigits(input.value);
  result.hidden = false;
  result.className = 'result';
  result.textContent = 'Verificando dígitos…';
  try {
    const response = await fetch('/api/cpf/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cpf })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Falha na validação.');
    result.classList.add(data.valid ? 'success' : 'error');
    result.textContent = (data.valid ? '✓ CPF válido matematicamente. ' : '× CPF inválido. ') + data.reason + ' Isso não confirma existência ou situação cadastral.';
  } catch (error) {
    result.classList.add('error');
    result.textContent = error.message || 'Não foi possível conectar ao servidor.';
  }
});

generateButton.addEventListener('click', async () => {
  generateButton.disabled = true;
  generateButton.querySelector('span').textContent = 'Gerando…';
  try {
    const response = await fetch('/api/cpf/generate', { method: 'POST' });
    if (!response.ok) throw new Error('Falha ao gerar dado de teste.');
    const data = await response.json();
    currentGenerated = data.formatted;
    generatedCPF.textContent = currentGenerated;
    previewStatus.classList.add('ready');
    previewStatus.innerHTML = '<i></i> Dado sintético pronto para testes';
    copyButton.disabled = false;
  } catch (error) {
    previewStatus.classList.remove('ready');
    previewStatus.textContent = error.message || 'Erro ao gerar';
  } finally {
    generateButton.disabled = false;
    generateButton.querySelector('span').textContent = 'Gerar CPF de teste';
  }
});

copyButton.addEventListener('click', async () => {
  if (!currentGenerated) return;
  try {
    await navigator.clipboard.writeText(currentGenerated);
    copyButton.innerHTML = 'Copiado! <span aria-hidden="true">✓</span>';
    setTimeout(() => { copyButton.innerHTML = 'Copiar resultado <span aria-hidden="true">⧉</span>'; }, 1400);
  } catch {
    copyButton.textContent = currentGenerated;
  }
});
