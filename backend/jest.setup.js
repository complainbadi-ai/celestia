const { app } = require('./src/server');

module.exports = async () => {
  global.__SERVER__ = app.listen(3000);
};