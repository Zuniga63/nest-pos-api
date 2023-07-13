/**
 * Util for create a simple slug
 * @param {string} text Texto a normalizar
 * @returns String
 */
export const createSlug = (text: string): string => {
  return text
    ? text
        .trim()
        .toLocaleLowerCase()
        .replace(/\s/gi, '-')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
    : '';
};

export const emailRegex = /^[^@]+@[^@]+.[^@]+$/;

export const strongPass = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})/;
