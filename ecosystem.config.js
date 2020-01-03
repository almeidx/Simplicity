'use strict';

module.exports = {
  apps: [{
    name: 'simplicity',
    script: 'src/app.js',
    instances: 1,
    autorestart: true,
    env: {
      NODE_ENV: 'development',
    },
    env_production: {
      NODE_ENV: 'production',
    },
  }],
};
