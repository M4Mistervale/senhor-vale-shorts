const clientId = process.env.X_CLIENT_ID;
const clientSecret = process.env.X_CLIENT_SECRET;
const refreshToken = process.env.X_REFRESH_TOKEN;

if (!clientId || !clientSecret || !refreshToken) {
  throw new Error('Secrets do X incompletos.');
}

const basic = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
const tokenResponse = await fetch('https://api.x.com/2/oauth2/token', {
  method: 'POST',
  headers: {
    authorization: `Basic ${basic}`,
    'content-type': 'application/x-www-form-urlencoded',
  },
  body: new URLSearchParams({
    refresh_token: refreshToken,
    grant_type: 'refresh_token',
    client_id: clientId,
  }),
});

if (!tokenResponse.ok) throw new Error(`Falha ao renovar acesso do X: ${tokenResponse.status}`);
const token = (await tokenResponse.json()).access_token;

const posts = {
  saturday: [
    'No apartamento, algumas coisas parecem normais demais. #SenhorVale #IndieGame',
    'A transmissão ainda não começou. Mesmo assim, a televisão está ligada. #SenhorVale #HorrorGame',
    'O silêncio também faz parte do cenário. Em breve, mais do universo Senhor Vale. #SenhorVale',
  ],
  extra: [
    'Bastidores: uma TV antiga, ruído analógico e uma pergunta que não deveria estar na tela. #SenhorVale',
    'ARG sem spoiler: se você encontrar um detalhe fora do lugar, talvez ele esteja esperando por você. #ARG #SenhorVale',
    'O mundo dos sonhos não precisa gritar para parecer errado. #IndieHorror #SenhorVale',
    'Cada cômodo conta uma parte da história. Alguns só contam quando ninguém está olhando. #SenhorVale',
  ],
};

const date = new Date();
const day = date.getUTCDay();
const week = Math.floor(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()) / 604800000);
const isSaturday = day === 6;
const isExtraDay = !isSaturday && day === ((week % 4) + 1); // segunda a quinta, varia por semana
if (!isSaturday && !isExtraDay) process.exit(0);

const pool = isSaturday ? posts.saturday : posts.extra;
const text = pool[week % pool.length];
const postResponse = await fetch('https://api.x.com/2/tweets', {
  method: 'POST',
  headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' },
  body: JSON.stringify({ text }),
});

if (!postResponse.ok) throw new Error(`Falha ao publicar no X: ${postResponse.status}`);
console.log(`Post do X publicado (${isSaturday ? 'semanal' : 'extra'}).`);
