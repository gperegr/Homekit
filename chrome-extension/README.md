# Home Hub para Google Home Web

Extensão local do Chrome que transforma a tela de dispositivos do Google Home em uma interface inspirada no Apple Home e no mockup `index.html`. Inclui acessórios com ícones maiores, dock inferior flutuante para navegar entre cômodos, filtros por categoria e aparência clara ou escura.

O painel traz um relógio analógico com números, marcações e três ponteiros, atualizado pela hora local do computador. O cartão Tempo é inspirado no app Tempo e mostra previsão externa para a cidade escolhida: temperatura atual, condição, sensação térmica, máxima/mínima e próximas horas. A previsão é fornecida pelo [Open-Meteo](https://open-meteo.com/en/docs).

O calendário mensal destaca o dia atual, permite navegar entre meses e não inclui compromissos nem uma integração de agenda. O modo ambiente mostra hora, data e temperatura em uma sobreposição de tela inteira dentro da aba, com fundo desfocado. Ele pode ser aberto manualmente ou entra após um minuto sem interação. O clique ou tecla usado para sair é consumido pela sobreposição, evitando acionar um aparelho por baixo.

As superfícies usam vidro translúcido, bordas iluminadas e reflexos que acompanham o cursor. A paralaxe desloca suavemente o fundo e as camadas internas dos cartões, mantendo a área clicável estável. Os efeitos respondem apenas a um mouse com ponteiro preciso, pausam durante cliques e arrastos e respeitam a preferência do sistema por movimento reduzido. O efeito é uma aproximação visual em CSS de Liquid Glass.

Os cartões dos aparelhos continuam sendo os elementos originais do Google Home. A extensão reorganiza sua apresentação e observa os estados já exibidos pela página. Nenhuma credencial Google ou Positivo é solicitada. A aparência e a versão compacta do dock ficam na sessão atual do navegador.

Somente o módulo Tempo faz consultas externas, limitadas aos domínios de previsão e busca de cidades do Open-Meteo. Ele envia a busca de cidade ou suas coordenadas; nomes e estados dos aparelhos não são enviados. A cidade escolhida e o cache ficam em `chrome.storage.local`, com atualização a cada 20 minutos enquanto a aba está ativa. Uma falha de conexão mantém os dados anteriores com aviso explícito de que são dados salvos. A consulta usa um service worker da extensão, com permissões restritas a esses dois domínios.

## Instalação e atualização

1. Abra `chrome://extensions` e ative **Modo do desenvolvedor**.
2. Clique em **Carregar sem compactação** e selecione esta pasta `chrome-extension`.
3. Abra ou recarregue `https://home.google.com/` e entre na tela **Dispositivos**.

Se a extensão já estava carregada desta pasta, clique em **Recarregar** no cartão da extensão e atualize a aba do Google Home. A versão deve ser **0.8.0**.

O ícone **Ver Google Home**, na ponta direita do dock, restaura a interface original na aba. **Ativar Home Hub** volta ao tema. O botão de lua/sol alterna a aparência.

O botão de dock no topo alterna entre ícones com nomes e uma barra compacta. O botão de lua com estrelas abre o protetor de tela; clique ou pressione uma tecla para voltar. Esse modo funciona dentro da aba, e a suspensão da tela continua sob controle do macOS.

Para ativar a previsão, clique em **Escolher cidade**, busque o nome e selecione o resultado correto. Para mudar a cidade, clique no nome que aparece no cartão Tempo. O relógio usa a hora do computador; o Tempo usa o fuso da cidade escolhida.

## Validação e limites

O layout foi renderizado em um Chrome isolado com uma cópia anonimizada da estrutura fornecida pelo usuário. Foram conferidos filtros, preservação dos elementos e eventos de clique, atualização de estado, alternância de tema, retorno à interface original e larguras de 1440, 1024 e 390 pixels, sem rolagem horizontal do conteúdo.

Os ícones dos seis ambientes, o acompanhamento do cursor, a estabilidade da área clicável e a suspensão dos efeitos com movimento reduzido também foram verificados nessa cópia local.

O relógio, os dois estados da barra lateral, a busca/seleção de cidade, a previsão horária e os estados de falha de rede foram conferidos no navegador com respostas de teste. A consulta real ao Open-Meteo também foi executada separadamente, usando São Paulo como cidade de teste.

O dock inferior, os ícones de acessórios com 38 px, o calendário com fevereiro de 29 dias, o protetor de tela manual e automático e a saída sem clique no aparelho por baixo foram conferidos na cópia anonimizada. O modo automático aguarda quando há um diálogo ou painel de controle aberto.

Os testes do serviço de previsão não dependem de pacotes externos: `node --test tests/weather-worker.test.cjs`, executado a partir da raiz do repositório. Eles cobrem cache, consultas simultâneas, persistência da cidade, recusa de origens inválidas e falhas de rede.

Essa verificação não aciona aparelhos reais. Os recursos disponíveis continuam sendo os que o Google Home Web oferece para cada aparelho. A extensão depende dos componentes Angular atuais (`ghw-devices`, `.spaces-container`, `.space`, `.tile-container`, `.tile-column` e os cartões nativos); mudanças do Google podem exigir atualização.

A grade usa módulos quadrados: relógio, calendário e acessórios ocupam um módulo, e o Tempo ocupa dois módulos com a mesma altura. Grupos expandidos formam uma faixa própria com o cartão principal e os controles internos quadrados; os elementos e eventos nativos do Google são preservados. As proporções foram verificadas em larguras de 320, 390, 800, 1024 e 1440 px, incluindo a inserção e remoção dinâmica dos controles de grupo.

Também há uma distribuição para Safari em [safari-extension](../safari-extension/README.md), gerada desta mesma base.
