import crypto from 'node:crypto';
import fs from 'node:fs';

const key = process.env.TUMBLR_CONSUMER_KEY;
const secret = process.env.TUMBLR_CONSUMER_SECRET;
if (!key || !secret) throw new Error('Secrets do Tumblr incompletos.');

const callback = 'https://github.com/M4Mistervale/senhor-vale-shorts';
const enc = encodeURIComponent;
const nonce = crypto.randomBytes(16).toString('hex');
const timestamp = Math.floor(Date.now() / 1000).toString();
const params = {oauth_callback: callback, oauth_consumer_key: key, oauth_nonce: nonce, oauth_signature_method: 'HMAC-SHA1', oauth_timestamp: timestamp, oauth_version: '1.0'};
const normalized = Object.keys(params).sort().map(k => `${enc(k)}=${enc(params[k])}`).join('&');
const base = `POST&${enc('https://www.tumblr.com/oauth/request_token')}&${enc(normalized)}`;
const signature = crypto.createHmac('sha1', `${enc(secret)}&`).update(base).digest('base64');
const header = Object.entries({...params, oauth_signature: signature}).sort().map(([k,v]) => `${enc(k)}="${enc(v)}"`).join(', ');
const res = await fetch('https://www.tumblr.com/oauth/request_token', {method:'POST', headers:{Authorization:`OAuth ${header}`}});
if (!res.ok) throw new Error(`Falha ao solicitar autorização do Tumblr: ${res.status}`);
const data = Object.fromEntries(new URLSearchParams(await res.text()));
if (!data.oauth_token || !data.oauth_token_secret) throw new Error('Resposta inválida do Tumblr.');
fs.writeFileSync('tumblr-oauth-state.json', JSON.stringify({oauth_token:data.oauth_token, oauth_token_secret:data.oauth_token_secret, created_at:Date.now()}));
console.log(`Abra este link para autorizar o blog: https://www.tumblr.com/oauth/authorize?oauth_token=${data.oauth_token}`);
console.log('Depois da aprovação, o Tumblr redirecionará para o GitHub com oauth_token e oauth_verifier.');
