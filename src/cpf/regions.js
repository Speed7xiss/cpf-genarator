'use strict';

// O nono dígito (terceiro a contar do fim) indica a região fiscal de origem,
// não identifica sozinho um estado específico quando há vários no mesmo grupo.
const REGIONS = {
  0: { label: 'Rio Grande do Sul', states: ['RS'], names: ['Rio Grande do Sul'] },
  1: { label: 'Região 1', states: ['DF', 'GO', 'MT', 'MS', 'TO'], names: ['Distrito Federal', 'Goiás', 'Mato Grosso', 'Mato Grosso do Sul', 'Tocantins'] },
  2: { label: 'Região 2', states: ['AC', 'AM', 'AP', 'PA', 'RO', 'RR'], names: ['Acre', 'Amazonas', 'Amapá', 'Pará', 'Rondônia', 'Roraima'] },
  3: { label: 'Região 3', states: ['CE', 'MA', 'PI'], names: ['Ceará', 'Maranhão', 'Piauí'] },
  4: { label: 'Região 4', states: ['AL', 'PB', 'PE', 'RN'], names: ['Alagoas', 'Paraíba', 'Pernambuco', 'Rio Grande do Norte'] },
  5: { label: 'Região 5', states: ['BA', 'SE'], names: ['Bahia', 'Sergipe'] },
  6: { label: 'Minas Gerais', states: ['MG'], names: ['Minas Gerais'] },
  7: { label: 'Região 7', states: ['ES', 'RJ'], names: ['Espírito Santo', 'Rio de Janeiro'] },
  8: { label: 'São Paulo', states: ['SP'], names: ['São Paulo'] },
  9: { label: 'Região 9', states: ['PR', 'SC'], names: ['Paraná', 'Santa Catarina'] }
};

function getRegion(value) {
  const cpf = String(value ?? '').replace(/\D/g, '');
  if (cpf.length !== 11 || !REGIONS[cpf[8]]) return null;
  const region = REGIONS[cpf[8]];
  return {
    digit: Number(cpf[8]),
    label: region.label,
    states: region.states,
    names: region.names,
    stateCount: region.states.length,
    note: region.states.length === 1
      ? 'O nono dígito corresponde a esta unidade federativa.'
      : 'O nono dígito indica este grupo regional; não determina qual estado do grupo é o de origem.'
  };
}

module.exports = { REGIONS, getRegion };
