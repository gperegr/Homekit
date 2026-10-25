# Home Hub para Google Home Web

Extensão local do Chrome que transforma a tela de dispositivos do Google Home em uma interface inspirada no Apple Home. Inclui visão geral compacta, barra de cômodos recolhível, filtros por categoria, ícones específicos de cada ambiente e aparência clara ou escura.

O painel traz um relógio analógico com números, marcações e três ponteiros, atualizado pela hora local do computador. O cartão Tempo é inspirado no app Tempo e mostra previsão externa para a cidade escolhida: temperatura atual, condição, sensação térmica, máxima/mínima e próximas horas. A previsão é fornecida pelo [Open-Meteo](https://open-meteo.com/en/docs).

As superfícies usam vidro translúcido, bordas iluminadas e reflexos que acompanham o cursor. A paralaxe desloca suavemente o fundo e as camadas internas dos cartões, mantendo a área clicável estável. Os efeitos respondem apenas a um mouse com ponteiro preciso, pausam durante cliques e arrastos e respeitam a preferência do sistema por movimento reduzido. O efeito é uma aproximação visual em CSS de Liquid Glass.

Os cartões dos aparelhos continuam sendo os elementos originais do Google Home. A extensão reorganiza sua apresentação e observa os estados já exibidos pela página. Nenhuma credencial Google ou Positivo é solicitada. A aparência e o recolhimento da barra ficam na sessão atual do navegador.

Somente o módulo Tempo faz consultas externas, limitadas aos domínios de previsão e busca de cidades do Open-Meteo. Ele envia a busca de cidade ou suas coordenadas; nomes e estados dos aparelhos não são enviados. A cidade escolhida e o cache ficam em `chrome.storage.local`, com atualização a cada 20 minutos enquanto a aba está ativa. Uma falha de conexão mantém os dados anteriores com aviso explícito de que são dados salvos. A consulta usa um service worker da extensão, com permissões restritas a esses dois domínios.

## Instalação e atualização

1. Abra `chrome://extensions` e ative **Modo do desenvolvedor**.
2. Clique em **Carregar sem compactação** e selecione esta pasta `chrome-extension`.
3. Abra ou recarregue `https://home.google.com/` e entre na tela **Dispositivos**.

Se a extensão já estava carregada desta pasta, clique em **Recarregar** no cartão da extensão e atualize a aba do Google Home. A versão deve ser **0.6.0**.

O botão **Ver Google Home** restaura a interface original na aba. **Ativar Home Hub** volta ao tema. O botão de lua/sol alterna a aparência.

O botão de barra lateral, ao lado do botão de aparência, recolhe ou expande a lista de cômodos. Para ativar a previsão, clique em **Escolher cidade**, busque o nome e selecione o resultado correto. Para mudar a cidade, clique no nome que aparece no cartão Tempo. O relógio usa a hora do computador; o Tempo usa o fuso da cidade escolhida.

## Validação e limites

O layout foi renderizado em um Chrome isolado com uma cópia anonimizada da estrutura fornecida pelo usuário. Foram conferidos filtros, preservação dos elementos e eventos de clique, atualização de estado, alternância de tema, retorno à interface original e larguras de 1440, 1024 e 390 pixels, sem rolagem horizontal do conteúdo.

Os ícones dos seis ambientes, o acompanhamento do cursor, a estabilidade da área clicável e a suspensão dos efeitos com movimento reduzido também foram verificados nessa cópia local.

O relógio, os dois estados da barra lateral, a busca/seleção de cidade, a previsão horária e os estados de falha de rede foram conferidos no navegador com respostas de teste. A consulta real ao Open-Meteo também foi executada separadamente, usando São Paulo como cidade de teste.

Os testes do serviço de previsão não dependem de pacotes externos: `node --test tests/weather-worker.test.cjs`, executado a partir da raiz do repositório. Eles cobrem cache, consultas simultâneas, persistência da cidade, recusa de origens inválidas e falhas de rede.

Essa verificação não aciona aparelhos reais. Os recursos disponíveis continuam sendo os que o Google Home Web oferece para cada aparelho. A extensão depende dos componentes Angular atuais (`ghw-devices`, `.spaces-container`, `.space`, `.tile-container`, `.tile-column` e os cartões nativos); mudanças do Google podem exigir atualização.
