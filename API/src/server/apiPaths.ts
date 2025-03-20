import { dirname, resolve } from 'path';

const baseDirectory = dirname(__dirname);
const routesPath = resolve(baseDirectory, 'routes');
const templatePath = resolve(baseDirectory, 'templates');

export { routesPath, templatePath };
