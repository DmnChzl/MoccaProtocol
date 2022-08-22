import { decode, encode } from 'encoding/base64url.ts';

const textEncode = (str: string) => new TextEncoder().encode(str);
const textDecode = (arr: Uint8Array) => new TextDecoder().decode(arr);

/**
 * @method genKey
 * @param {string} str
 * @returns {CryptoKey}
 */
async function genKey(str: string): Promise<CryptoKey> {
  const rawKey = await crypto.subtle.importKey(
    'raw',
    textEncode(str),
    { name: 'HMAC', hash: 'SHA-256' },
    false, // Extractable
    ['sign', 'verify'] // Uses
  );

  return rawKey;
}

/**
 * @method getJwtByKey
 * @param {CryptoKey} key
 * @param {*} data
 * @returns {string} JWT
 */
async function getJwtByKey(key: CryptoKey, data: any): Promise<string> {
  const payload =
    encode(textEncode(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))) +
    '.' +
    encode(textEncode(JSON.stringify(data)));

  const signature = encode(
    new Uint8Array(
      await crypto.subtle.sign({ name: 'HMAC' }, key, textEncode(payload))
    )
  );

  return `${payload}.${signature}`;
}

/**
 * @method checkJwtByKey
 * @param {CryptoKey} key
 * @param {string} jwt
 * @returns {*} Data
 */
async function checkJwtByKey(key: CryptoKey, jwt: string) {
  const jwtParts = jwt.split('.');

  if (jwtParts.length !== 3) {
    throw new Error('JWT Length Failed');
  }

  const data = textEncode(jwtParts[0] + '.' + jwtParts[1]);

  if (
    await crypto.subtle.verify({ name: 'HMAC' }, key, decode(jwtParts[2]), data)
  ) {
    return JSON.parse(textDecode(decode(jwtParts[1])));
  }

  throw new Error('Check JWT Failed');
}

export { genKey, getJwtByKey, checkJwtByKey };
