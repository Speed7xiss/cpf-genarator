# CPF / Oficina de Dados

Ferramenta educacional em Node.js para validar dígitos verificadores de CPF e criar amostras sintéticas de teste. Não consulta a Receita Federal, não usa banco de dados e não confirma emissão, titularidade ou situação cadastral.

## Requisitos

- Node.js 20+
- npm

## Iniciar

\`\`\`bash
npm install
npm start
\`\`\`

Abra http://localhost:3000. Para desenvolvimento com reinicialização automática: \`npm run dev\`. Para executar os testes: \`npm test\`.

## Estrutura

\`\`\`text
public/
  css/styles.css
  js/app.js
  js/modules/api.js
  index.html
server/index.js
src/cpf/
  generator.js
  regions.js
  validator.js
test/cpf.test.js
package.json
\`\`\`

## API

- \`GET /api/health\` — estado do servidor.
- \`POST /api/cpf/validate\` — JSON \`{"cpf":"529.982.247-25"}\`.
- \`POST /api/cpf/generate\` — JSON opcional \`{"regionDigit":"8"}\`; use \`"any"\` para uma região aleatória.

O nono dígito do CPF (terceiro a contar do fim) indica uma região fiscal. Para algumas regiões, o código abrange vários estados e não permite identificar um estado individual.

## Uso responsável

Use os números gerados somente em desenvolvimento/testes. A validade matemática não indica que o número foi emitido, que existe cadastro ou que pertence a uma pessoa.
