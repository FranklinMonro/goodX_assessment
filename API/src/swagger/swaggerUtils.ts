import { readdirSync, readFileSync } from 'fs';
import { resolve } from 'path';

import { SwaggerOptions } from 'swagger-ui-express';
import { routesPath } from '../server/apiPaths';
import { swaggerLogger as log } from '../server/winston';

const createSwaggerImport = (): SwaggerOptions => {
  try {
    return readdirSync(routesPath).map((folder: string) => {
      const swaggerfile = readdirSync(resolve(routesPath, folder)).filter(
        (file: string) => file.includes('swagger')
      )[0];
      return JSON.parse(
        readFileSync(resolve(routesPath, folder, swaggerfile), 'utf8')
      );
    });
  } catch (error) {
    log.error(`Error in createSwaggerImport: ${error}`);
    return [];
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const addToSwaggerConfig = (config: any): any => {
  const swaggerJson = createSwaggerImport();
  swaggerJson.forEach((eleIn: object) => {
    Object.entries(eleIn).forEach((inEntries) => {
      const entrykey1 =
        inEntries[0] !== null || inEntries[0] !== undefined ? inEntries[0] : '';
      if (entrykey1 === 'paths') {
        const keyConf1 = entrykey1 as keyof typeof config;
        const keyInc1 = entrykey1 as keyof typeof eleIn;
        Object.assign(config[keyConf1], eleIn[keyInc1]);
      }
      if (entrykey1 === 'components') {
        const schemas = inEntries[1] as keyof typeof entrykey1;
        Object.entries(schemas).forEach((ele) => {
          const entrykey2 =
            ele[0] !== null || ele[0] !== undefined ? ele[0] : '';
          const keyConf2 = entrykey2 as keyof typeof config;
          Object.assign(config[entrykey1][keyConf2], ele[1]);
        });
      }
    });
  });
  return config;
};

export default addToSwaggerConfig;
