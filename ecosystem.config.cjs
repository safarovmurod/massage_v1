module.exports = {
  apps: [{
    name: 'webapp',
    script: 'npx',
    args: 'serve dist -l 3000 -s',
    cwd: '/home/user/webapp',
    watch: false,
    instances: 1,
    exec_mode: 'fork'
  }]
}
