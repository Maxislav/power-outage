module.exports = {
  apps : [{
    name: "power-outage",
    script: "./index.cjs",
    // Укажите полный путь к нужной версии node
    interpreter: "/root/.nvm/versions/node/v22.22.0/bin/node",
    env: {
      NODE_ENV: "production",
    }
  }]
}