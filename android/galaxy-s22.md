# Galaxy S22 / Android 16 como painel HomeHub

O Firefox com Tampermonkey e HomeHub continua sendo o navegador do painel. O userscript Android 0.8.2.9 oferece tela cheia no menu de três pontos e desativa a entrada automática no protetor de tela interno. O relógio em tela cheia continua disponível manualmente. Ao retornar de uma aba/tela oculta, o protetor interno é fechado para mostrar o painel.

[Atualizar o HomeHub](https://raw.githubusercontent.com/gperegr/Homekit/main/dist/HomeHub-Android.user.js) no Firefox; confirme Atualizar no Tampermonkey e recarregue o Google Home. Abra os três pontos e toque em Entrar em tela cheia. O Firefox exige um toque para iniciar esse modo e pode sair dele por gesto, troca de app ou suspensão; o script não tenta forçar a reentrada nem interceptar comandos do sistema.

## Desligar o painel após 5 minutos e acordar na página

No S22, procure estas opções nas Configurações (os nomes podem variar com a versão da One UI):

1. **Visor/Tela > Duração/Tempo limite da tela > 5 minutos**. Se estiver ativo, desative Manter tela ligada durante a visualização para o rosto não estender o prazo. Em Opções do desenvolvedor, Manter ativo durante carregamento também precisa estar desligado se o aparelho ficar conectado.
2. **Recursos avançados > Movimentos e gestos > Tocar duas vezes para ativar a tela**: ativar. O despertar nativo do S22 é por dois toques; não há promessa de despertar com um toque único pelo navegador.
3. Para voltar diretamente ao Firefox, use **Tela de bloqueio e AOD > Tipo de bloqueio de tela > Nenhum**. Procure por Tipo de bloqueio nas Configurações se o menu tiver outro nome. Deslizar ainda exige um gesto; PIN/biometria ainda exigem autenticação. A opção Nenhum deixa o aparelho sem bloqueio de acesso.
4. Se a tela precisar ficar totalmente apagada, desative **Always On Display**. Não confunda isso com desenhar um fundo preto no navegador.
5. Deixe o Firefox com a aba normal do Google Home aberta, sem outra aplicação em primeiro plano, e teste o ciclo de cinco minutos. Dê dois toques para acordar. O retorno à página e a manutenção da tela cheia precisam ser confirmados no aparelho.

O script não solicita Wake Lock e não tem permissão para controlar o painel físico. Esses cinco minutos são uma configuração do Android, não um temporizador web. Sem conexão USB/gerenciamento do dispositivo, essas opções precisam ser alteradas no próprio celular.

## Bloquear a saída com PIN separado

Fixar app do Android pode evitar trocas acidentais, mas a exigência de PIN para desafixar usa o bloqueio do sistema. Ela não oferece um PIN de quiosque independente de um aparelho configurado com bloqueio Nenhum. Tela cheia do navegador também não bloqueia a saída por si só.

Para testar um PIN independente e manter o Firefox atual, use o [Fully Single App Kiosk](https://play.google.com/store/apps/details?id=com.fullykiosk.singleapp), que controla um aplicativo escolhido. Há versão de avaliação e recursos licenciados; verifique as condições no app antes de comprar.

1. Instale o app pela Play Store, selecione **Firefox** como aplicativo alvo e defina um **Kiosk PIN** próprio.
2. Autorize os recursos de controle de quiosque que o app solicitar para funcionar. Ele usa Acessibilidade para restringir barras e outras telas. O recurso Screen Off Timer exige Administrador do dispositivo.
3. Comece pelo **Test Mode**: o fabricante informa uma saída automática após 60 segundos nesse teste. Confirme como sair antes de ativar o bloqueio contínuo: por padrão, são sete toques rápidos e o Kiosk PIN.
4. Mantenha o bloqueio de tela do Android em Nenhum e deixe **Keep Screen On** desativado, quando presente, para o timeout nativo de cinco minutos funcionar. Se preferir usar Screen Off Timer do controlador, configure 300 segundos e valide se a versão instalada reinicia o prazo com toques dentro do Firefox. Não use dois temporizadores concorrentes sem testar.
5. Abra o painel e toque no botão de tela cheia. Teste suspensão, despertar, botão Voltar e gestos do sistema. O controlador restringe a saída do Firefox; isso não garante que todos os gestos internos do navegador permanecerão em tela cheia.

O próprio fabricante aponta restrições de proteção sem provisionamento Device Owner/Knox nas versões modernas do Android. Um bloqueio resistente a todas as saídas exige gerenciamento dedicado. Esse provisionamento é uma implantação diferente da configuração do Firefox e não foi executado neste projeto.

## Fontes oficiais

- [Tela cheia e possibilidade de saída pelo usuário](https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API/Guide)
- [Fixar apps no Galaxy](https://news.samsung.com/us/samsung-knox-journals-tired-prying-eyes-personal-information-how-to-stop-it/)
- [Gestos de despertar Samsung](https://www.samsung.com/ca/support/mobile-devices/stop-accidental-screen-touches-on-your-galaxy-phone/)
- [Remover o bloqueio de tela Android](https://support.google.com/android/answer/9079129)
- [Fully Single App Kiosk e restrições](https://www.fully-kiosk.com/docs/en/other-kiosk-apps/fully-single-app-kiosk)
- [Despertar por toque](https://www.fully-kiosk.com/docs/en/faq/tap2wake)

## Interface adaptada ao S22 — 0.8.2.4

- Cabeçalho com ações de tela cheia e opções de 48 px. Aparência, relógio e dock ficam no menu de opções, com linhas de ação de 54 px.
- Dois cartões por linha em retrato, com altura de 138 px, ícones de 30 px e superfícies opacas para melhorar contraste e reduzir o custo de blur no celular. O dock continua com vidro e permite rolar os cômodos horizontalmente.
- Relógio e calendário lado a lado; o Tempo ocupa a linha seguinte. O resumo pode ser recolhido no menu.
- Na horizontal curta, o resumo fica recolhido por padrão e a grade mostra quatro cartões por linha. Uma escolha manual de resumo é salva e prevalece nas próximas sessões.
- Aparência e dock também são salvos no armazenamento do Tampermonkey e restaurados numa sessão nova. A cidade continua usando o armazenamento de clima existente.
- Ao voltar de uma longa suspensão, previsões com mais de vinte minutos são atualizadas. Nenhum comando de aparelho é enviado ao acordar.
- Estilos respeitam os insets seguros quando o navegador os expõe. Os diálogos de opções e busca de cidade possuem limites de altura para uso em telas menores.

As verificações locais usaram uma página anônima, APIs GM simuladas e viewports de 320 a 412 px em retrato e de 780 a 854 px em paisagem, incluindo escala de pixels 3. Isso representa condições de layout do S22; a confirmação física no Firefox do seu aparelho continua sendo um teste separado. Se estiver usando Site para computador e tudo aparecer reduzido, teste a visualização móvel do Firefox para que a largura responsiva siga a tela.

## Rolagem e desempenho — 0.8.2.4

Cabeçalho, categorias, widgets e cartões compartilham o contêiner de rolagem nativo do Google Home. Ao deslizar, o cabeçalho sai junto com os itens; a extensão não instala um handler para reposicionar elementos a cada scroll. Ao usar o botão de retornar ao Google Home original, os elementos da interface são retirados desse contêiner e reaproveitados ao reativar HomeHub.

Na horizontal, título e filtros ocupam uma única linha e o dock usa apenas ícones, com altura de 54 px. Os cartões de aparelhos na paisagem curta têm 116 px de altura. Os nomes completos dos cômodos continuam nos rótulos acessíveis dos botões e no título da tela ao selecionar um cômodo.

O dock usa fundo translúcido e blur de 14 px. Os demais cartões e filtros não recebem blur nem paralaxe. As animações de resposta são curtas e usam transform/opacity; não há transições animadas de tamanho ou sombra. A camada decorativa de fundo e os listeners de movimento do efeito de paralaxe não são iniciados na distribuição Android. Também são ignoradas as mutações internas do relógio/clima na sincronização do menu.

Em Opções da casa, **Reduzir efeitos visuais** desliga o desfoque do dock e as animações da interface. A escolha fica salva no Tampermonkey. O modo também respeita a preferência do sistema por movimento reduzido.

O teste local cobriu rolagem real de 220 px do cabeçalho e filtros, transparência e blur do dock, alternância do modo leve, restauração da interface original e reativação em seis viewports de celular/tablet. Foi executado em Chromium com APIs GM simuladas e CPU desacelerada em 4×. A medição ociosa não encontrou solicitações contínuas de frame da camada de interface em 3,5 segundos; não há loop contínuo de animação. Isso não mede a RAM ou a GPU de um tablet físico de 4 GB nem garante uma taxa de quadros para qualquer aparelho: a página original do Google e o hardware também participam do custo.

Referência de implementação: [animações eficientes e controle de camadas](https://web.dev/articles/animations-guide).


A versão 0.8.2.4 separa o painel de widgets dos aparelhos. Deslize para a direita para abrir aparelhos e para a esquerda para voltar; as duas bolinhas inferiores também alternam as telas. O relógio em tela cheia e a aparência ficam visíveis; a tela cheia do Firefox fica nos três pontos. As seções anteriores documentam a evolução do layout, substituída pela navegação em duas telas.

Na 0.8.2.5 o gesto acompanha o dedo, com encaixe ao soltar e resistência nas bordas. As bolinhas indicam a tela atual e mantêm nomes acessíveis.

Na versão 0.8.2.7, o menu de três pontos permite ocultar ou mostrar separadamente as barras de cômodos e categorias. As escolhas ficam salvas no Tampermonkey. As opções para mostrar novamente continuam no menu, e ocultar os cômodos libera o espaço inferior sem remover os indicadores de página.


### Rolagem sobre aparelhos — 0.8.2.8

A rolagem vertical pode começar sobre o cartão de um aparelho: pan-y tem prioridade em toda a superfície do cartão. Os handlers de arraste por touch/pointer do Google não recebem esses gestos, enquanto o click original continua sendo usado para toques intencionais. A partir de 8 px de movimento, o gesto deixa de ser um toque; a direção fica travada em vertical ou horizontal até terminar. Arrastes verticais, horizontais e cancelamentos impedem o click de compatibilidade que poderia ativar um aparelho. Um novo toque limpa essa proteção temporária para continuar permitindo comandos intencionais.

Verificação com Chromium móvel, HTML anonimizado e CPU desacelerada em 4×: rolagem iniciada no botão de um aparelho avançou 153 px; o gesto e um click atrasado não ativaram o aparelho, e os dois toques intencionais de controle ativaram uma vez cada. Handlers simulados que tentavam consumir o toque foram bloqueados. A troca horizontal entre telas também é verificada separadamente. O teste físico no Firefox continua dependendo do aparelho.


### Prioridade de resposta — 0.8.2.9

A interface usa Pointer Events passivos para acompanhar o dedo. Os handlers de touch são apenas guardas passivos: a rolagem vertical não precisa aguardar cancelamento por JavaScript. O clique nativo permanece responsável pelo comando real; a pressão no cartão recebe feedback visual imediato sem antecipar o estado ligado/desligado. O encaixe ao soltar usa uma animação de transform de 220 ms com posições explícitas, sem leitura forçada de layout no encerramento do gesto. Não há requestAnimationFrame contínuo: só há atualização quando o dedo muda de posição.

A reconciliação ignora mutações fora dos aparelhos e da estrutura da casa. Mudanças nativas são agrupadas; a varredura fica adiada durante o toque e a rolagem e volta após a interação. O menu só sincroniza mudanças estruturais ou de preferências, e o observador de instalação de tela cheia se desconecta depois de instalar o botão. Durante o arraste horizontal o dock deixa de aplicar blur.

Comparação controlada em Chromium móvel, CPU desacelerada em 4×, HTML anonimizado e clima simulado: 40 alterações de classe em um elemento fora dos aparelhos causaram 7 varreduras completas na 0.8.2.8 e zero na 0.8.2.9. Uma mudança nativa durante um toque causou uma varredura imediata na anterior; na nova, zero durante o toque e uma após soltar. O clique foi entregue cerca de 5,5 ms após pointerup na execução nova, contra 7,2 ms na anterior; esse valor isolado não mede latência da rede, resposta do aparelho real ou fluidez física no Firefox. Os testes de arraste horizontal e rolagem por cima de aparelho passaram, incluindo bloqueio de clique atrasado e preservação do toque seguinte.
