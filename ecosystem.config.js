module.exports = {
  apps: [
    {
      name: "backform",
      script: "node_modules/.bin/next",
      args: "start -p 3010",
      exec_mode: "cluster",
      instances: 2,
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      output: "./logs/access.log",   // stdout
      error: "./logs/error.log",     // stderr
      env_production: {
        NODE_ENV: "production",
        PORT: 8585
      },
    },
  ],
};
