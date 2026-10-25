# Tema Home Hub para Google Home Web

Extensão local do Chrome que aplica um tema inspirado no Apple Home a `home.google.com`. O script observa a estrutura renderizada no navegador para compactar a navegação dos cômodos, organizar cartões em uma grade responsiva, mudar tipografia e substituir ícones de dispositivos conhecidos. Os mesmos cartões interativos permanecem no Google Home.

O script não faz chamadas de rede, não coleta credenciais e não envia dados. Ele precisa ler os nomes e estados já renderizados na página para identificar os cartões. A extensão é limitada ao domínio `home.google.com`.

## Instalar no Chrome

1. Abra `chrome://extensions`.
2. Ative **Modo do desenvolvedor**.
3. Clique em **Carregar sem compactação**.
4. Selecione esta pasta `chrome-extension`.
5. Abra ou recarregue `https://home.google.com/`.

Para remover o tema, desative a extensão em `chrome://extensions`.

## Limites

O tema foi ajustado aos componentes Angular observados no Google Home Web: `ghw-devices`, `.spaces-container`, `.space`, `.tile-container`, `.tile-column` e os cartões `.on-off-tile`, `.media-tile` e `.generic-tile`. O Google pode mudar esses seletores; se isso acontecer, algumas partes podem deixar de receber o tema. As cores de estado e os cartões originais são preservados.
