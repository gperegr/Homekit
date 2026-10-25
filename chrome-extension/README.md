# Home Hub para Google Home Web

Extensão local do Chrome que transforma a tela de dispositivos do Google Home em uma interface inspirada no Apple Home. Inclui visão geral compacta, filtros por cômodo e categoria, ícones vetoriais específicos de cada ambiente e aparência clara ou escura.

As superfícies usam vidro translúcido, bordas iluminadas e reflexos que acompanham o cursor. A paralaxe desloca suavemente o fundo e as camadas internas dos cartões, mantendo a área clicável estável. Os efeitos respondem apenas a um mouse com ponteiro preciso, pausam durante cliques e arrastos e respeitam a preferência do sistema por movimento reduzido. O efeito é uma aproximação visual em CSS de Liquid Glass.

Os cartões dos aparelhos continuam sendo os elementos originais do Google Home. A extensão reorganiza sua apresentação e observa os estados já exibidos pela página. Nenhuma credencial é solicitada e o código não faz chamadas de rede. A seleção de aparência fica na sessão atual do navegador.

## Instalação e atualização

1. Abra `chrome://extensions` e ative **Modo do desenvolvedor**.
2. Clique em **Carregar sem compactação** e selecione esta pasta `chrome-extension`.
3. Abra ou recarregue `https://home.google.com/` e entre na tela **Dispositivos**.

Se a extensão já estava carregada desta pasta, clique em **Recarregar** no cartão da extensão e atualize a aba do Google Home. A versão deve ser **0.5.0**.

O botão **Ver Google Home** restaura a interface original na aba. **Ativar Home Hub** volta ao tema. O botão de lua/sol alterna a aparência.

## Validação e limites

O layout foi renderizado em um Chrome isolado com uma cópia anonimizada da estrutura fornecida pelo usuário. Foram conferidos filtros, preservação dos elementos e eventos de clique, atualização de estado, alternância de tema, retorno à interface original e larguras de 1440, 1024 e 390 pixels, sem rolagem horizontal do conteúdo.

Os ícones dos seis ambientes, o acompanhamento do cursor, a estabilidade da área clicável e a suspensão dos efeitos com movimento reduzido também foram verificados nessa cópia local.

Essa verificação não aciona aparelhos reais. Os recursos disponíveis continuam sendo os que o Google Home Web oferece para cada aparelho. A extensão depende dos componentes Angular atuais (`ghw-devices`, `.spaces-container`, `.space`, `.tile-container`, `.tile-column` e os cartões nativos); mudanças do Google podem exigir atualização.
