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

Para o Galaxy S22 com Android 16, veja o [guia de painel com tela cheia, suspensão de cinco minutos e bloqueio de saída](galaxy-s22.md). A versão Android 0.8.2.9 inclui o botão de tela cheia e deixa a suspensão física por conta do Android; o protetor de tela interno passa a ser apenas manual.

O userscript aplica os mesmos estilos e controles da extensão diretamente à página do Google Home, dentro da sessão normal do Firefox. O gerenciador mantém o script instalado entre reinicializações. A interface Android agrupa opções num menu, ajusta a grade à orientação e separa os widgets e os aparelhos em duas telas. O script não roda em `accounts.google.com`, não automatiza login e não copia dados de aparelhos para um servidor.

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


## Duas telas — 0.8.2.4

A abertura mostra um painel com relógio, Tempo e calendário, em composição horizontal inspirada em painéis automotivos. Deslizar para a direita abre os aparelhos; deslizar para a esquerda volta ao painel. As duas bolinhas inferiores oferecem a mesma navegação sem gesto. Gestos iniciados em controles e faixas horizontais não trocam de tela, e um gesto reconhecido sobre um cartão não envia um comando ao aparelho.

O relógio em tela cheia e a troca de aparência permanecem visíveis. A tela cheia do navegador fica em Opções da casa (três pontos). O cabeçalho de contagem foi removido. Barras de rolagem ficam ocultas, mantendo a rolagem por toque. Barras e avisos do sistema Android/Firefox continuam sob controle do navegador e do sistema.

As transições entre telas usam apenas transformações breves, com retorno elástico nos limites; não há animação contínua nem acompanhamento de cada movimento do dedo. Reduzir efeitos e a preferência do sistema por movimento reduzido desativam essas transições. Os cartões e seus eventos originais permanecem no DOM do Google Home.

Validação: seis tamanhos entre 320×680 e 1280×800, CPU reduzida em 4×, clima simulado e HTML anonimizado; navegação em ambos os sentidos, troca de tema, relógio em tela cheia, menu de tela cheia e preservação do evento nativo de um aparelho. O desempenho no Firefox físico ainda depende do aparelho.


## Indicadores e arraste direto — 0.8.2.5

A navegação inferior mostra só duas bolinhas, com nomes acessíveis e áreas de toque de 36 px. As telas acompanham o dedo durante o movimento horizontal, com uma atualização de transform por frame apenas enquanto há movimento. Ao soltar, distância e velocidade decidem a troca; movimentos curtos voltam à posição inicial. Nos limites há resistência elástica. O gesto vertical permanece com a rolagem nativa, controles e faixas horizontais são preservados e o clique gerado depois de um arraste é suprimido para evitar acionar aparelhos. Cancelamento do toque, múltiplos dedos, rotação e ocultação da página encerram o arraste. Não há loop de animação ocioso.

Validação do arraste: eventos reais de toque no navegador com CPU desacelerada em 4×; deslocamentos de 50 e 140 px medidos antes de soltar o dedo, navegação nos dois sentidos, cancelamento, gesto curto, intenção vertical e resistência de borda, sem disparar o listener nativo de aparelho. A fluidez física no Firefox do tablet precisa ser confirmada no dispositivo.

Na versão 0.8.2.6, os ícones dos cômodos usam glifos de 18 px centralizados em contornos de 30×28 px, com margem interna e limite de tamanho em ambas as orientações.

Na versão 0.8.2.7, o menu de três pontos permite ocultar ou mostrar separadamente as barras de cômodos e categorias. As escolhas ficam salvas no Tampermonkey. As opções para mostrar novamente continuam no menu, e ocultar os cômodos libera o espaço inferior sem remover os indicadores de página.


### Rolagem sobre aparelhos — 0.8.2.8

A rolagem vertical pode começar sobre o cartão de um aparelho: pan-y tem prioridade em toda a superfície do cartão. Os handlers de arraste por touch/pointer do Google não recebem esses gestos, enquanto o click original continua sendo usado para toques intencionais. A partir de 8 px de movimento, o gesto deixa de ser um toque; a direção fica travada em vertical ou horizontal até terminar. Arrastes verticais, horizontais e cancelamentos impedem o click de compatibilidade que poderia ativar um aparelho. Um novo toque limpa essa proteção temporária para continuar permitindo comandos intencionais.

Verificação com Chromium móvel, HTML anonimizado e CPU desacelerada em 4×: rolagem iniciada no botão de um aparelho avançou 153 px; o gesto e um click atrasado não ativaram o aparelho, e os dois toques intencionais de controle ativaram uma vez cada. Handlers simulados que tentavam consumir o toque foram bloqueados. A troca horizontal entre telas também é verificada separadamente. O teste físico no Firefox continua dependendo do aparelho.


### Prioridade de resposta — 0.8.2.9

A interface usa Pointer Events passivos para acompanhar o dedo. Os handlers de touch são apenas guardas passivos: a rolagem vertical não precisa aguardar cancelamento por JavaScript. O clique nativo permanece responsável pelo comando real; a pressão no cartão recebe feedback visual imediato sem antecipar o estado ligado/desligado. O encaixe ao soltar usa uma animação de transform de 220 ms com posições explícitas, sem leitura forçada de layout no encerramento do gesto. Não há requestAnimationFrame contínuo: só há atualização quando o dedo muda de posição.

A reconciliação ignora mutações fora dos aparelhos e da estrutura da casa. Mudanças nativas são agrupadas; a varredura fica adiada durante o toque e a rolagem e volta após a interação. O menu só sincroniza mudanças estruturais ou de preferências, e o observador de instalação de tela cheia se desconecta depois de instalar o botão. Durante o arraste horizontal o dock deixa de aplicar blur.

Comparação controlada em Chromium móvel, CPU desacelerada em 4×, HTML anonimizado e clima simulado: 40 alterações de classe em um elemento fora dos aparelhos causaram 7 varreduras completas na 0.8.2.8 e zero na 0.8.2.9. Uma mudança nativa durante um toque causou uma varredura imediata na anterior; na nova, zero durante o toque e uma após soltar. O clique foi entregue cerca de 5,5 ms após pointerup na execução nova, contra 7,2 ms na anterior; esse valor isolado não mede latência da rede, resposta do aparelho real ou fluidez física no Firefox. Os testes de arraste horizontal e rolagem por cima de aparelho passaram, incluindo bloqueio de clique atrasado e preservação do toque seguinte.
