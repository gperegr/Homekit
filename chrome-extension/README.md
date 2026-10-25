# Tema Home Hub para Google Home Web

Extensão local do Chrome que aplica um tema inspirado no Apple Home a `home.google.com`. Ela injeta somente CSS na aba do Google Home. Não lê os aparelhos, não altera os comandos e não envia dados para nenhum servidor.

## Instalar no Chrome

1. Abra `chrome://extensions`.
2. Ative **Modo do desenvolvedor**.
3. Clique em **Carregar sem compactação**.
4. Selecione esta pasta `chrome-extension`.
5. Abra ou recarregue `https://home.google.com/`.

Para remover o tema, desative a extensão em `chrome://extensions`.

## Limites

O Google Home Web mantém sua própria estrutura e pode redesenhá-la. Este tema preserva as cores do Google para manter o contraste e o estado dos aparelhos; ajusta fontes, cantos e sombras comuns. Componentes encapsulados em Shadow DOM podem ignorar algumas regras. Os aparelhos e os controles continuam pertencendo ao Google Home; o tema não os copia para o painel Home Hub.
