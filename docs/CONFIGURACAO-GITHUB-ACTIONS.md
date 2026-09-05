# Configuração do GitHub Actions

Repositório: M4Mistervale/senhor-vale-shorts

O workflow renderiza um Short vertical simples com TV CRT, ruído e áudio ambiente. O padrão inicial é publicar como **privado** para validação. Depois de testar, o status pode ser alterado para agendado ou público.

Segredos necessários no repositório:
- YOUTUBE_CLIENT_ID
- YOUTUBE_CLIENT_SECRET
- YOUTUBE_REFRESH_TOKEN
- X_CLIENT_ID
- X_CLIENT_SECRET
- X_REFRESH_TOKEN
- X_ACCESS_TOKEN (opcional; o fluxo renova o acesso usando o refresh token)

## Posts automáticos no X

O workflow `Posts automáticos no X — Senhor Vale` executa diariamente, mas só publica quando a data corresponde ao calendário: um post autoral todo sábado e um segundo post em um dia útil variável por semana. O segundo post alterna entre ARG sem spoiler, bastidores e atmosfera do jogo. Nos outros dias, a execução termina sem publicar nada.

Nunca coloque o arquivo client_secret.json ou youtube_token.json no repositório. Eles permanecem fora do Git e os valores entram apenas como Secrets do GitHub.

O horário diário está configurado para 18h UTC, que corresponde a 15h no horário de Brasília durante o horário padrão. O envio manual fica disponível em Actions > Short diário — Senhor Vale > Run workflow.
