'use strict';

const { validateCPF } = require('../../src/cpf/validator');
const { getRegion } = require('../../src/cpf/regions');

module.exports = function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Método não permitido.' });
  }

  const body = req.body && typeof req.body === 'object' ? req.body : {};
  if (typeof body.cpf !== 'string' && typeof body.cpf !== 'number') {
    return res.status(400).json({ error: 'Informe um CPF em texto.' });
  }

  const result = validateCPF(body.cpf);
  if (result.normalized.length === 11) result.region = getRegion(result.normalized);
  return res.status(200).json(result);
};
