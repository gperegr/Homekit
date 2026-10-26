# HomeHub no navegador Android

O teste mais simples usa Firefox para Android atualizado, a extensão Tampermonkey e o userscript `dist/HomeHub-Android.user.js`. Não exige criar um APK próprio, assinatura de app ou extensões não assinadas. O Tampermonkey é instalado pela loja oficial do Firefox.

## Instalação no aparelho

Abra o [guia no GitHub Pages](https://gperegr.github.io/Homekit/android.html) no Firefox do Android e siga os quatro passos. Se o Pages não estiver disponível, use os links diretos:

1. [Instalar Firefox](https://www.mozilla.org/pt-BR/firefox/browsers/mobile/android/).
2. Dentro do Firefox, [adicionar Tampermonkey](https://addons.mozilla.org/pt-BR/android/addon/tampermonkey/).
3. [Instalar HomeHub](https://raw.githubusercontent.com/gperegr/Homekit/main/dist/HomeHub-Android.user.js). Confirme a instalação no Tampermonkey. Se aparecer o código em vez do instalador, abra o painel do Tampermonkey e use a opção de instalação/importação por URL com esse endereço.
4. Abra [Google Home](https://home.google.com/), entre na sua conta, abra Dispositivos e escolha sua cidade no Tempo. Não é necessário transportar cookies ou senhas do Mac.

Se o Google Home não exibir Dispositivos na versão móvel, experimente Site para computador no menu do Firefox. Caso ainda não apareça, a limitação é a tela que o Google entrega nesse navegador; o script não consegue fabricar controles de aparelhos ausentes.

## Como funciona

Para o Galaxy S22 com Android 16, veja o [guia de painel com tela cheia, suspensão de cinco minutos e bloqueio de saída](galaxy-s22.md). A versão Android 0.8.2.3 inclui o botão de tela cheia e deixa a suspensão física por conta do Android; o protetor de tela interno passa a ser apenas manual.

O userscript aplica os mesmos estilos e controles da extensão diretamente à página do Google Home, dentro da sessão normal do Firefox. O gerenciador mantém o script instalado entre reinicializações. A interface Android agrupa opções num menu, ajusta a grade à orientação e permite recolher os widgets. O script não roda em `accounts.google.com`, não automatiza login e não copia dados de aparelhos para um servidor.

O clima usa a mesma lógica de validação, cache e erro da extensão. As chamadas são feitas por `GM.xmlHttpRequest`, com requisições anônimas e acesso limitado aos dois domínios Open-Meteo. Cidade e cache ficam no armazenamento do Tampermonkey; a cidade selecionada em Safari/Chrome não é transferida automaticamente. A versão Android salva aparência, dock e preferência do resumo no Tampermonkey, além da sessão da página.

O arquivo HTML é apenas um instalador/guia com links. Um HTML local ou uma página do GitHub Pages não pode ler ou modificar a página autenticada do Google por causa da política de mesma origem. O código precisa executar nela, através da extensão/gerenciador de scripts.

## Gerar novamente

```sh
node scripts/build-android-userscript.mjs
node --check dist/HomeHub-Android.user.js
node --test tests/userscript-runtime.test.cjs
```

Os JS e CSS comuns são lidos de `chrome-extension`. O build inclui também os ajustes responsivos de `safari-extension/safari.css` que funcionam nos navegadores modernos. Apenas as referências à API de extensão são adaptadas para o sandbox Tampermonkey; não se criam objetos `chrome` ou `browser` falsos na página. O serviço de clima continua tendo validação de origem e URLs fixas.

## Limites do teste

O pacote pode ser validado localmente com DOM anônimo, APIs GM simuladas e testes do adaptador. Isso não representa um teste físico no seu Android. Ainda precisamos confirmar no aparelho o login, a disponibilidade de Dispositivos, os controles e o comportamento ao reabrir o navegador. O botão HomeHub para retornar ao Google Home original continua disponível no dock.

## Fontes

- [Tampermonkey para Firefox Android](https://addons.mozilla.org/en-US/android/addon/tampermonkey/)
- [Documentação Tampermonkey](https://www.tampermonkey.net/documentation.php)
- [Isolamento entre origens](https://developer.mozilla.org/en-US/docs/Web/Security/Defenses/Same-origin_policy)
