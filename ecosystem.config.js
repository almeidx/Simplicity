module.exports = {
  apps: [{
    autorestart: true,
    env: { NODE_ENV: 'production' },
    instances: 1,
    name: 'simplicity',
    script: 'src/index.js',
  }],
};
