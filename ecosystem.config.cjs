module.exports = {
  apps: [
    {
      name: 'webapp',
      script: 'npx',
      args: 'serve dist -l 3000 -s',
      watch: false,
      instances: 1,
      exec_mode: 'fork'
    }
  ]
}
