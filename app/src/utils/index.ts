/**
 * @method formatSize
 * @param {number} oSize Byte size
 * @returns {string} Formatted byte size
 */
export const formatSize = oSize => {
  const koSize = oSize / 1000;

  if (koSize > 100) {
    const moSize = koSize / 1000;
    return moSize.toFixed(2) + 'mo';
  }

  return koSize.toFixed(2) + 'ko';
};

/**
 * @method isEmpty
 * @param {*} obj Object
 * @returns {boolean} Is empty (or not)
 */
export const isEmpty = obj => {
  if (typeof obj !== 'object') {
    throw new Error('Not an object');
  }

  return Object.entries(obj).length === 0;
};

/**
 * @method sortBy
 * @param {string} key
 */
export const sortBy = key => (a, b) =>
  a[key] > b[key] ? 1 : a[key] < b[key] ? -1 : 0;

/**
 * @method toCapitalize
 * @param {string} str Text
 * @returns {string} Capitalized text
 */
export const toCapitalize = (str: string): string => {
  return str.slice(0, 1).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * @method createDownloadLink
 * @param {Blob} blob
 * @param {string} fileName
 */
export const createDownloadLink = (blob: Blob, fileName: string) => {
  const url = window.URL.createObjectURL(new Blob([blob]));
  const link = document.createElement('a');

  link.href = url;
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  link.remove();
};
