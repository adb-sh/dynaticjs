export const propFactory = value => ({ value });
export const propFactoryDeep = value => ({ value, deepWatch: true });
export const camelToSnake = str => str.replaceAll(/(?!^)([A-Z])/g, '-$1').toLowerCase();
export const matchEmail = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
export const objectMap = (obj, mapper) => Object.fromEntries(Object.entries(obj).map(mapper));
export const log = (...args) => console.log.apply(console, ['[' + new Date().toISOString().slice(11, -5) + ']'].concat(Array.prototype.slice.call(args)));
