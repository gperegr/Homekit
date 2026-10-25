# Home Hub

Painel estático de casa inteligente, pronto para publicar no GitHub Pages.

## Estado atual

Os dispositivos, cenas, previsão do tempo e compromissos mostrados na página são dados de demonstração. Nenhuma conta da Positivo Casa Inteligente ou do Google Home está conectada. Os controles alteram apenas a interface local e não acionam aparelhos reais.

## Publicar no GitHub Pages

1. Crie um repositório público no GitHub e envie os arquivos `index.html` e `.nojekyll` para a raiz da branch `main`.
2. Em **Settings → Pages → Build and deployment**, escolha **Deploy from a branch**, branch **main**, pasta **/(root)** e salve.
3. A URL será `https://SEU_USUARIO.github.io/NOME_DO_REPOSITORIO/` após a publicação.

O painel não precisa de compilação nem de dependências instaladas. Ele carrega a fonte Inter pelo Google Fonts; sem acesso à rede, usa as fontes locais definidas no CSS.

## Integração futura

GitHub Pages hospeda apenas arquivos estáticos. Para exibir dispositivos reais neste painel, será necessário definir e configurar uma ponte ou serviço com autenticação própria. Não coloque senhas ou tokens da Positivo, Google ou de outra plataforma em arquivos publicados no repositório.
