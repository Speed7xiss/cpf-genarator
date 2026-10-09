'use strict';

async function postJSON(url, payload) {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Não foi possível concluir a solicitação.');
  return data;
}

export function validateCPF(cpf) {
  return postJSON('/api/cpf/validate', { cpf });
}

export function generateCPF(regionDigit = 'any') {
  return postJSON('/api/cpf/generate', { regionDigit });
}
