---
title: 'Este site'
kind: 'Projeto pessoal'
role: 'Design e engenharia'
year: 2026
summary: 'Um portfólio bilíngue construído como seu próprio primeiro case study, com cada decisão arquitetural registrada no momento em que foi tomada.'
stack:
  - 'Next.js'
  - 'TypeScript'
  - 'Tailwind CSS'
  - 'Velite'
  - 'next-intl'
cover: './portfolio-cover.png'
liveUrl: 'https://next.bernardomrl.dev'
repositoryUrl: 'https://github.com/bernardomrl/portfolio'
---

A maioria dos portfólios de desenvolvedor afirma rigor. Este guarda o comprovante. Toda
escolha não óbvia feita durante a construção foi escrita antes do código que dependia
dela — o que foi decidido, por quê, e o que foi descartado — e o registro faz parte do
repositório em vez de ser uma história contada depois.

## Conteúdo é dado, não markup

Nada neste site interpreta markdown no navegador. A prosa é validada contra um schema em
tempo de build, e um documento que falha na validação derruba o build em vez de chegar à
produção:

```ts
const parsed = parseProjectPath(path);

if (parsed === null) {
  ctx.addIssue({ code: 'custom', fatal: true, message: `Unreadable project path "${path}".` });
  return z.NEVER;
}
```

O `slug` e o locale são lidos do nome do arquivo em vez de declarados no frontmatter,
porque um campo que repete o nome do arquivo é uma segunda fonte de verdade que pode
divergir sem erro e sem sintoma.

A arquitetura por trás dessa escolha, e as camadas em que ela vive, estão descritas na
[documentação do repositório](https://github.com/bernardomrl/portfolio).
