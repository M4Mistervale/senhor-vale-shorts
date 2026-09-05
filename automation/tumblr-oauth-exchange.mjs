import fs from 'node:fs';
import crypto from 'node:crypto';

const enc = s => encodeURIComponent(s);
const sign = (method, url, params, secret) => {
  const normalized = Object.entries(params).sort().map(([k,v]) => `${enc(k)}=${enc(v)}`).join('&');
  const base = `${method}&${enc(url)}&${enc(normalized)}`;
  return crypto.createHmac('sha1', secret).update(base).digest('base64');
};
const { TUMBLR_CONSUMER_KEY:key, TUMBLR_CONSUMER_SECRET:consumerSecret, OAUTH_TOKEN, OAUTH_VERIFIER } = process.env;
if (!key || !consumerSecret || !OAUTH_TOKEN || !OAUTH_VERIFIER) throw new Error('Faltam dados da autorização.');
const state = JSON.parse(fs.readFileSync('tumblr-oauth-state.json', 'utf8'));
if (state.oauth_token !== OAUTH_TOKEN) throw new Error('O token não corresponde ao estado salvo.');
const url = 'https://www.tumblr.com/oauth/access_token';
const params = {oauth_consumer_key:key, oauth_nonce:crypto.randomBytes(16).toString('hex'), oauth_signature_method:'HMAC-SHA1', oauth_timestamp:Math.floor(Date.now()/1000).toString(), oauth_token:OAUTH_TOKEN, oauth_verifier:OAUTH_VERIFIER, oauth_version:'1.0'};
const header = Object.entries({...params, oauth_signature:sign('POST',url,params,consumerSecret+'&'+state.oauth_token_secret)}).sort().map(([k,v])=>`${enc(k)}="${enc(v)}"`).join(', ');
const res = await fetch(url,{method:'POST',headers:{Authorization:`OAuth ${header}`}});
const body = await res.text();
if (!res.ok) throw new Error(`Tumblr recusou a troca (${res.status}).`);
const out = Object.fromEntries(new URLSearchParams(body));
if (!out.oauth_token || !out.oauth_token_secret) throw new Error('Tumblr não retornou os tokens de publicação.');
fs.writeFileSync('tumblr-access-tokens.json', JSON.stringify(out));
console.log('Tokens gerados e salvos no artefato protegido.');
