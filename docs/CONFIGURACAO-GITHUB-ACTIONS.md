# Configuração do GitHub Actions

Repositório: M4Mistervale/senhor-vale-shorts

O workflow renderiza um Short vertical simples com TV CRT, ruído e áudio ambiente. O padrão inicial é publicar como **privado** para validação. Depois de testar, o status pode ser alterado para agendado ou público.

Segredos necessários no repositório:
- YOUTUBE_CLIENT_ID
- YOUTUBE_CLIENT_SECRET
- YOUTUBE_REFRESH_TOKEN

Nunca coloque o arquivo client_secret.json ou youtube_token.json no repositório. Eles permanecem fora do Git e os valores entram apenas como Secrets do GitHub.

O horário diário está configurado para 18h UTC, que corresponde a 15h no horário de Brasília durante o horário padrão. O envio manual fica disponível em Actions > Short diário — Senhor Vale > Run workflow.
