module.exports = {
    apps: [
      {
        name: 'logistics-app',
        script: 'node_modules/next/dist/bin/next', // Next.js start script
        args: 'start -p 3000', // Run on port 3000
        instances: 1, // Can be 'max' for cluster mode
        autorestart: true,
        watch: false,
        max_memory_restart: '500M',
        env: {
          NODE_ENV: 'production', // Production mode
        },
        env_development: {
          NODE_ENV: 'development', // For dev (optional)
        },
      },
    ],
  };
  