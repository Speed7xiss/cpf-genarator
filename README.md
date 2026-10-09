# CPF Toolkit

Ferramenta educacional para conferir matematicamente dígitos verificadores de CPF e criar amostras sintéticas para desenvolvimento. Não consulta a Receita Federal e não confirma emissão, titularidade ou situação cadastral.

## Hospedar na Vercel

1. Abra https://vercel.com/new e conecte sua conta GitHub.
2. Importe o repositório `Speed7xiss/cpf-genarator`.
3. Deixe o **Root Directory** como `./` e o Framework Preset como **Other**.
4. Não configure Build Command nem Output Directory; a Vercel servirá os arquivos estáticos de `public/` e as funções de `api/`.
5. Clique em **Deploy**. A cada push na branch principal, a Vercel fará um novo deploy.

O arquivo `vercel.json` define cabeçalhos de segurança. Os endpoints em `api/cpf/` funcionam como funções serverless, sem precisar manter um servidor Node ativo.

## Rodar localmente

Requer Node.js 20 ou superior.

```bash
npm install
npm start
```

Abra http://localhost:3000. Para reinicialização automática durante o desenvolvimento, use `npm run dev`. Para os testes, use `npm test`.

## Estrutura

```text
api/
  cpf/
    generate.js
    validate.js
public/
  css/
    motion.css
    styles.css
  js/
    app.js
    modules/
      api.js
      motion.js
  index.html
server/index.js
src/cpf/
  generator.js
  regions.js
  validator.js
test/cpf.test.js
vercel.json
package.json
```

## Endpoints

- `POST /api/cpf/validate` — JSON: `{"cpf":"529.982.247-25"}`.
- `POST /api/cpf/generate` — JSON opcional: `{"regionDigit":"8"}`; use `"any"` para grupo regional aleatório.

Os endpoints respondem apenas a requisições POST. O nono dígito (terceiro a contar do fim) indica um grupo regional, não necessariamente um estado individual.

## Uso responsável

Use amostras geradas somente em desenvolvimento e testes. A consistência matemática não significa que um CPF foi emitido ou pertence a alguém.
