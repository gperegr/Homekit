# Galaxy S22 / Android 16 como painel HomeHub

O Firefox com Tampermonkey e HomeHub continua sendo o navegador do painel. O userscript Android 0.8.2.1 adiciona o botão de tela cheia no topo e desativa a entrada automática no protetor de tela interno. O relógio em tela cheia continua disponível manualmente. Ao retornar de uma aba/tela oculta, o protetor interno é fechado para mostrar o painel.

[Atualizar o HomeHub](https://raw.githubusercontent.com/gperegr/Homekit/main/dist/HomeHub-Android.user.js) no Firefox; confirme Atualizar no Tampermonkey e recarregue o Google Home. Toque no botão de quatro cantos no topo para entrar em tela cheia. O Firefox exige um toque para iniciar esse modo e pode sair dele por gesto, troca de app ou suspensão; o script não tenta forçar a reentrada nem interceptar comandos do sistema.

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
