import { createHash } from 'hash/mod.ts';

/**
 * @method getHash
 * @param {string} message
 * @returns {string}
 */
export const getHash = (message: string): string => {
  return createHash('sha256').update(message).toString();
};

/**
 * @method getUniversallyUniqueIdentifier
 * @returns {string} UUID V4
 */
export const getUniversallyUniqueIdentifier = () => {
  const PATTERN = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';

  return PATTERN.replace(/[xy]/g, (char: string) => {
    const random = (Math.random() * 16) | 0,
      idx = char === 'x' ? random : (random & 0x3) | 0x8;
    return idx.toString(16);
  });
};

/**
 * @method getUniqueIdentifier
 * @returns {string} Base 36 Token
 */
export const getUniqueIdentifier = (): string => {
  return Math.random().toString(36).substring(2);
};

/**
 * @method sortBy
 * @param {string} key
 */
export const sortBy = (key: string) => (a: any, b: any) =>
  a[key] > b[key] ? 1 : a[key] < b[key] ? -1 : 0;

/**
 * @method urlWrapper
 * @param {string} url
 * @returns {*} { address, host, port, toHttp(), toWs() }
 */
export const urlWrapper = (url: string) => {
  const address = url
    .replace(/(http(s?):\/\/)/, '')
    .replace(/(ws(s?):\/\/)/, '');

  const [, host, port] = address.match(/([^\:]+):([0-9]{4,5})/) as string[];

  const toHttp = (secure = false): string =>
    `http${secure ? 's' : ''}://${address}`;

  const toWs = (secure = false): string =>
    `ws${secure ? 's' : ''}://${address}`;

  return {
    address,
    host,
    port,
    toHttp,
    toWs
  };
};

/**
 *
 * @method hasKey
 * @param {*} obj Object
 * @param {string} key
 * @returns {boolean} hasOwnProperty
 */
export const hasKey = (obj: any, key: string): boolean => {
  const objKeys = Object.keys(obj);
  return objKeys.includes(key);
};
