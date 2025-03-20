import addToSwaggerConfig from './swaggerUtils';

const config = {
  openapi: '3.0.3',
  info: {
    version: '1.0.0',
    title: 'API',
    description: 'Endpoints for API',
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT',
    },
  },
  servers: [
    {
      url: '/api/',
      description: 'Local Dev',
    },
  ],
  tags: [
    {
      name: 'Create Swagger',
      description: 'API end points',
    },
  ],
  consumes: ['application/json'],
  produces: ['application/json'],
  paths: {},
  components: {
    schemas: {},
  },
};

export default addToSwaggerConfig(config);
