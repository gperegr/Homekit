# Home Hub

Painel estático de casa inteligente, pronto para publicar no GitHub Pages.

## Estado atual

Antes de conectar o Home Assistant, os dispositivos, cenas, previsão do tempo e compromissos mostrados na página são dados de demonstração. Os controles desse modo alteram apenas a interface local.

## Publicar no GitHub Pages

1. Crie um repositório público no GitHub e envie os arquivos `index.html` e `.nojekyll` para a raiz da branch `main`.
2. Em **Settings → Pages → Build and deployment**, escolha **Deploy from a branch**, branch **main**, pasta **/(root)** e salve.
3. A URL será `https://SEU_USUARIO.github.io/NOME_DO_REPOSITORIO/` após a publicação.

O painel não precisa de compilação nem de dependências instaladas. Ele carrega a fonte Inter pelo Google Fonts; sem acesso à rede, usa as fontes locais definidas no CSS.

## Ver aparelhos do Home Assistant

1. Instale o Home Assistant em um equipamento que possa ficar ligado.
2. Cadastre os aparelhos nele. O fato de estarem no Google Home **não** os transfere automaticamente ao Home Assistant. A integração oficial Tuya do Home Assistant exige que os aparelhos estejam no aplicativo Tuya Smart ou Smart Life; uma conta somente no aplicativo Positivo não atende a esse requisito.
3. Para testar no Mac sem acesso remoto, coloque uma cópia do `index.html` em `/config/www` e abra o painel pela URL `/local/index.html` do próprio Home Assistant. Assim, o painel e a API ficam na mesma origem HTTP. Para abrir a página do GitHub Pages, configure uma URL HTTPS acessível pelo navegador; o [Home Assistant Cloud](https://www.home-assistant.io/docs/configuration/remote/) é uma opção.
4. No Home Assistant, abra **Perfil → Segurança → Tokens de acesso de longa duração** e crie um token. Não compartilhe o token no chat nem o coloque no repositório.
5. Abra o painel publicado, clique no círculo **C**, informe a URL HTTPS e o token, e escolha **Conectar**.

O painel lê estados de luzes, tomadas/interruptores, ventiladores, climatizadores, cortinas, fechaduras, câmeras e players de mídia em tempo real. Nesta fase, os aparelhos reais aparecem somente para consulta: tocar nos cartões não envia comandos. O token fica apenas na memória da aba atual e deve ser informado novamente quando a página for recarregada. A previsão do tempo, os compromissos e as cenas ainda são exemplos.

Não coloque senhas ou tokens da Positivo, Google, Tuya ou Home Assistant em arquivos publicados no repositório.
