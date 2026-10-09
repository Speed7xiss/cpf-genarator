# CPF Studio

Validador de CPF com interface responsiva, animações leves e cálculo dos dígitos verificadores inteiramente no navegador.

## Recursos

- Validação matemática do CPF usando os dois dígitos verificadores oficiais (módulo 11).
- Formatação automática enquanto a pessoa digita.
- Rejeição de entradas incompletas e sequências com todos os dígitos iguais.
- Interface responsiva, animações e suporte a preferência por movimento reduzido.
- Sem dependências de runtime, cadastro, API ou banco de dados.
- Os dados digitados não são enviados a um servidor pelo aplicativo.

## Executar localmente

Não é necessário instalar dependências. Abra `index.html` no navegador ou inicie um servidor estático na pasta:

```bash
python -m http.server 8000
```

Depois acesse http://localhost:8000.

## Como funciona a validação

1. Remove pontuação e confirma que existem 11 dígitos.
2. Rejeita sequências repetidas, como `11111111111`.
3. Calcula o primeiro dígito com pesos de 10 a 2.
4. Calcula o segundo dígito com pesos de 11 a 2.
5. Compara os resultados calculados com os dígitos informados.

Para cada soma ponderada, o dígito é calculado a partir do resto da divisão por 11, conforme a regra do CPF.

## Limitações importantes

A validação matemática **não** consulta a Receita Federal e não informa se um CPF foi emitido, está ativo ou pertence a uma pessoa. Um número pode passar pela verificação matemática sem corresponder a um documento atribuído. Use apenas dados fictícios ou autorizados em testes.

## Estrutura

- `index.html` — estrutura e conteúdo da página.
- `style.css` — tema, layout responsivo e animações.
- `script.js` — formatação e validação local.

## Licença

Este projeto é disponibilizado sob a licença MIT. Consulte [LICENSE](LICENSE).
