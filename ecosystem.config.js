module.exports = {
  apps: [
    {
      name: 'backform',
      script: 'dist/server.js',
      exec_mode: 'cluster',
      instances: 2,
      autorestart: true,
      watch: false,
      ignore_watch: ['node_modules', 'logs'],
      max_memory_restart: '1G',
      merge_logs: true,
      output: './logs/access.log',
      error: './logs/error.log',
      env: {
        NODE_ENV: 'development',
        PORT: 8585,
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 8585,
      },
    },
  ],
};
