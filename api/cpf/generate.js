'use strict';

const { generateTestCPF } = require('../../src/cpf/generator');

module.exports = function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Método não permitido.' });
  }

  const body = req.body && typeof req.body === 'object' ? req.body : {};
  try {
    return res.status(200).json(generateTestCPF(body.regionDigit ?? 'any'));
  } catch (error) {
    const status = error instanceof RangeError ? 400 : 500;
    return res.status(status).json({
      error: status === 400 ? error.message : 'Não foi possível gerar a amostra.'
    });
  }
};
