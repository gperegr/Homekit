# Home Hub

O projeto contém duas experiências: um mockup estático publicado no GitHub Pages e uma extensão para Safari e Chrome que aplica um tema inspirado no Apple Home diretamente no Google Home Web.

## Estado atual

O painel `index.html` continua sendo uma demonstração independente. A extensão não precisa de senhas ou tokens do Google, Positivo ou Home Assistant.

## Publicar no GitHub Pages

1. Crie um repositório público no GitHub e envie os arquivos `index.html` e `.nojekyll` para a raiz da branch `main`.
2. Em **Settings → Pages → Build and deployment**, escolha **Deploy from a branch**, branch **main**, pasta **/(root)** e salve.
3. A URL será `https://SEU_USUARIO.github.io/NOME_DO_REPOSITORIO/` após a publicação.

O painel não precisa de compilação nem de dependências instaladas. Ele carrega a fonte Inter pelo Google Fonts; sem acesso à rede, usa as fontes locais definidas no CSS.

## Tema Apple no Google Home Web

Para usar a ideia atual, carregue sem compactação a pasta `chrome-extension` em `chrome://extensions` com o Modo do desenvolvedor ligado. A extensão se aplica a `home.google.com` e não acessa credenciais nem copia dados de aparelhos.

A versão atual inclui dock de cômodos flutuante, ícones maiores, relógio analógico, calendário mensal e previsão externa do Open-Meteo. O modo ambiente mostra hora, data e temperatura. Veja as instruções e permissões em [chrome-extension/README.md](chrome-extension/README.md).

## Safari no Mac, iPhone e iPad

A distribuição Safari 0.8.2 fica em [`safari-extension`](safari-extension/README.md). No Safari atual do Mac, é possível carregar essa pasta como extensão temporária em Ajustes > Desenvolvedor > Adicionar Extensão Temporária. Ela é removida ao encerrar o Safari ou após 24 horas.

Execute `node scripts/build-safari.mjs` para gerar `dist/HomeHub-Safari-0.8.2.zip`. Para instalar nos dispositivos móveis, use o empacotamento pelo App Store Connect/TestFlight ou execute `scripts/Gerar projeto Apple.command` com Xcode completo instalado. A pasta e o ZIP contêm recursos de extensão, não um aplicativo Apple já assinado. Consulte o guia Safari para assinatura, permissões e limitações dos testes.

## Experimento anterior: Home Assistant

O código experimental permanece no mockup enquanto essa integração está pausada.
