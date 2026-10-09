# CPF Toolkit

Aplicação educacional em Node.js para validar os dígitos verificadores de CPF e gerar dados sintéticos para testar formulários. Não consulta a Receita Federal, não usa banco de dados e não confirma titularidade ou situação cadastral.

## Requisitos

- Node.js 20 ou superior
- npm (incluído na instalação do Node.js)

## Iniciar

\`\`\`bash
npm start
\`\`\`

Abra http://localhost:3000. Para reiniciar automaticamente durante o desenvolvimento:

\`\`\`bash
npm run dev
\`\`\`

## Testes

\`\`\`bash
npm test
\`\`\`

## Estrutura

\`\`\`text
cpf-genarator/
├── public/
│   ├── css/styles.css
│   ├── js/
│   │   ├── modules/api.js
│   │   └── app.js
│   └── index.html
├── server/
│   └── index.js
├── src/
│   └── cpf/
│       ├── generator.js
│       └── validator.js
├── test/
│   └── cpf.test.js
├── package.json
└── README.md
\`\`\`

## API local

- \`GET /api/health\` — status do servidor.
- \`POST /api/cpf/validate\` — body JSON: \`{"cpf":"529.982.247-25"}\`.
- \`POST /api/cpf/generate\` — retorna um dado de teste com dígitos verificadores calculados.

## Nota importante

A validação é exclusivamente matemática. Um CPF que passa no cálculo não significa que o número foi emitido, que existe cadastro associado ou que pertence a determinada pessoa. Use os resultados apenas em ambientes de desenvolvimento/teste, nunca para se passar por outra pessoa ou preencher cadastros reais.
