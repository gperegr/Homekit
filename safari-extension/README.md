# Home Hub para Safari — 0.8.0

Distribuição Safari Web Extension para Mac, iPhone e iPad. Reaproveita a interface e os controles reais do Google Home; os ajustes de Safari incluem APIs `browser`, áreas seguras da tela, vidro com prefixo WebKit e botão de grupo com alvo de toque de 44 px. O manifesto exige Safari/iOS/iPadOS 17 ou posterior.

Baixe o [ZIP Safari 0.8.0](../dist/HomeHub-Safari-0.8.0.zip) para o teste temporário no Mac ou empacotamento no App Store Connect.

O pacote de recursos está pronto; não é um aplicativo assinado nem uma instalação concluída no iPhone. A validação de interface e APIs é descrita abaixo. O código comum fica em `chrome-extension`; evite editar as cópias geradas de JS/CSS nesta pasta. `safari.css`, os ícones e este guia são específicos do Safari.

## Testar agora no Safari deste Mac

O Safari 27 instalado neste computador permite carregar a pasta sem Xcode:

1. Em Safari > Ajustes > Avançado, ative os recursos para desenvolvedores.
2. Em Ajustes > Desenvolvedor, clique em **Adicionar Extensão Temporária…** (Add Temporary Extension).
3. Selecione a pasta `safari-extension` ou o ZIP gerado em `dist` e confirme a autenticação solicitada pelo Safari.
4. Ative Home Hub em Extensões e autorize o acesso a `home.google.com`. Se houver solicitação para previsão do tempo, autorize os domínios `api.open-meteo.com` e `geocoding-api.open-meteo.com`.
5. Abra https://home.google.com, entre com sua conta Google e acesse Dispositivos. Escolha sua cidade novamente no widget Tempo: os dados do Chrome não são transferidos para o Safari.

O Safari remove extensões temporárias ao encerrar o navegador ou após 24 horas. Esse caminho serve para prototipagem no Mac. Uma instalação persistente exige o aplicativo empacotado.

## Instalar em iPhone, iPad e Mac com Xcode

1. Use o **Xcode completo** e conclua a instalação dos componentes. O script reconhece tanto `/Applications/Xcode.app` quanto `/Volumes/Kingston/Aplicativos/Xcode.app`. Apenas Command Line Tools não inclui o empacotador Safari.
2. Execute `scripts/Gerar projeto Apple.command` pelo Terminal, ou dê permissão de execução se tiver baixado os arquivos do GitHub: `chmod +x "scripts/Gerar projeto Apple.command"`.
3. O script procura o packager atual e o converter antigo, gera `apple-build/HomeHub` com os destinos macOS e iOS e abre o projeto. Não sobrescreve projetos existentes. O projeto referencia os recursos desta pasta; alterações nela entram no próximo build.
4. Configure sua equipe em **Signing & Capabilities** nos destinos de aplicativo e extensão. O identificador inicial é `com.gperegr.homehub`; ajuste-o se sua equipe precisar de outro identificador.
5. Para o Mac, selecione o esquema macOS e execute. Para iPhone/iPad, selecione o esquema iOS, o dispositivo conectado ou simulador e execute. A Apple orienta usar o Apple Developer Program para testar a extensão em dispositivos físicos; os simuladores permitem testes antes da adesão.
6. Após executar o aplicativo que contém a extensão, ative Home Hub nas extensões do Safari e conceda acesso ao Google Home. Em versões recentes do iOS/iPadOS, a configuração fica em Ajustes > Apps > Safari > Extensões; também pode ser aberta pelo menu do Safari.

O script não instala Xcode, não configura credenciais, não assina e não publica na App Store. Se Xcode não estiver em `/Applications/Xcode.app`, execute com `DEVELOPER_DIR` apontando para o diretório `Contents/Developer` correto.

## Alternativa sem Xcode: App Store Connect e TestFlight

A Apple oferece o Safari Web Extension Packager no App Store Connect. Com participação no Apple Developer Program, crie um registro de app para macOS e iOS, abra **Xcode Cloud > Safari Web Extension Packager** e envie `dist/HomeHub-Safari-0.8.0.zip`. Depois que o processamento concluir, distribua o build por TestFlight aos seus dispositivos. O app iOS também atende iPadOS. Esse ZIP contém apenas manifesto, scripts, estilos e ícones; não contém contas, senhas ou a captura do Google Home.

## Atualizar o pacote

Na raiz do repositório, com Node.js instalado:

```sh
node scripts/build-safari.mjs
node --test tests/weather-worker.test.cjs tests/safari-package.test.cjs
```

O script copia os recursos comuns para esta pasta e gera o ZIP em `dist`. Os ajustes específicos de Safari são preservados. Após editar os arquivos comuns, execute o script antes de recarregar a extensão temporária, executar o projeto Xcode ou reenviar um build ao App Store Connect.

## Validação e limites

O serviço de clima tem testes dos namespaces `browser` e `chrome`, cache, concorrência e restrições de origem. O pacote possui verificações de recursos e permissões. O teste de interface usa uma cópia anônima do HTML do Google Home, sem comandar aparelhos reais. Um teste em WKWebView usa o WebKit instalado no Mac para verificar módulos quadrados, calendário, resposta do widget por `browser.runtime` simulado abertura/saída do modo ambiente e cartões agrupados com seus eventos de clique preservados. Foram verificadas larguras de 1440, 1024, 834 e 390 px; isso usa o WebKit do Mac e não substitui teste físico em iOS.

O Xcode completo deste Mac fica em `/Volumes/Kingston/Aplicativos/Xcode.app`. A extensão não foi instalada automaticamente no Safari e não houve teste em iPhone/iPad físico. A instalação temporária precisa ser ativada pelo usuário no Safari. O comportamento real dos controles depende do Google Home disponibilizar a tela Dispositivos naquele navegador; pode ser necessário solicitar o site para computador. A extensão não adiciona suporte a aparelhos que o Google não expõe na web.

## Fontes oficiais

- [Instalação temporária e execução](https://developer.apple.com/documentation/safariservices/running-your-safari-web-extension)
- [Empacotamento e projeto Xcode](https://developer.apple.com/documentation/safariservices/packaging-a-web-extension-for-safari)
- [Distribuição por App Store Connect](https://developer.apple.com/documentation/safariservices/packaging-and-distributing-safari-web-extensions-with-app-store-connect)
- [Compatibilidade de APIs](https://developer.apple.com/documentation/safariservices/assessing-your-safari-web-extension-s-browser-compatibility)

## Projeto local neste Mac

O projeto foi gerado em `apple-build/HomeHub/HomeHub.xcodeproj` usando Xcode 27.1 do SSD Kingston, com os esquemas **HomeHub (macOS)** e **HomeHub (iOS)**. Para reabrir, use esse arquivo; não é necessário gerar novamente. O diretório `apple-build` é local e fica fora do controle de versão. Os recursos da extensão continuam referenciando `safari-extension`.

A compilação Debug do aplicativo e da extensão concluiu com sucesso para macOS e iOS Simulator, sem certificados (`CODE_SIGNING_ALLOWED=NO`). Os pacotes foram conferidos com os recursos Safari 0.8.0 presentes; o app de simulador declara suporte a iPhone e iPad. O aplicativo macOS foi aberto localmente. A ativação da extensão no Safari e a instalação em dispositivos físicos continuam dependendo das configurações do usuário e da equipe de assinatura.
