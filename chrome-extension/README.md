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

O Google Home Web pode redesenhar sua estrutura. A extensão tenta reconhecer cômodos e cartões pela hierarquia visível, então alguns componentes podem ficar sem estilo se não forem encontrados. Ela preserva as cores de estado do Google e mantém os cartões originais, para que os controles continuem funcionando.
